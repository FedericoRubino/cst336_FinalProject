/*
Author: Federico Rubino, Daniel Wadell, Sean Towne
Final Project
*/

var express = require("express");
var mysql = require("mysql");
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');

/* Configure mysql dbms */
const connection = mysql.createConnection({
	host: "localhost",
	user: "ToRuWa",
	password: "ToRuWa",
	database: "project_database"
});

connection.connect();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.static("css"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
	secret: "wabbadubbadubdub!!",
	resave: true,
	saveUninitialized: true
	
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

/* home: This should contain all of the posts*/
app.get("/", function(req, res){
    var statement = "select * from user_table;";
    var statementStory = "select * from story_table;";
    var users = null
    connection.query(statement, function(error,found){
        if(error) throw error;
        if(found.length){
        	console.log(found);
    		users = found;
        }
    });
	var stories = null;
    connection.query(statementStory, function(error,found){
        if(error) throw error;
        if(found.length){
        	// console.log(found);
    		stories = found;
        }
	    res.render('home', { users:users, stories:stories, currentUser:req.session.user});
    });
});


/* display user page  */
app.get("/user/:userId", function(req, res){
	var userId = req.params.userId;
    var statement = "select * from user_table "+
    				"where userId=" + userId + ";" ; 
    connection.query(statement,function(error,found){
    	var user = null;
    	if(error) throw error;
		if(found.length){
			user = found[0]; // this gets us all of the data from the database of the given author
		}
		console.log(user);
		res.render('profile_page', {user:user});
    });
});

/* sends us to the edit page for user */
app.get("/user/:userId/edit", function(req, res){
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
   res.render('login'); 
});


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

/* login a user */
app.post("/user/login", async function(req, res){
	let users = await checkUsername(req.body.username);
	console.log(users);
	let hashedPassword = users.length > 0 ? users[0].password : "";
	let passwordMatch = await checkPassword(req.body.password, hashedPassword);
	if(passwordMatch){
		req.session.authenticated = true;
		req.session.user = users[0].username;
		res.redirect('/');	
	} else {
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
app.get('/logout',function(req, res) {
    req.session.destroy();
    res.redirect('/');
});



/* delete a user - needs some protection */
app.get("/user/:userId/delete", function(req, res) {
    var statement = "DELETE FROM user_table where userId=" + req.params.userId + ";";
    connection.query(statement, function(error, found) {
        if(error) throw error;
        res.redirect("/");
    });
});

/* updates the user information */
app.put("/update/:usrID", function(req, res) {
    console.log(req.body);
    
    var statement = "UPDATE user_table SET " +
    				"firstName = '" + req.body.Firstname + "'," +
    				"lastName  = '" + req.body.Lastname + "'," +
    				"sex = '" + req.body.sex + "'," +
    				"profilePic = '" + req.body.profilePic + "'," +
    				"description = '" + req.body.description + "' " +
    				"WHERE userID = " + req.params.usrID + ";";
    console.log(statement);
    connection.query(statement,function(error, found) {
        if(error) throw error;
	    res.redirect("/user/" + req.params.usrID);
    })
})

/* the user profile page */
app.get("/user_profile", function(req, res){
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
app.get("/new_post", function(req, res){
	res.render('new_post');
});


/* create a new post - add post into database */
app.post("/post/new", function(req, res){
	console.log(req.body);
	connection.query('SELECT COUNT(*) FROM story_table;', function(error, found){
	    if(error) throw error;
	    if(found.length){
			// console.log(found);
			var storyId = found[0]['COUNT(*)'] + 1;
			var statement = "insert into story_table " +
							"(storyId, title, content, picture, userId, category, likes) " +
							"Values (" +
							storyId + ",'" +
							req.body.title + "','" +
							req.body.content + "','" +
							req.body.picture + "','" +
							req.body.userId + "','" +
							req.body.category + "','" +
							0 + "');";
			console.log(statement);
			connection.query(statement, function(error, found) {
			    if (error) throw error;
			    res.redirect('/');
			});
	    }
	});
});

/* update an existing post */
app.put("post/:pstId/update", function(res,req){
		
});

/* delete a post - needs some protection */
app.get("post/:pstId/delete", function(req, res) {
    
});


/* error page (route not found) */
app.get("/*", function(req, res){
	res.render("error");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running...");
});
