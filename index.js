/*
Author: Federico Rubino, Daniel Wadell, Sean Towne
Final Project
*/

var express = require("express");
var mysql = require("mysql");
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

/* Configure mysql dbms */
const connection = mysql.createConnection({
	host: "localhost",
	user: "ToRuWa",
	password: "ToRuWa",
	database: "project_database"
});

connection.connect();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static("css"));
app.use(bodyParser.urlencoded({extended:true}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

/* home: This should contain all of the posts*/
app.get("/", function(req, res){
    var statement = "select * from user_table";
    connection.query(statement, function(error,found){
        var users = null
        if(error) throw error;
        if(found.length){
    		users = found;
        }
	    res.render('home', { users:users});
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
		// console.log(user);
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
		// console.log(user);
		res.render('user_update', {user:user});
    });
});

/* delete a user - needs some protection*/
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
							"(storyId, content, picture, userId, category, likes) " +
							"Values (" +
							storyId + ",'" +
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
