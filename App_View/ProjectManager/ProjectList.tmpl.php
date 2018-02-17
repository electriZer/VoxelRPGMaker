<?php
/**
 * Needed Variables : 
 * 
 * Array of Projects containing Project Variables : $Projects 
 * '-> Project Variable definition : ["Name"=> Name of Project ,"Description" => Short Description of Project ,"PID" => Project ID]
**/

?>
<script type="text/javascript">
    /*global $*/
    $(document).ready(function(){
       $("a.ProjectRemove").confirm({
           text: "Are you sure you want to delete that Project?",
           title: "Confirmation required",
           confirm: function(button) {
                var pid = $(button).data("pid");
                $.ajax({
                    type:"DELETE",
                    url:'<?=base_url($ProjectManager."/RemoveProject")?>/'+pid
                });
                
                $("ul.ProjectsList #P_"+pid).remove();
                //window.location.reload();
            },
            confirmButton: "Yes I am",
            cancelButton: "No",
       }); 
       

       // Select and deselect for Project List Items
       $("ul.ProjectsList li.selectable").click(function(e){
           // Check if this Block is already selected 
           if($(this).hasClass("selected")){
               // Deselect it now if CTRL is pressed
               if(e.ctrlKey){
                   $(this).removeClass("selected");
               } 
               // Deselect all other is CTRL is not pressed
               else{
                    $("ul.ProjectsList li.selected").removeClass("selected");
                    $(this).addClass("selected");
               }
           }
           // If it's not selected
           else{
               // Deselect all other if CTRL wasn't pressed
               if(!e.ctrlKey){
                    $("ul.ProjectsList li.selected").removeClass("selected");
               }
               
               // Select it now
               $(this).addClass("selected");
           }
       })
    });
</script>

    <div>Open existing Project</div>
    <ul class="ProjectsList">
        <?php if(!isset($Projects) || sizeof($Projects)<1){ ?>
        <li class="empty">You have no existing Projects</li>
        <?php } else { ?>
        <?php foreach($Projects as $Project) : ?>
        <li id="P_<?=$Project["PID"]?>" class="selectable" data-pid="<?=$Project["PID"]?>">
            <div>
                <a href="#" id="ProjectName" data-pid="<?=$Project["PID"]?>" data-selected="false">
                    <?=$Project["Name"] ?>
                </a>
                <span class="pull-xs-right">
                    <a class="btn btn-success" href="<?=base_url($ProjectEditor."/".$Project["PID"]);?>">Open</a>
                    <a class="btn btn-danger ProjectRemove" href="#" data-pid="<?=$Project["PID"]?>">Remove</a>
                </span>
            </div>
            <div class="time">Last Edit :
                <?=$Project["LastEditDate"]?>
            </div>
            <div class="description">
                <?=$Project["Description"]?>
            </div>
        </li>
        <?php endforeach;?>
        <?php } ?>
    </ul>
