var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var port =   process.env.PORT || 8080;

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app')));


app.use('/', routes);
app.listen(port);

module.exports = app;
