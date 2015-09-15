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


<h1>Restful Api</h1>
contained in /routes/index.js. This part of the app connects to our Postgres
database hosted on heroku.  it takes a url parameter for year and does a
 check to ensure its validity.  Note that it does not directly pass this parameter
 to pg, so we should be in the clear for sql-injection.
