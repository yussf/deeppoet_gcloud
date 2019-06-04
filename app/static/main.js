$(document).ready(function(){
    var words;
    $.get("/getWordsList", data => {
        words = data.split("!")
    })

    function getRandomWord(callback){
        var i = Math.floor(Math.random()*words.length) 
        callback(words[i])
    }
    
    function isValid(word){
        return /^[a-zA-Z]+$/.test(word)
    }

    $("#get_btn").on("click", function(){
        if (isValid($("#word_input").val())){
            $("#word_form").fadeOut(2)
            $("#poem_display").fadeIn()
            $.get("/getpoem", {"init" : $("#word_input").val()}, (data) => {
                $("#spiners").fadeOut(2)
                $("#poem").html(data)
                $("#retry_btn").fadeIn()
            })    
        }
    })

    $("#word_input").on("change", function(){
        console.log("test");
        
        if (!(isValid($(this).val()))){
            $(this).addClass("is-invalid")
        }else{
            $(this).removeClass("is-invalid")
        }
    })

    $("#retry_btn").on("click", function(){
        $("#poem_display").fadeOut(2)
        $("#word_form").fadeIn()
        $("#poem").html("")
        $("#spiners").fadeIn()
        $("#retry_btn").fadeOut()
    })

    $("#random_btn").on("click", function(){
        getRandomWord(word => $("#word_input").val(word))
        
    })
    $(document).on("keypress", function(e){
        if (e.which == 13) $("#get_btn").click()
    })
});