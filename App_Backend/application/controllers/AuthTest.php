<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 10.06.2016
 * Time: 15:44
 */

class AuthTest extends CI_Controller{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(){
        $this->load->helper("url");
        redirect('Auth/Start');
    }

    public function Start(){
        // Load Libs
        $this->load->library("authtool");
        $this->load->library('parser');

        $data = ["LoginForm"=>"","RegistrationForm"=>""];
        if($this->authtool->isSignedIn()){
            $data["AuthState"] = "Signed In";
        }else{
            $data["AuthState"] = "Not Signed In";
            $data["LoginForm"] = $this->load->view("Test/LoginForm",'',TRUE);
            //$data["RegistrationForm"] = $this->load->view("Test/RegistrationForm");
        }
        $this->parser->parse("Test/AuthIndex",$data);
    }

    public function SignIn(){
        if(!isset($_POST["email"])||!isset($_POST["password"])){
            $this->load->library("output");
            $this->output->set_status_header(400,"Bad Request");
            exit(json_encode(["error"=>true,"message"=>""]));
        }
    }

    public function MemberArea(){
        $this->load->library("auth",["rank"=>1]);
    }

    public function AdminArea(){
        $this->load->library("auth",["rank"=>2]);
    }
}