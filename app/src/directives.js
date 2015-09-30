/* global myApp, d3 */
myApp.directive('scatterPlot', function($filter){
    function link(scope, el) {

        var margin = {top: 50, right: 10, bottom: 40, left: 60};
        var width = 600 - margin.left - margin.right;
        var height= 600 - margin.top - margin.bottom;

        var svg = d3.select(el[0]).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var xScale = d3.scale.linear()
          .range([0, width])
          .domain([0, 1]);
        var yScale = d3.scale.linear()
          .range([height, 0])
          .domain([0, 1]);
        var zScale = d3.scale.linear()
          .range([3, 5])
          .domain([0, 1]);

        var points = svg.selectAll('circle')
            .data([0,1]);

        var xAxis = d3.svg.axis()
            .orient('bottom')
            .ticks(4)
            .scale(xScale);

        var yAxis = d3.svg.axis()
            .orient('left')
            .ticks(4)
            .scale(yScale);

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-2, 0])
          .html(function (d) {
                return '<small>' + d.instnm + '</small>';
            });
        svg.call(tip);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

        //Axis Labels
        var xLabel = svg.append('text')
          .attr('class', 'x label')
          .attr('text-anchor', 'end')
          .style('font-size','1.2em')
          .attr('x', width)
          .attr('y', height + 35)
          .text('a');

        var yLabel = svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'end')
          .attr('y', -60)
          .style('font-size', '1.2em')
          .attr('dy', '1.5em')
          .attr('transform', 'rotate(-90)')
          .text('a');

        scope.$watchGroup([
            'data',
            'accessorX',
            'accessorY',
            'selectedPoint',
            'usePeers',
            'customPeer'], function (newValues, oldValues, scope) {
            var accessorX = newValues[1];
            var accessorY = newValues[2];
            var selectedPoint = newValues[3];
            var data = newValues[0];
            if (newValues[4]){
                var currentPeers = newValues[5];
                data = newValues[0].filter(function(d){
                    return currentPeers.indexOf(d.instnm) > -1;
                });
            }
            else {
                data = newValues[0];
            }

          // Remove crosshair so we can put them at the top of the svg
            svg.selectAll('line').remove();


            xScale.domain([0, d3.max(data, function(d){
                return d[accessorX];
            })]);
            yScale.domain([0, d3.max(data, function(d){
                return d[accessorY];
            })]);
            zScale.domain([
                d3.min(data, function(d){
                    return d.headcount;
                }),
                d3.max(data, function(d){
                    return d.headcount;
                })
            ]);

            xAxis.scale(xScale);
            yAxis.scale(yScale);
            // Adjust crosshair
            // Transition Axes
            d3.selectAll('g.x.axis')
              .transition()
              .call(xAxis);

            d3.selectAll('g.y.axis')
              .transition()
              .call(yAxis);


            //Axes Labels
            xLabel.text(function () {
                return $filter('nameFilter')(accessorX, scope.columns);
            });
            yLabel.text(function () {
                return $filter('nameFilter')(accessorY, scope.columns);
            });



            // Data Join
            var points = svg.selectAll('circle')
              .data(data);

              // Update Elements
            points.attr('class', 'update')
                .transition()
                .duration(250)
                .attr('r', function (d) {
                    return zScale(d.headcount);
                })
                .attr('cx', function (d) {
                    return xScale(d[accessorX]); })
                .attr('cy', function(d){
                    return yScale(d[accessorY]); })
                .style('fill', function(d){
                    if (d.instnm == selectedPoint.instnm){
                        return 'red';
                    } else {
                        return 'black';
                    }
                });


            // Enter Elements
            points.enter()
                .append('circle')
                .attr('cx', function (d) {
                    return xScale(d[accessorX]);
                })
                .attr('cy', function (d) {
                    return yScale(d[accessorY]);
                })
                .attr('r', function(d){
                    return zScale(d.headcount);
                })
                .style('opacity', 0.7)
                .style('fill', function(d){
                    if (d.n == scope.selectedPoint.instnm) {
                        return 'red';
                    } else {
                        return 'black';
                    }
                })
              .on('click', function (d) {
                scope.$apply(function () {
                        scope.selectedPoint = d;
                    });
              })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
              .style('fill-opacity', 1e-6)
              .transition()
              .duration(250)
              .style('fill-opacity', 1);

         // Exit Elements
            points.exit()
              .attr('class', 'exit')
              .transition()
              .duration(250)
              .style('fill-opacity', 1e-6)
              .remove();

        svg.append('line')
            .attr('class', 'cross')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', function(d){
                return yScale(selectedPoint[accessorY]);
            })
            .attr('y2', function(d){
                return yScale(selectedPoint[accessorY]);
            })
            .style('stroke-width', 1)
            .style('stroke', 'red');

       svg.append('line')
            .attr('class', 'cross')
            .attr('y1', 0)
            .attr('y2', height)
            .attr('x1', function(d){
                return xScale(selectedPoint[accessorX]);
            })
            .attr('x2', function(d){
                return xScale(selectedPoint[accessorX]);
            })
            .style('stroke-width', 1)
            .style('stroke', 'red');

        }, true);

    }
    var directive = {
        link: link,
        restrict: 'E',
        scope: {
            data: '=',
            selectedPoint: '=',
            accessorX: '=',
            accessorY: '=',
            columns: '=',
            usePeers: '=',
            customPeer: '='
        }
    };
    return directive;
});


