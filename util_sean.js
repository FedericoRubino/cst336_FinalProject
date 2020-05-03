
// title, content, category
var buildStatement = function(title, content_keyword, catagory){
    var stmt = "SELECT * FROM story_table";
    var searchTerms = [];
    
    //console.log("Title: " + title);
    if ( typeof title !== 'undefined' && title ){
        searchTerms.push(
            " story_table.title='" + title + "'"  
        );
    }
    
    //console.log("Keyword : " + content_keyword);
    if ( typeof content_keyword !== 'undefined' && content_keyword ){
        searchTerms.push(
            " story_table.content like '%" + content_keyword + "%'"  
        );
    }
    
    console.log("Catagory : " + catagory);
    if ( typeof catagory !== 'undefined' && catagory ){
        searchTerms.push(
            " story_table.catagory='" + catagory + "'"  
        );
    }
    
    if ( searchTerms.length > 0){
        stmt += " where";
        for(var i in searchTerms){
            stmt += searchTerms[i];
            if( i == searchTerms.length-1){
                break;
            }
            stmt += " and";
        }
    }
    
    return stmt+";";
}

/*
var getCatagories = function(){
    stmt = "select distinct category from l9_quotes;"
    var data = {};
    connection.query(stmt, function(error, found){
        if ( error ) throw error;
        data = found;
    });
    return data;
}
*/

module.exports = {
    buildStatement : buildStatement
}