<!DOCTYPE html>
<html>

<head>
    <title>Voxel RPG Maker 3D</title>
    <link href="https://fonts.googleapis.com/css?family=Ek+Mukta:700|Muli" rel="stylesheet">
    <link rel="stylesheet" href="<?=base_url()?>/css/projectmanager.css">
    <link rel="stylesheet" media="all and (orientation:portrait)" href="<?=base_url()?>/css/welcome_portrait.css">
    <link rel="stylesheet" href="<?=base_url()?>/css/bootstrap.min.css">
    <script src="<?=base_url()?>/js/lib/jquery.min.js"></script>
    <script src="<?=base_url()?>/js/lib/bootstrap.min.js"></script>
    <script src="<?=base_url()?>/js/lib/jquery.form.js"></script>
    <script src="<?=base_url()?>/js/lib/jquery.confirm.min.js"></script>
    <script src="<?=base_url()?>/js/lib/sha3.min.js"></script>
</head>

<body>
    <nav class="navbar ProjectManagerNavbar">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">Project Manager</a>
            </div>
            <ul class="nav navbar-nav">
                <li class="nav-item"><a href="#" id="NewProjectButton" class="nav-link">New Project</a></li>
                <li class="nav-item dropdown">
                    <a href="#" class="dropdown-toggle nav-link disabled" id="dropdownMenuButton" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Project Settings <span class="caret"></span></a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a href="#" class="dropdown-item">Action</a>
                        <a href="#" class="dropdown-item">Another action</a>
                        <a href="#" class="dropdown-item">Something else here</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">Separated link</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">One more separated link</a>
                    </div>
                </li>
            </ul>

        </div>
        <!-- /.container-fluid -->
    </nav>
