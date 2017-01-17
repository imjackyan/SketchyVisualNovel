var $choice_cont;
var $diag_speaker;
var $diag_content;
var $left_char;
var $right_char;
var $background;
var data;

$(document).ready(function(){
    $choice_cont = $(".choice-cont");
    $diag_speaker = $(".diag-cont .name");
    $diag_content = $(".diag-cont .diag");
    $left_char = $(".left-char img");
    $right_char = $(".right-char img");
    $background = $(".background");
    $background.attr("src","img/bg_westdale.jpg");

    //generateChoice(current_choices);
    data = $.ajax({
        type:'GET',
        url:'dialogue.json',
        dataType:'json',
        success:function(_data){
            data = data.responseJSON;
            setScene();
        }
    });
});

function generateChoice(choices){
    $choice_cont.html("<ul></ul>");
    for(i=0;i<choices.length;i++){
        $choice_cont.find("ul").append("<li onclick='choose("+i +")'>"+choices[i].content+"</li>");
    }
    $choice_cont.show();
}
function choose(index){
    data.acts[0].scene_index = data.acts[0].scenes[data.acts[0].scene_index].choice[index].outcome;
    setScene();
    $choice_cont.hide();
}


function setScene(){
    //needs to find if over limit
    Scene = data.acts[0].scenes[data.acts[0].scene_index];
    if(Scene.background)$background.attr("src",Scene.background);

    if(!Scene.choice){
        if(Scene.left)$left_char.attr("src",Scene.left);
        else $left_char.attr("src","");
        if(Scene.right)$right_char.attr("src",Scene.right);
        else $right_char.attr("src","");

        $diag_content.html(Scene.diag[Scene.current_diag].content);
        if(Scene.diag[Scene.current_diag].name) $diag_speaker.html(Scene.diag[Scene.current_diag].name);
        else $diag_speaker.html("");
    }else{
        generateChoice(Scene.choice)
    }
}
function nextDiag(){
    Scene = data.acts[0].scenes[data.acts[0].scene_index];
    Scene.current_diag++;
    if(Scene.current_diag < Scene.diag.length){
        $diag_content.html(Scene.diag[Scene.current_diag].content);
        if(Scene.diag[Scene.current_diag].name) $diag_speaker.html(Scene.diag[Scene.current_diag].name);
        else $diag_speaker.html("");
    }
    else{
        data.acts[0].scene_index = Scene.outcome;
        setScene();
    }
}
