var data;
var $background;
var $sceneName;
var $leftchar;
var $rightchar;
var $outcome;
var selectedAct=0;
var selectedScene=0;

$(document).ready(function(){
    $(".top_edit>div").hide();
    $background = $("input[name='background']");
    $sceneName = $("input[name='sceneName']");
    $leftchar = $("input[name='left']");
    $rightchar = $("input[name='right']");
    $outcome = $("input[name='outcome']");

    $(".data_menu li input").focus(function(){
        save();
        $(".data_menu li").removeClass("edit-data");
        $(this).parent().addClass("edit-data");

    });
    $(".data_menu li input").blur(function(){
        save();
        $(this).parent().removeClass("edit-data");
    });
    $(window).keypress(function(e){
        //console.log(e);
        if(e.key== "Enter" || e.keyCode== 13){
            save();
            //checks data values
            $(".data_menu .edit-data input").blur();
        }else if(e.key== "Tab"){
            if($(".top_edit .edit-diag")){
                editing = $(".top_edit .edit-diag");
                if($(editing.find("input")[1]).is(":focus")) editing.next("li").click();
            }
            if($(".top_edit .edit-option")){
                editing = $(".top_edit .edit-option");
                if($(editing.find("input")[1]).is(":focus")) editing.next("li").click();
            }
        }
    });
    $(".quickselect").focusin(function(){
        $(".data_menu .data_value_select").show();
        $(".data_menu .data_value_select li").hide()
        selectedType = $(this).attr("name");
        if(selectedType=="background")$(".data_menu .data_value_select .bg").show();
        else $(".data_menu .data_value_select .char").show()

        //indicates which char to quick select
        if(selectedType == "left") $leftchar.addClass("selectedChar");
        else $rightchar.addClass("selectedChar");
    });
    $(".quickselect").blur(function(){
        if(!$(".data_menu .data_value_select").is(":hover"))$(".data_menu .data_value_select").hide();

    });
});
function parseToData(){
    selectedAct=0;
    selectedScene=0;
    data = JSON.parse($(".IO_menu textarea").val());
    $(".top_edit>div").show();
    console.log(data);
    setupActsSelect(0);


    //setup quickselect
    str = '';
    for (var i = 0; i < data.shortcuts.background.length; i++) {
        str += '<li class="bg" onclick="updateShortcut(this,0)">'+data.shortcuts.background[i]+'</li>';
    }
    for (var i = 0; i < data.shortcuts.character.length; i++) {
        str += '<li class="char" onclick="updateShortcut(this,1)">'+data.shortcuts.character[i]+'</li>';
    }
    $(".data_menu .data_value_select").html(str);
}
function updateShortcut(obj,type){
    if(type==0){
        //bg quickselect
        $background.val($(obj).html());
    }else if(type==1){
        //char quickselect
        if($leftchar.hasClass("selectedChar")){$leftchar.val($(obj).html()); $leftchar.removeClass("selectedChar");}
        else {$rightchar.val($(obj).html()); $leftchar.removeClass("selectedChar");}

    }
    $(".data_menu .data_value_select").hide();
}
function setupActsSelect(actIndex){
    //default to actIndex
    //set up ACTS
    act = $(".top_menu .act_selection ul");
    act.html("");
    str = ""
    for (var i = 0; i < data.acts.length; i++) {
        str += "<li onclick='setupScenesSelect("+i+")'>Act "+i+": "+data.acts[i].actname+"</li>";
    }
    str += "<li onclick='addAct()'>+: Add an Act</li>";
    str += "<li onclick='deleteAct()'>-: Delete current Act</li>"
    act.html(str);

    $(".top_menu .act_selection h3").html("Act "+actIndex+": "+data.acts[actIndex].actname);
    setupScenesSelect(actIndex);
}
function changeActName(obj){
    if(!$(obj).hasClass("edit-actname")){

        $(obj).addClass("edit-actname");
        $(obj).html(`Act `+selectedAct+`: `+`<input name="act" value="`+data.acts[selectedAct].actname+`" type="text">`);
        $(obj).find("input").select();
    }
}
function setupScenesSelect(index,defaultScene){
    save();
    defaultScene = defaultScene || 0;
    //index in arg means the current act
    selectedAct = index;
    //set up top menu act title
    $(".top_menu .act_selection h3").html("Act "+index+": "+data.acts[index].actname);
    //set up SCENES
    $scenes = $(".top_edit .scene_menu ul");
    $scenes.html("");
    str = "";
    Scenes = data.acts[index].scenes;
    for (var i = 0; i < Scenes.length; i++) {
        str += "<li onclick='setupSceneData(event,this,"+i+")'><div>"+i+": ";
        str += Scenes[i].scenename + "</div>";
        str += "<a onclick='deleteScene("+i+")' href='javascript:void(0)'>x</a></li>";
    }
    str += `<li onclick="addScene(0)"><div>> Add a Dialogue Scene</div></li>`;
    str += `<li onclick="addScene(1)"><div>> Add an Option Scene</div></li>`;

    $scenes.html(str);
    $($scenes.find(">li")[defaultScene]).click();
}
function setupSceneData(e,obj,index){
    save();
    //checks clicked element is not the delete X
    if(e.target != $(obj).find("a")[0]){
        //index in arg means current scenename
        selectedScene = index;
        //set up selected scene background color
        $(".top_edit .scene_menu ul li").removeClass("selected");
        $(obj).addClass("selected");
        //set up Data for scenename
        Scene = data.acts[selectedAct].scenes[selectedScene];

        if(Scene.scenename) $sceneName.val(Scene.scenename);
        else $sceneName.val("");
        if(Scene.background) $background.val(Scene.background);
        else $background.val("");
        if(Scene.left) $leftchar.val(Scene.left);
        else $leftchar.val("");
        if(Scene.right) $rightchar.val(Scene.right);
        else $rightchar.val("");
        if(Scene.outcome) $outcome.val(Scene.outcome);
        else $outcome.val("");

        //set up diaglogues
        setupSceneDiag(selectedAct,selectedScene);
    }
}
function setupSceneDiag(act,scene){
    //for both diag and options
    Scene = data.acts[act].scenes[scene];
    if(!Scene.choice){
        //set up diag
        $(".top_edit >div").show();
        $(".top_edit .option_menu").hide();
        diags = $(".top_edit .diag_menu ul");
        diags.html("");
        Diags = Scene.diag;
        str = "";
        for (var i = 0; i < Diags.length; i++) {
            str += "<li onclick='diag_changeEdit(event,this,"+i+")'>";
            str += "<span class='name'>"+Diags[i].name+"</span>";
            str += "<span class='content'>"+Diags[i].content+"</span>";
            str += "</li>";
        }
        str += `<hr><li onclick="addDiag()"><span>> Add a dialogue</span></li>`;
        diags.html(str);
    }else{
        //set up options
        $(".top_edit >div").show();
        $(".top_edit .diag_menu").hide();
        $(".top_edit .data_menu").hide();
        options = $(".top_edit .option_menu ul");
        options.html("");
        Options = Scene.choice;
        str = "";
        for (var i = 0; i < Options.length; i++) {
            str += "<li onclick='option_changeEdit(event,this,"+i+")'>";
            str += "<span class='content'>"+Options[i].content+"</span>";
            str += "<span class='outcome'>"+Options[i].outcome+"</span>";
            str += "</li>";
        }
        str += `<hr><li onclick="addOption()"><span>> Add an option</span></li>`;
        options.html(str);
    }
}

