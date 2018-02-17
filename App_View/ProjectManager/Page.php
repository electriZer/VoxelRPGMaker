
<script type="application/javascript">
    /* global $ */
    $(document).ready(function() {
       
        // bind form using ajaxForm
        $("#NewProjectForm").ajaxForm({
            dataType:  'json',
            method: 'POST', 
            action: '<?=base_url("/Project-Manager/NewProject")?>',
            success:   function(data){
               if(data!=null && data.hasOwnProperty("error")){
                   if(!data.error){
                        $("#StatusMessage").text("New Project created successfully");
                        window.location.reload();
                   }else{
                       if(data.status==-1){
                           $("#StatusMessage").text("Project Name length : min 4 Characters and max 30 Characters");
                       }
                   }
               }else{
                   $("#StatusMessage").text("Network Error. Please try again");
                   // Network Error
               }
            }
        });
        
        $("#NewProjectButton").click(function(e){
            $("#StatusMessage").text("");
            $("#NewProjectContainer").toggle();
         });
    });
</script>

<div class="wrapper container-fluid header-container">
    <!-- Title Header-->
    <!-- <div class="row header">
        <div class="col-md-2 col-xs-6" onclick="window.location='<?=base_url("/")?>';" style="cursor:pointer">
            <div class="title-text">
                <div>Voxel</div>
                <span>RPG Maker3D</span>
            </div>
        </div>
        <div class="col-md-6 col-md-offset-1 col-xs-6">
            <div class="title-text pushleft">
               <div>Project Manager</div>
            </div>
        </div>
    </div>
    <div >-->
        <div class="col-md-7 ProjectsListContainer">
            <?=$ProjectListContainer?>
        </div>
        <div class="col-md-5 ProjectOptionsContainer">
            <div id="StatusMessage"></div>
            <div id="NewProjectContainer" class="EasyBox">
                <h2>Create New Project</h2>
                <form id="NewProjectForm" method="post" action="<?=base_url("/Project-Manager/NewProject")?>">
                    
                    <div class="form-group">
                        <label for="ProjectName">Project Name</label>
                        <input type="text" class="form-control" name="ProjectName" placeholder="" maxlength="30">
                        <small class="form-text text-muted">The Codename of your project.</small>
                    </div>
                    <div class="form-group">
                        <label for="ProjectDescription">Description</label>
                        <!--input type="text" class="form-control" name="ProjectDescription" placeholder="Optional"-->
                        <textarea type="text" class="form-control" name="ProjectDescription" style="width:75%"></textarea>
                        <small class="form-text text-muted">Describe your project and your plans for you and your team.</small>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary" >Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>