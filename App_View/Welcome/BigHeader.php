<script type="application/javascript">
    $(document).ready(function() {
        // bind form using ajaxForm
        $('#loginForm').ajaxForm({
            dataType:  'json',
            method: 'post',
            action:  '<?=base_url("/Auth/Login")?>',
            success:   function(data){
                // Clear Errors and Status Messages
                $("#loginForm input").removeClass("has-error");
                $("#loginFormStatus").empty();
                // Validate response
                if(data==null||!data.hasOwnProperty('status')){
                    $("#loginFormStatus").append("<li>Network Error. Please try again.<li>");
                    return;
                }
                // Check Status
                switch(data.status){
                    case 1:
                        // Successful login
                        $("#loginFormStatus").hide().fadeIn().append("<li>Login Successful, please wait.</li>").addClass("success");
                        $("#loginForm").fadeOut("slow",()=>{
                             $("#loginFormCard").fadeOut("slow",()=>{window.location = "<?=base_url("/")?>"});
                        });
                       
                        break;
                    case 0:
                        // Missing Field
                        $("#loginFormStatus").append("<li>Please fill out email and password field.</li>");
                        if(data.field=="hash"){data.field="password";}
                        $("#loginForm input[name='"+data.field+"']").addClass("has-error");
                        break;
                    case -1:
                        // Wrond credentials
                        $("#loginFormStatus").append("<li>Wrong Username or Password. Please try again.</li>");
                        break;
                }
            },
            beforeSerialize: function(jqForm,options){
                // Clear Errors and Status Messages
                $("#loginForm input").removeClass("has-error");
                $("#loginFormStatus").empty();
                
                var hasError = false;
                // Check email Value
               var e = $("#loginForm input[name='email']")
               if(e.val().length<3){
                   e.addClass("has-error");
                   hasError = true;
               }
               // Check password Value
               var p = $("#loginForm input[name='password']");
               if(p.val().length<6){
                   p.addClass("has-error");
                   hasError = true;
               }
               if(hasError){
                   $("#loginFormStatus").append("<li>Please fill out email and password field.</li>");
                   return false;
               }
               
               // Calculate Hash and store it in hidden field
               $("#loginForm input[name='hash']").val(sha3_256(p.val()));
               // Clear Password field
               p.val('');
               
               return true;
            }
        });
    });
</script>
<div class="container-fluid welcome-head">
    <div class="row ">
        <div class="col-xs-6">
        <div class="title-text-container">
            <div>VOXEL</div>
            <div>RPG Maker 3D</div>
        </div>
        </div>
        <div class="col-xs-12 col-md-3 col-md-offset-2">
            <div class="card card-default" id="loginFormCard">
                <div class="card-header">Log In and Start</div>
                <div class="card-block">
                    <ul id="loginFormStatus" class="formStatus">
                
                    </ul>
                    <form id="loginForm" method="POST" action="<?=base_url("/Auth/Login")?>">
                        <input type="hidden" name="login"/>
                        <input type="hidden" name="hash"/>
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" class="form-control" name="email" placeholder="Email">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" name="password" placeholder="Password">
                        </div>
                        <button type="submit" class="btn btn-default">Login</button>
                     </form>
                </div>
                <div class="card-footer"><a href="/Auth/Form/Registration">No Account? Sign Up here</a></div>
            </div>
        </div>
    </div>
</div>