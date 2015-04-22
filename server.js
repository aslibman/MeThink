var http = require("http");
var express = require("express");
var swig = require("swig");
var path = require("path");
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var db = require('./database.js');

app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname,'/static'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
})); 

//routes here
app.get('/', function(req, res){
    res.render("index.html");
});

app.get('/login', function(req, res){
    res.render("login.html");
});

app.post('/login', function(req, res){
    var name = req.body.username;
    var password = req.body.password;
    //db function here to check
    db.validLogin(name, password, function(passed, msg){
	res.render("login.html");
        if (passed){
	        //set session to username
	    
	        //redirect to home page
	        //res.render(home.html);
	        console.log("Logged in.");
	    }else {
	        console.log(msg);
	    };
    });
});

//routes end here

app.use(express.static(path.join(__dirname,"static")));

server.listen(5000, function(){
    console.log("Server started on port 5000");
});

io.sockets.on("connection",function(socket){
    socket.on("move", function(data){
        socket.broadcast.emit("draw",data);
    });
});
