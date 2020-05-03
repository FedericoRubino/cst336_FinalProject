/*
Author: Federico Rubino, Daniel Wadell, Sean Towne
Final Project
*/

var fs = require('fs');
var path = require('path');
var multer = require('multer');
var express = require("express");
var mysql = require("mysql");
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var seanTools = require('./util_sean');


app.use(express.static('public'));
app.set('view engine', 'ejs');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.static("css"));
app.use(bodyParser.urlencoded({extended:true}));



/* *********************** Configure mysql dbms  ***********************  */
/* *********************************************************************  */

/* Old way
const connection = mysql.createConnection({
	host: "localhost",
	user: "ToRuWa",
	password: "ToRuWa",
	database: "project_database"
});
connection.connect();
*/

/* New way */
const environment = process.env.ENVIRONMENT;
console.log(environment);

var DBCredentials;

// We only need one of these but we can use all three.
if ( environment =='PRODUCTION_SEAN' ){
	DBCredentials = {
		host: 'us-cdbr-east-06.cleardb.net',
		user: 'b8eefb71bce5ff',
		password: '4741fc7b',
		database: 'heroku_7b4f59de6b2d0b9',
		port: 3306
	};
}
else if ( environment == 'PRODUCTION_FEDERICO' ){
	// Not necessary if you dont want to have your own heroku instance
	DBCredentials = {
		host: 'Federicos heroku clear db host info etc.',
		user: '',
		password: '',
		database: '',
		port: 3306
	};
}
else if ( environment == 'PRODUCTION_DANIEL' ){
	// Not necessary if you dont want to have your own heroku instance
	DBCredentials = {
		host: 'Daniels heroku clear db host info etc.',
		user: '',
		password: '',
		database: '',
		port: 3306
	};
}
else{
	DBCredentials = {
		host: "localhost",
		user: "ToRuWa",
		password: "ToRuWa",
		database: "project_database",
		port: 3306
	};
}

// I found this code on the internet
// When connecting to a DB from Heroku, there is this weird problem where
// the connection keeps closing for like, no reason.
// This code will handle the error that occurs from loosing the connection,
// and will simply reconect.
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(DBCredentials);  	// Recreate the connection, since the old one cannot be reused.
    connection.connect( function onConnect(err) {   		// The server is either down
        if (err) {                                  		// or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    		// We introduce a delay before attempting to reconnect,
		}                                           		// to avoid a hot loop, and to allow our node script to
	});                                         			// process asynchronous requests in the meantime.
                                                    		// If you're also serving http, display a 503 error.
    connection.on('error', function onError(err) {
        console.log('db error', err);
	    if (err.code == 'PROTOCOL_CONNECTION_LOST') {   	// Connection to the MySQL server is usually
	        handleDisconnect();                         	// lost due to either server restart, or a
	    } else {                                        	// connnection idle timeout (the wait_timeout
	        throw err;                                  	// server variable configures this)
        }
    });
}

handleDisconnect();
/* *********************** Configure mysql dbms  ***********************  */
/* *********************************************************************  */

app.use(session({
	secret: "wabbadubbadubdub!!",
	resave: true,
	saveUninitialized: true
	
}));

/* Middleware for file uploading*/
let storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, path.join(__dirname, "public/file/"));
	},
	filename: function(req, file, callback){
		callback(null, file.fieldname + "-" + Date.now());
	}
});
let upload = multer({storage:storage});


/* Middleware functions */
function checkUsername(username){
	let stmt = "SELECT * FROM user_table WHERE username=?";
	return new Promise(function(resolve, reject){
		connection.query(stmt, [username], function(error, result) {
		    if(error) throw error;
		    resolve(result);
		});
	});
}

function checkPassword(password, hash){
	return new Promise(function(resolve, reject){
		bcrypt.compare(password, hash, function(error, result){
			if(error) throw error;
			resolve(result);
		});
	});
}

function isAuthenticated(req, res, next){
	if(!req.session.authenticated) res.redirect('/login_user');
	else next();
}
/* Middleware functions */


/* home: This should contain all of the posts*/
app.get("/", function(req, res){
    var statement = "select * from user_table;";
    var statementStory = "select * from story_table;";
    var users = null
    connection.query(statement, function(error,found){
        if(error) throw error;
        if(found.length){
        	// console.log(found);
    		users = found;
        }
    });
	var stories = null;
    connection.query(statementStory, function(error,found){
        if(error) throw error;
        if(found.length){

    		stories = found;
    		stories.forEach(function(story){
	    		var data = new Buffer(story.picture, 'binary');
	    		// console.log(data);
				story.picture = data.toString('base64');
				
				// console.log(story.picture);
    		});
        }
        
	    res.render('home', { users:users, stories:stories, currentUser:req.session.user});
    });
});

