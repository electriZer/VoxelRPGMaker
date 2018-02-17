<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Manager</title>
    <link rel="stylesheet" type="text/css" href="/css/Editor/Misc.css"/>
    <link rel="stylesheet" type="text/css" href="/css/Editor/Editor.css"/>
    <link rel="stylesheet" type="text/css" href="/css/font-awesome.min.css"/>
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="/css/jstree.min.css"/>
    <link rel="stylesheet" type="text/css" href="/css/perfect-scrollbar.min.css" />

    <link rel="stylesheet" type="text/css" href="/css/vex.css" />
    <link rel="stylesheet" type="text/css" href="/css/vex-theme-default.css" />

    <script type="application/javascript" src="/js/lib/jquery.min.js"></script>
    <script type="application/javascript" src="/js/lib/jstree.js"></script>
    <script type="application/javascript" src="/js/lib/perfect-scrollbar.jquery.min.js"></script>
    <script type="application/javascript" src="/js/lib/tether.min.js"></script>

    <script type="application/javascript" src="/js/lib/bootstrap.min.js"></script>
    <script type="application/javascript" src="/js/lib/three.js"></script>
    <script type="application/javascript" src="/js/lib/vex.combined.min.js"></script>
    <script type="application/javascript">
        (function(){
            vex.defaultOptions.className = 'vex-theme-default';
            //vex.defaultOptions.overlayClosesOnClick = false;
            //vex.defaultOptions.escapeButtonCloses = false
            vex.defaultOptions.closeAllOnPopState = false;
        })();
    </script>
    <script type="application/javascript" src="/js/Editor.js"></script>


</head>
<body onload="Application.Run()">
    <!-- CUSTOM TAGS
        <x-editor height="500" width="500"></x-editor>
    -->
    <x-side-bar left>
        <x-bar-widget title="Files">
           <x-file-tree data-file="<?=base_url("/data/Files");?>" data-pid="<?=$PID?>"></x-file-tree>
        </x-bar-widget>
    </x-side-bar>
    <x-main>
        <x-tab-view x-maintab>

        </x-tab-view>
    </x-main>
    
    <x-bar foot></x-bar>
</body>
</html>


<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 30.08.2016
 * Time: 11:22
 */


