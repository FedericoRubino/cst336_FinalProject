
console.log("Searching...");

function displayResult(result){
    $('#storyStream').empty();
    result.forEach(function(story){
        console.log(story.title);
        
        $('#storyStream').append(
            `<div class="storyCard">
    
                <img src="data:image/png;base64, ` + story.picture + `" class="storyImg mr-3" alt="...">
                <div class="storyBody">
                    <h5 class="mt-0">` + story.title + `</h5>
                    <p class="mt-0">` + story.category + `</p>
                    ` + story.content + `
                    
                </div>
                <div class="storyFooter">
                    <hr>
                    <a href="/post/` + story.storyId + `/update">Edit</a>
                </div>
            </div>`    
        );
        console.log(story.userId); 
    });
}
window.addEventListener('load', function () {
    console.log("page fully loaded");
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
                displayResult(result);
            },
            error: function(status, error){
                console.log("error");
            }
        });
    
    });
});


