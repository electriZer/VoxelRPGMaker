
<script type="application/javascript">
    $(document).ready(function() {
        // bind form using ajaxForm
        $('#registrationForm').ajaxForm({
            dataType:  'json',
            method: 'post', 
            action: '<?=base_url("/Auth/Registrate")?>',
            success:   function(data){
                // Reset Status Messge Field
                $("#registrationStatus").empty();
                $("#registrationForm input").removeClass("has-error");
                // Trivial error check
                if(data == null || !data.hasOwnProperty("status")){
                    $("#registrationStatus").append('<li>Network Error. Please try again.</li>');
                    return;
                }

                // Return Cases
                switch(data.status){
                    case 1:
                        // Successfuly registrated
                        $("#registrationForm").fadeOut();
                        $("#registrationStatus").append("<li>Registration Successful. <a href='<?=base_url("/")?>'>Go to Startpage and Sign in.</a></li>").addClass("success");
                        break;
                    case 0:
                        // Trivial error check
                        if(!data.hasOwnProperty("field")){
                            $("#registrationStatus").append('<p>Unkown Error. Please try again.</p>');
                            return;
                        }
                        // Clear the wrong field
                        if(data.field == "hash"){
                            $("#registrationForm input[name='password']").val('').addClass('has-error');
                            $("#registrationForm input[name='password_confirm']").val('').addClass('has-error');
                        }else{
                            $("#registrationForm input[name='"+data.field+"']").val('');
                            $("#registrationForm input[name='"+data.field+"']").addClass('has-error');
                        }
                        
                        break;
                    case -1:
                        // Username in use
                         $("#registrationStatus").append("<li>Username is in use. Please choose a different one</li>");
                         $("#registrationForm input[name='username']").addClass("has-error");
                        break;
                    case -2:
                        // Email in use
                         $("#registrationStatus").append("<li>Email is in use. If you already have an account, try to reset your Password.</li>");
                         $("#registrationForm input[name='email']").addClass("has-error");
                        break;
                }
            },
            beforeSerialize:function(jqForm, options) {
                $("#registrationStatus").empty();
                $("#registrationForm input").removeClass("has-error");
                var $form = $("#registrationForm input");
                /* Check Cases :
                    - Username Field
                    - Email Field
                    - Password Length
                    - Password Field
                 */
                // Marker for Missing Case
                var missing = false;
                if($form.filter("[name='username']").val().length < 4 || $form.filter("[name='username']").val().length > 16){
                    $form.filter("[name='username']").addClass("has-error");
                     $("#registrationStatus").append("<li>Username length : 4-16</li>").append("<li>Only Characters and Numbers allowed</li>");
                    missing = true;
                }
                if($form.filter("[name='email']").val().length < 4||$form.filter("[name='email']").val().length > 256){
                    $form.filter("[name='email']").addClass("has-error");
                    missing = true;
                }
                if($form.filter("[name='password']").val().length < 6){
                    $form.filter("[name='password']").addClass("has-error");
                    return false;
                }
                if($form.filter("[name='password_confirm']").val().length < 6){
                    $form.filter("[name='password_confirm']").addClass("has-error");
                    missing = true;
                }
                if(missing)return false;

                /* Prepare Password :
                    - Compare Passwords
                    - Hash Password
                    - Clear Password Areas and set hidden hash input field
                    - Send Request
                 */

                // Compare
                if($form.filter("[name='password']").val() != $form.filter("[name='password_confirm']").val()){
                    $form.filter("[name='password']").addClass("has-warning");
                    $form.filter("[name='password_confirm']").addClass("has-warning");
                    $("#registrationStatus").append("<li>Passwords do not match</li>");
                    return false;
                }
                // Hash Password
                var Password = $form.filter("[name='password']").val();
                var Hash = sha3_256(Password);


                // Clear Fields
                $form.filter("[name='password']").val('');
                $form.filter("[name='password_confirm']").val('');
                $form.filter("[name='hash']").val(Hash);
                return true;
            }

        });
    });
</script>
<div class="wrapper container-fluid">
    <!-- Title Header-->
    <div class="row registration-head">
        <div class="col-sm-2 col-xs-3" onclick="window.location='<?=base_url("/")?>';" style="cursor:pointer">
            <div class="title-text-container">
            <div>Voxel</div>
            <span>RPG Maker3D</span>
            </div>
        </div>
        <div class="col-sm-2 col-sm-offset-1 col-xs-6">
            <div class="title-text-container">
               <div>Registration</div>
            </div>
        </div>
    </div>
    <!-- Status Message -->
    <div class="row ">
        <div class="col-md-4 col-md-offset-3">
            <ul id="registrationStatus" class="formStatus">
                
            </ul>
        </div>
    </div>
    <!-- Form-->
    <div class="row">
        <div class="col-md-6 col-sm-offset-3 registration-container">
            <form class="form-horizontal" id="registrationForm" method="POST" action="<?=base_url("/Auth/Registrate")?>">
                <input type="hidden" name="register" />
                <input type="hidden" name="hash" />

                <fieldset>
                    <div class="control-group">
                        <!-- Username -->
                        <label class="control-label"  for="username">Username</label>
                        <div class="controls">
                            <input type="text" name="username" placeholder="" class="input-xlarge" maxlength="16">
                            <p class="help-block">Username can contain any letters or numbers, without spaces</p>
                        </div>
                    </div>

                    <div class="control-group">
                        <!-- E-mail -->
                        <label class="control-label" for="email" maxlength="256">E-mail</label>
                        <div class="controls">
                            <input type="text" name="email" placeholder="" class="input-xlarge">
                            <p class="help-block">Please provide your E-mail</p>
                        </div>
                    </div>

                    <div class="control-group">
                        <!-- Password-->
                        <label class="control-label" for="password">Password</label>
                        <div class="controls">
                            <input type="password" name="password" placeholder="" class="input-xlarge">
                            <p class="help-block">Password should be at least 6 characters</p>
                        </div>
                    </div>

                    <div class="control-group">
                        <!-- Password -->
                        <label class="control-label"  for="password_confirm">Password (Confirm)</label>
                        <div class="controls">
                            <input type="password" name="password_confirm" placeholder="" class="input-xlarge">
                            <p class="help-block">Please confirm password</p>
                        </div>
                    </div>

                    <div class="control-group">
                        <!-- Button -->
                        <div class="controls">
                            <button class="btn btn-success">Register</button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
    <div class="push"></div>
</div>
<!-- Footer -->
<div class="container-fluid ">
    <div class="row footer">
        <div class="col-md-2">
            (C) Copyright by 2016 Jiyan Akgül
        </div>
    </div>
</div>

