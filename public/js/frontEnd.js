$(".deleteButton").on("click", function(){
    $.post("/api/deleteComment", function(data) {
        todos = data;
      });
});
$(document).ready(function(){

})
