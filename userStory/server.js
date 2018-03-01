var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');// *dot slash is for calling the file from same directory*
//Connecting the database 
var mongoose = require('mongoose');


var app = express();

mongoose.connect(config.database,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Connected to a database");
	}
});


app.use(bodyParser.urlencoded({extended:true}));// true means that it allows you to send data but if it was false then it would only allow string
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname+'/public')); //For getting the static js file for the front end

var api = require('./app/route/api')(app, express);
app.use('/api',api);


app.get('*',function(req,res){//parameters which send a request and ask for a response here we deal with file call index and * allows any route
	res.sendFile(__dirname + '/public/app/views/index.html');//responding with a hyml file
});

app.listen(config.port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Listening on port "+config.port);
	}
});