app.get("/search", function(req, res){
	var title = req.query.title;
	var keyword = req.query.keyword;
	var catagory = req.query.catagory;
	
	var stmt = seanTools.buildStatement(title, keyword, catagory);
	console.log(stmt);
	
	var statement = "select * from user_table;";
    var statementStory = stmt;
    var users = null
    connection.query(statement, function(error,found){
        if(error) throw error;
        if(found.length){
        	// console.log(found);
    		users = found;
        }
    });
	var stories = null;
    connection.query(statementStory, function(error,found){
        if(error) throw error;
        if(found.length){

    		stories = found;
    		stories.forEach(function(story){
	    		var data = new Buffer(story.picture, 'binary');
	    		// console.log(data);
				story.picture = data.toString('base64');
				
				// console.log(story.picture);
    		});
        }
        console.log(stories.length);
	    res.render('home', { users:users, stories:stories, currentUser:req.session.user});
    });
});


/* display user page  */
app.get("/user/:userId", isAuthenticated, function(req, res){
	var userId = req.params.userId;
    var statement = "select * from user_table "+
    				"where userId=" + userId + ";" ; 
    connection.query(statement,function(error,found){
    	var user = null;
    	if(error) throw error;
		if(found.length){
			user = found[0]; // this gets us all of the data from the database of the given author
		}
		// console.log(user);
		res.render('profile_page', {user:user});
    });
});

/* sends us to the edit page for user */
app.get("/user/:userId/edit", isAuthenticated, function(req, res){
	var userId = req.params.userId;
    var statement = "select * from user_table "+
    				"where userId=" + userId + ";" ; 
    connection.query(statement,function(error,found){
    	var user = null;
    	if(error) throw error;
		if(found.length){
			user = found[0]; // this gets us all of the data from the database of the given author
		}
		res.render('user_update', {user:user});
    });
});


/* sends us to the login page */
app.get("/login_user",function(req, res) {
	console.log("/login_user");
   res.render('login'); 
});


/* login a user */
app.post("/user/login", async function(req, res){
	console.log("/user/login");
	console.log("username: " + req.body.username);
	console.log("password: " + req.body.password);
	
	let users = await checkUsername(req.body.username);
	// console.log(users);
	let hashedPassword = users.length > 0 ? users[0].password : "";
	let passwordMatch = await checkPassword(req.body.password, hashedPassword);
	console.log("password match: " + passwordMatch);
	if(passwordMatch){
		req.session.authenticated = true;
		req.session.user = users[0].username;
		res.redirect('/');	
	} else {
		console.log("error loggin in");
		res.render('login', {error: true});
	}
});

/* sends us to the create new user page */
app.get("/new_user",function(req, res) {
   res.render('new_user'); 
});

app.post("/user/register", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
	let firstname = req.body.Firstname;
	let lastname = req.body.Lastname;
	let sex = req.body.sex;
	let profilePic = req.body.profilePic;
	let description = req.body.description;
    let salt = 10;
    bcrypt.hash(password, salt,function(error,hash){
    	var stmt = "insert into user_table (username, password, firstName, lastName, sex, profilePic, description) " +
    				"VALUES (?,?,?,?,?,?,?)";
    	var data = [username, hash, firstname, lastname, sex, profilePic, description];
    	connection.query(stmt, data, function(error, result){
    		if	(error) throw error;
		    res.redirect('/');

    	});
    });
});


/* logout rout */
app.get('/logout', isAuthenticated, function(req, res) {
	console.log("/logout")
    req.session.destroy();
    res.redirect('/');
});



/* delete a user - needs some protection */
app.get("/user/:userId/delete", isAuthenticated, function(req, res) {
	console.log("/user/:"+req.params.userId+"/delete")
	
    var statement = "DELETE FROM user_table where userId=" + req.params.userId + ";";
    connection.query(statement, function(error, found) {
        if(error) throw error;
        res.redirect("/");
    });
});

