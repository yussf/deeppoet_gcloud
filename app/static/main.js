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
        return /^[a-zA-Z ]+$/.test(word)
    }

    $("#get_btn").on("click", function(){
        if (isValid($("#word_input").val())){
            var init = $("#word_input").val().trim()
            var temp = $("#temp_input").val()
            var length = $("#length_input").val()
            var rep = $("#rep_input").val()
            var max = $("#max_input").val()
            var args = {
                "init":init,
                "temp":temp,
                "length":length,
                "rep":rep,
                "max":max
            }
            $("#word_form").fadeOut(2)
            $("#poem_display").fadeIn()
            $.get("/getpoem", args, (data) => {
                $("#spiners").fadeOut(2)
                $("#poem").html(data)
                $("#retry_btn").fadeIn()
            })    
        }
    })

    $("#word_input").on("keyup", function(e){        
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

    $("#reset_btn").on("click", function(){
        $("#temp_input").val(0.55)
        $("#length_input").val(100)
        $("#rep_input").val(8)
        $("#max_input").val(10)

    })
    $("#random_btn").on("click", function(){
        getRandomWord(word => $("#word_input").val(word))
        
    })

    $("#temp_input").on("change", function(){
        $("#temp_label").text($(this).val())
    })

    $(document).on("keypress", function(e){
        if (e.which == 13) $("#get_btn").click()
    })
});