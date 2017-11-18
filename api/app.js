const express		= require("express");
const app			= express();
const port			= process.env.PORT || 8080;

const moment		= require('moment');
const mongoose		= require('mongoose');
const cors			= require('cors');

const http			= require("http");

const server		= http.createServer(app);

mongoose.plugin(require('meanie-mongoose-to-json'));

require("fs").readdirSync("./src/models").forEach(function(file) {
  require("./src/models/" + file);
});

const bodyParser	= require('body-parser');
const routes		= require('./src/config/routes');


//######################
//	 Connecting to DB
//######################

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/stargazer', { useMongoClient: true }, function (err) {});

//#########################
//	 Authorization headers
//#########################

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
	next();
});

app.use(express.static('/uploads'));

app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use(bodyParser.json());
app.use (function (error, req, res, next){
	if (res.req._parsedUrl.path)
		return res.status(403).json({'errors': "Votre image doit etre inferieur à 30mb"});
    console.log("Une requete n'a pas abouti depuis: " + req.connection.remoteAddress);
});

//######################
//	 Starting the App
//######################

routes(app);
server.listen(port);

console.log('\x1Bc\x1b[32mApi compiled successfully on port:'+port+'\x1b[0m\n'+moment().format('HH:mm:ss'));