/* updates the user information */
app.put("/update/:usrID", isAuthenticated, function(req, res) {
    // console.log(req.body);
    
    var statement = "UPDATE user_table SET " +
    				"firstName = '" + req.body.Firstname + "'," +
    				"lastName  = '" + req.body.Lastname + "'," +
    				"sex = '" + req.body.sex + "'," +
    				"profilePic = '" + req.body.profilePic + "'," +
    				"description = '" + req.body.description + "' " +
    				"WHERE userID = " + req.params.usrID + ";";
    // console.log(statement);
    connection.query(statement,function(error, found) {
        if(error) throw error;
	    res.redirect("/user/" + req.params.usrID);
    })
})

/* the user profile page */
app.get("/user_profile", isAuthenticated, function(req, res){
    var name = req.query.name;
    var fname = name.split(" ").splice(0,1);
    var lname = name.split(" ").splice(1,2);
    var statement = "select * from user_table "+
    				"where firstName = '" + fname + "'" +
    				"and lastName='"+ lname + "';" ; 
    connection.query(statement,function(error,found){
    	var user = null;
    	if(error) throw error;
		if(found.length){
			user = found[0]; // this gets us all of the data from the database of the given author
		}
		// console.log(user);
		res.render('profile_page', {keyword:name, user:user});
    });
});


/* route to making a new post */
app.get("/new_post", isAuthenticated, function(req, res){
	res.render('new_post');
});


/* create a new post - add post into database */
app.post("/post/new", upload.single('picture'), function(req, res){
	// console.log("file uploaded locally at: ", req.file.path);
	var filename = req.file.path.split("/").pop();
	var content = fs.readFileSync(req.file.path);
	var data = new Buffer(content);
	console.log(data);
	var statement = "insert into story_table (storyId, title, content, picture, userId, category, likes) Values(?,?,?,?,?,?,?);";
	
	// console.log(req.session.user);
	var stmt = 'SELECT * from user_table where username = "' + req.session.user + '";';
	
	var userId = null;
	connection.query(stmt,function(error, found) {
	    if(error) throw error;
	    if(found.length){
	    	userId = found[0].userId;
	    }
	});
	
	connection.query('SELECT COUNT(*) FROM story_table;', function(error, found){
	    if(error) throw error;
	    if(found.length){

			var storyId = found[0]['COUNT(*)'] + 1;
			console.log(statement, [storyId,req.body.title,req.body.content,data,userId,req.body.category,0]);
			connection.query(statement, [storyId,req.body.title,req.body.content,data,userId,req.body.category,0], function(error, found) {
			    if (error) throw error;
			    res.redirect('/');
			});
	    }
	});
});

/* update an existing post */
app.get("/post/:pstId/update", isAuthenticated, function(req,res){
	// console.log(req.params.pstId);
	var postId = req.params.pstId;
    var statement = "select * from story_table "+
    				"where storyId=" + postId + ";" ; 
	console.log(statement);
    connection.query(statement,function(error,found){
    	var user = null;
    	if(error) throw error;
		if(found.length){
			user = found[0]; // this gets us all of the data from the database of the given author
		}
		res.render('post_update', {user:user, storyId:postId});
    });
});

/* updates the story information */
app.put("/update/story/:pstID", isAuthenticated, upload.single('picture'), function(req, res) {
    // console.log(req.body);
    var filename = req.file.path.split("/").pop();
	var content = fs.readFileSync(req.file.path);
	var data = new Buffer(content);
	

    var statement = "UPDATE story_table SET " +
    				"title = '" + req.body.title + "', " +
    				"content  = '" + req.body.content + "'," +
    				"category = '" + req.body.category + "' " +
    				"picture = " + data + " ," +
    				"WHERE storyId = " + req.params.pstID + ";";
    				
    connection.query(statement,function(error, found) {
        if(error) throw error;
	    res.redirect("/");
    })
    
   
})

// app.put("/update/:usrID", isAuthenticated, function(req, res) {
//     // console.log(req.body);
    
//     var statement = "UPDATE user_table SET " +
//     				"firstName = '" + req.body.Firstname + "'," +
//     				"lastName  = '" + req.body.Lastname + "'," +
//     				"sex = '" + req.body.sex + "'," +
//     				"profilePic = '" + req.body.profilePic + "'," +
//     				"description = '" + req.body.description + "' " +
//     				"WHERE userID = " + req.params.usrID + ";";
//     // console.log(statement);
//     connection.query(statement,function(error, found) {
//         if(error) throw error;
// 	    res.redirect("/user/" + req.params.usrID);
//     })
// })

/* delete a post - needs some protection */
app.get("post/:pstId/delete", isAuthenticated, function(req, res) {
    
});


/* error page (route not found) */
app.get("/*", function(req, res){
	res.render("error");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running...");
});
