


console.log($("#title"));
$('#searchButton').on('click', function(){
    console.log("onclick");
    var title = $('#title').val();
    var keyword = $('#keyword').val();
    var catagory = $('#catagory').val();
    
    $.ajax({
        method: "GET",
        url: "/search",
        dataType: "json",
        data : { 
            title : title, 
            keyword : keyword,
            catagory : catagory
        },
        success: function(result, status){
            
        },
        error: function(status, error){
            
        }
    });
});
