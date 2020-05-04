
// title, content, category
var buildStatement = function(title, content_keyword, category){
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
    
    console.log("category : " + category);
    if ( typeof category !== 'undefined' && category ){
        searchTerms.push(
            " story_table.category='" + category + "'"  
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