Simple Webapp to display college administrative cost performance for UNO.  There
are four main components: The RESTful API (Node), Express server (Node), The client
app (Angular), and a Postgres database.  Currently the Express server and database
api are in the same node app.


<h1>Angular App</h1>
The client app is contained within the /public directory.
The app is written Angular, though it needs some work!  There is a single
controller 'DataCtrl' which is current functioning as a service as well.
To read more, look at the documentation in the public folder

<h1>Express Server</h1>
Since our MVC is client-side, the only thing our express server needs to do
is build our ejs templates (this needs to be removed!) and send to the client.
this is the app.js file in the project root.


<h3>What is Express?</h3>
a minimal and flexible framework for web and mobile applications, see more [here](http://expressjs.com/)

Here we load in the required modules from npm.  Path ensures we have the correct slashes to make filepaths, 
bodyparser automatically grabs params from GET/POST/.. requests, Finally express is the framework which handles 
the http boilerplate.  We also load in the code for our restful api with routes, and mount our express app.

```javascript
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var port =   process.env.PORT || 8080;
var app = express();
```

Next we define the middleware to use and set the static file directory.

```javascript
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
```

This is the part where we initalize our ejs parser. THIS IS BAD!  Since we are using angular now we really don't 
need html templating for our app.
```javascript
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

Here we tell the app about the specifc routes for our api and static file server, and listen to the correct port.
I used 8080 for testing, but you should always use the enviornment variable port for production.
```javascript
app.use('/', routes);
app.listen(port);
```

<h1>Restful Api</h1>
contained in /routes/index.js. This part of the app connects to our Postgres
database hosted on heroku.  it takes a url parameter for year and does a
 check to ensure its validity.  Note that it does not directly pass this parameter
 to pg, so we should be in the clear for sql-injection.