myApp.directive('sortableTable', function($filter){

    function link(scope, el) {

      var table = d3.select(el[0])
        .append('table')
        .attr('class', 'table table-condensed');

      var thead = table.append('thead')
        .attr('class','sortable-table');
      var tbody = table.append('tbody')
        .attr('class','sortable-table');

      var cols = [
          'instnm', 'headcount', 'admins', 'instructors',
          'asalpm',
          'isalpm', 'adpts','inspts', 'grad4',
          'grad6','degpts','schps','defrate'
      ];

      scope.$watchGroup(['data','customPeer','sortCol','columns'],
          function(newValues, oldValues, scope){
        var data = newValues[0];
        var peers = newValues[1];
        var sortCol = newValues[2];
        var columns = newValues[3];

        data = data.filter(function(d){
            return peers.indexOf(d.instnm) > -1;
        });

        var percentile = data.map(function(d){
                return d[sortCol];
            })
            .sort(function(a, b){
                if (sortCol == 'defrate'){
                    return b - a;
                } else {
                    return a - b;
                }
            });

        d3.selectAll('.sortable-table').remove();


        var thead = table.append('thead')
           .attr('class','sortable-table');
        var tbody = table.append('tbody')
            .attr('class','sortable-table');

        var header = thead.append('tr')
    		.selectAll('th')
    		.data(cols)
    		.enter()
    		.append('th')
    		.text(function(d, i ){
                if (i > 0){
                    return $filter('nameFilter')(d, columns);
                }
                else {
                    return ' ';
                }
            })
            .style('color', function(d){
               if (sortCol == d){
                   return 'blue';
               } else {
                   return '';
               }
            });

        var rows = tbody.selectAll('tr')
    		.data(data.sort(function(a, b){
                if (sortCol == 'defrate'){
                    return a[sortCol] - b[sortCol]
                } else {
                    return b[sortCol] - a[sortCol]
                }
            }))
    		.enter()
    		.append('tr')
            .attr('class', function(d){
                if (percentile.indexOf(d[sortCol]) / percentile.length < 0.33){
                    return 'danger';
                }
                else if (percentile.indexOf(d[sortCol]) / percentile.length > 0.66){
                    return 'info';
                }
                else {
                    return '';
                }
            })


	    var cells = rows.selectAll('td')
	       .data(function(row){
			     return cols.map(function(d, i){
                     if (i > 0){
				        return {i: d, value: $filter('unitFilter')(row[d], cols[i],columns)};
                      }
                      else {
                        return {i: d, value: row[d]}
                      }
			     });
            }).enter()
    		.append('td')
    		.html(function(d){ return d.value; });

      },true)
   }
   var directive = {
       link: link,
       restrict: 'E',
       scope: {data: '=', customPeer: '=', sortCol: '=', columns: '='}
   };
   return directive
});