num = 0;
function diag_changeEdit(e,obj,index){
    //save other editing first
    if($(".edit-diag").length) save();

    //checks didn't click the delete X
    if(e.target != $(obj).find("a")[0]){
        //click diag menu to change to input text
        $(obj).removeAttr("onclick");
        $(obj).addClass("edit-diag");
        name = $(obj).find(".name").html();
        content = $(obj).find(".content").html();
        // using ` avoids " and ' conflicts
        str = `<input type="text" name="name" value="`+name+`"> `;
        str += `<input type="text" name="content" value="`+content+`">`;
        str += `<a onclick="deleteDiag(`+index+`)" href="javascript:void(0)">x</a>`;
        //str += "<a onclick='diag_updateDiag(this)'>OK</a>"
        $(obj).html(str);
        $(obj).find(`input[name="name"]`).select();
    }else{
        //delete diag
        data.acts[selectedAct].scenes[selectedScene].diag.splice(index,1);
    }
}
function option_changeEdit(e,obj,index){
    if($(".edit-option").length)save();

    //checks didn't click delete
    if(e.target != $(obj).find("a")[0]){
        $(obj).removeAttr("onclick");
        $(obj).addClass("edit-option");
        content = $(obj).find(".content").html();
        outcome = $(obj).find(".outcome").html();
        // using ` avoids " and ' conflicts
        str = `<input type="text" name="content" value="`+content+`"> `;
        str += `<input type="text" name="outcome" value="`+outcome+`">`;
        str += `<a onclick="deleteOption(`+index+`)" href="javascript:void(0)">x</a>`;
        //str += "<a onclick='diag_updateDiag(this)'>OK</a>"
        $(obj).html(str);
        $(obj).find(`input[name="content"]`).select();
    }
}
function addOption(){
    save();
    Choices = data.acts[selectedAct].scenes[selectedScene].choice;
    choice = {
        "outcome": 0,
        "content": "Option"
    };
    Choices.push(choice);
    setupSceneDiag(selectedAct,selectedScene);
}
function deleteOption(index){
    data.acts[selectedAct].scenes[selectedScene].choice.splice(index,1);
    setupSceneDiag(selectedAct,selectedScene);
}
function addDiag(){
    save();
    Diags = data.acts[selectedAct].scenes[selectedScene].diag;
    diag = Diags.length==0?{"name":"name","content":"diag"}: Diags[Diags.length-1];
    Diags.push(diag);
    setupSceneDiag(selectedAct,selectedScene);
}
function deleteDiag(index){
    data.acts[selectedAct].scenes[selectedScene].diag.splice(index,1);
    setupSceneDiag(selectedAct,selectedScene);
}
function addScene(type){
    save();
    if(type == 0){
        //add dialogue scene
        scene = {
            "scenename":"Dialogue scene",
            "current_diag": 0,
            "diag": []
        };
    }else if(type == 1){
        //add option scene
        scene = {
            "scenename":"Option scene",
            "choice": []
        };
    }
    data.acts[selectedAct].scenes.push(scene);
    setupScenesSelect(selectedAct,data.acts[selectedAct].scenes.length-1);
}
function deleteScene(index){
    data.acts[selectedAct].scenes.splice(index,1);
    setupScenesSelect(selectedAct);
}
function addAct(){
    act = {"actname":"Click here","scene_index": 0,"scenes":[]}
    data.acts.push(act);
    setupActsSelect(data.acts.length-1);
}
function deleteAct(){
    if(confirm("Are you sure you want to delete Act "+selectedAct+": "+data.acts[selectedAct].actname+"?")){
        data.acts.splice(selectedAct,1);
        selectedAct = (selectedAct-1)>=0?(selectedAct-1):selectedAct;
        setupActsSelect(selectedAct);
    }
}
function save(){
    Scene = data.acts[selectedAct].scenes[selectedScene];
    //saving edited act name
    if($(".edit-actname").length){
        obj = $(".edit-actname");
        data.acts[selectedAct].actname = obj.find('input').val();
        str = `Act `+selectedAct+`: `+data.acts[selectedAct].actname;
        obj.html(str);
        obj.siblings("ul").find("li")[selectedAct].innerHTML = str;
        obj.removeClass("edit-actname");
    }
    //saving edited diaglogues
    if($(".edit-diag").length){
        e = $(".edit-diag");
        e.removeClass("edit-diag");
        index = $(".diag_menu ul li").index(e[0]);
        e.attr("onclick","diag_changeEdit(event,this,"+index+")")
        name = e.find("input[name='name']").val();
        content = e.find("input[name='content']").val();

        str = "<span class='name'>"+name+"</span> ";
        str += "<span class='content'>"+content+"</span>";
        //str += "<a href='javascript:void(0)'>x</a>";
        e.html(str);

        Scene.diag[index]={"name":name,"content":content};
    }
    if($(".edit-data").length){
        if($sceneName.val() != "") {Scene.scenename = $sceneName.val(); $($(".top_edit .scene_menu ul li")[selectedScene]).find("div").html(selectedScene +": " + Scene.scenename);}
        else Scene.scenename = "";
        if($background.val() != "") Scene.background = $background.val();
        else delete Scene.background;
        if($leftchar.val() != "") Scene.left = $leftchar.val();
        else delete Scene.left;
        if($rightchar.val() != "") Scene.right = $rightchar.val();
        else delete Scene.right;
        if($outcome.val() != "") Scene.outcome = $outcome.val();
        else Scene.outcome = 0;
    }
    if($(".edit-option").length){
        e = $(".edit-option");
        e.removeClass("edit-option");
        index = $(".option_menu ul li").index(e[0]);
        e.attr("onclick","option_changeEdit(event,this,"+index+")")
        content = e.find("input[name='content']").val();
        outcome = e.find("input[name='outcome']").val();

        str = "<span class='content'>"+content+"</span> ";
        str += "<span class='outcome'>"+outcome+"</span>";
        //str += "<a href='javascript:void(0)'>x</a>";
        e.html(str);

        Scene.choice[index]={"outcome":outcome,"content":content};
    }
}

function encodeToJSON(){
    if(true){
        //true placeholder
        $(".IO_menu textarea").val(JSON.stringify(data));
    }
}
