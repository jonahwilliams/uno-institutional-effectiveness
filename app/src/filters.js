myApp.filter('nameFilter', function(){
  return function(input, columns) {

    var output;
	if (columns){
		if (columns.hasOwnProperty(input)){
			output = columns[input].n;	
		}
		else {
			output = input;
		}
	}
	else {
		output = input;
	}
	
    return output;
	
  }	
});

myApp.filter('unitFilter', function($filter){
  return function(input, key, columns) {

    var output;
	var unit;
	if(columns){
		if (columns.hasOwnProperty(key)){
			unit = columns[key].u;
		}
		else {
			unit = "n";
		}
	    
		
		if (unit == "n"){
			output = $filter('number')(input, 0);
		}
		else if (unit =="%"){
			output = $filter('number')(input, 2) + "%";
		}
		else if (unit == "$"){
			output = $filter('currency')(input,'$', 0);
		}
		else if (unit == "r"){
			output = $filter('number')(input, 3);
		}
		else {
			output = input;
		}
	}
	else {
		output = input;
	}
    return output;

  }	
});

myApp.filter('columnFilter', function(){
	return function(input, keyx, keyy){
	  var output = {}
	  
	  if (input.hasOwnProperty(keyy)){
	  	output[keyy] = input[keyy];
	  }
	  if (input.hasOwnProperty(keyx)){
	  	output[keyx] = input[keyx];
	  }
	  return output;	
	}
});