myApp.directive('summaryTable', function($filter){

   function link(scope, el, attr){

      var table = d3.select(el[0])
        .append('table')
        .attr('class', 'table table-condensed');

      var thead = table.append('thead')
        .attr('class','summary-table');
      var tbody = table.append('tbody')
        .attr('class','ssummary-table');

        var cols = [
            'instnm', 'headcount', 'admins', 'instructors',
            'asalpm',
            'isalpm', 'adpts','inspts', 'grad4',
            'grad6','degpts','schps','defrate'
        ];

      scope.$watchGroup(['data','customPeer','sortCol','columns'],
          function(newValues, oldValues, scope){
        var data = newValues[0];
        var peers = newValues[1];
        var sortCol = newValues[2];
        var columns = newValues[3];

        data = data.filter(function(d){
            return peers.indexOf(d.instnm) > -1;
        });


        var percentile = data.map(function(d){
                return d[sortCol];
            })
            .sort(function(a, b){
                if (sortCol == 'defrate'){
                    return b - a;
                } else {
                    return a - b;
                }
            });


        var lower_data = {'instnm': 'Bottom Third'};
        var middle_data = {'instnm': 'Middle Third'};
        var upper_data = {'instnm': 'Top Third'};

        for (var i = 1; i < cols.length; i++) {
            lower_data[cols[i]] = [0];
            middle_data[cols[i]] = [0];
            upper_data[cols[i]] = [0];
        }

        for (var i = 0; i < data.length; i++) {
            if (percentile.indexOf(data[i][sortCol]) / percentile.length < 0.33){
                for (var j = 1; j < cols.length; j++) {
                    lower_data[cols[j]].push(data[i][cols[j]]);
                }
            }
            else if (percentile.indexOf(data[i][sortCol]) / percentile.length > 0.66){
                for (var j = 1; j < cols.length; j++) {
                    upper_data[cols[j]].push(data[i][cols[j]]);
                }
            }
            else {
                for (var j = 1; j < cols.length; j++) {
                    middle_data[cols[j]].push(data[i][cols[j]]);
                }
            }
        }

        for (var i = 1; i < cols.length; i++){
            lower_data[cols[i]] = lower_data[cols[i]]
              .reduce(function(a, b) {
                return a + b;
            }) / (lower_data[cols[i]].length - 1);
            middle_data[cols[i]] =  middle_data[cols[i]]
              .reduce(function(a, b) {
                return a + b;
            }) / (middle_data[cols[i]].length - 1);
            upper_data[cols[i]] =  upper_data[cols[i]]
              .reduce(function(a, b) {
                return a + b;
            }) / (upper_data[cols[i]].length - 1);
        }

        data = [upper_data, middle_data, lower_data];

        d3.selectAll('.summary-table').remove();


        var thead = table.append('thead')
           .attr('class','sortable-table');
        var tbody = table.append('tbody')
            .attr('class','sortable-table');

        var header = thead.append('tr')
    		.selectAll('th')
    		.data(cols)
    		.enter()
    		.append('th')
    		.text(function(d, i ){
                if (i > 0){
                    return $filter('nameFilter')(d, columns);
                }
                else {
                    return ' ';
                }
            })
            .style('color', function(d){
               if (sortCol == d){
                   return 'blue';
               } else {
                   return '';
               }
            });

        var rows = tbody.selectAll('tr')
    		.data(data.sort(function(a, b){
                if (sortCol == 'defrate'){
                    return a[sortCol] - b[sortCol]
                } else {
                    return b[sortCol] - a[sortCol]
                }
            }))
    		.enter()
    		.append('tr')
            .attr('class', function(d, i ){
                if (i == 0){
                    return 'info';
                }
                else if (i == 1){
                    return '';
                }
                else {
                    return 'danger';
                }
            })


	    var cells = rows.selectAll('td')
	       .data(function(row){
			     return cols.map(function(d, i){
                     if (i > 0){
				        return {i: d, value: $filter('unitFilter')(row[d], cols[i],columns)};
                      }
                      else {
                        return {i: d, value: row[d]}
                      }
			     });
            }).enter()
    		.append('td')
    		.html(function(d){ return d.value; });

      },true)
   }
   var directive = {
       link: link,
       restrict: 'E',
       scope: {data: '=', customPeer: '=', sortCol: '=', columns: '='}
   };
   return directive
});
