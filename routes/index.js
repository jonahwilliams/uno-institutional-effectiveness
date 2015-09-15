var express = require('express');
var path = require('path');
var router = express.Router();
var pg = require('pg');
var keenIO = require('keen.io');

var connection_string = process.env.DATABASE_URL || 'postgres://localhost:5432/institutions';


//Configure KEEN logging
var keen = keenIO.configure({
    projectId: process.env.KEEN_PROJECT_ID || 'test',
    writeKey: process.env.KEEN_WRITE_KEY || 'test'
});


/* GET home page. */
router.get('/', function (req, res) {
    res.render(path.join(__dirname, '../views', '/pages/index.ejs'));
    keen.addEvent('hit', {ip_add: req.ip},
        function (err) {
            if (err){
                console.log(err);
            }
        });
});


router.get('/api/v1/schools', function (req, res) {
    var results = [];
    var year = req.query.year;
    var order = req.query.order;
    var queryString;

    //validate Data
    if (year == 2012) {
        queryString = 'SELECT * FROM Schools, Data ' +
                'WHERE Schools.unitid = Data.unitid ' +
                'AND Data.year = 2012;';
    } else if (year == 2013) {
        queryString = 'SELECT * FROM Schools, Data ' +
                'WHERE Schools.unitid = Data.unitid ' +
                'AND Data.year = 2013;';
    } else {
        queryString = 'SELECT * FROM Schools, Data ' +
                'WHERE Schools.unitid = Data.unitid ' +
                'AND Data.year = 2013;';
    }

    keen.addEvent('db_access',
            {ip_add: req.ip, year: year, order_by: order},
            function (err) {
                if (err) {
                    console.log(err);
                }
            });

    // Get a Postgres client from the connection pool
    pg.connect(connection_string, function (err, client) {
        var query = client.query(queryString);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            process.stderr.write(err);
        }

    });
});

module.exports = router;
