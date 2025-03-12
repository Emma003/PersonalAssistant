//dotenv package allows to load env vars from a .env file into process.env object
require('dotenv').config();

//import express
const express = require('express');

//import workout routes
const homepageRoutes = require('./routes/homepage');

//start express app
const app = express();

//global middleware
app.use(express.json()); //parse json bodies of requests (if it exists) and attaches it to req.body

app.use((req, res, next) => {
    console.log(req.path, req.method); //logs the path and method of every request
    next(); //called when this middleware is done running (to move on to the next middleware)
}
);

//use routes
app.use('/api/home', homepageRoutes);

//listen for requests
app.listen(process.env.PORT, () => { //we only want to listen to requests after we have connected to the db
    console.log('connected to db and listening on port 1111 :)');
})





