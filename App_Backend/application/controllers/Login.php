<?php
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 24.06.2016
 * Time: 00:41
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library("authtool");
		$this->load->model("users");
	}

	public function index()
	{
	     /* Check Trivial Fail Cases :
            - Is Login Form
            - User is not already signed in
            - Email is set
            - Hash is set
        */
		if(!isset($_POST["login"])){
		    redirect(base_url("/"));
            exit();
		}
		if($this->authtool->isSignedIn()){
		    redirect(base_url("/"));
            exit();
		}
		$this->assertField("email");
		$this->assertField("hash");
		
		/* Validate "email" and "hash" Values */
		$email = $this->input->post("email",true);
		$hash = $this->input->post("hash",true);
		if(strlen($hash)!=64)  $this->FieldError("hash");
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))  $this->FieldError("email");
		
		/* Validate Account */
		if($this->users->IsUser($email,$hash)){
		    // Default Login Page will give only Rank 0
		    $this->authtool->SignInSession($email,0);
            $this->exit(["status"=>1]);
		}else{
		     $this->exit(["status"=>-1]);
		}
		
	}
	
	// Todo: Create custom Login Page
	public function Form(){
	    $this->load->view('Welcome/head');
		$this->load->view('Welcome/index');
		$this->load->view('Welcome/foot');
	}
	
	public function assertField($FieldName){
        if(!isset($_POST[$FieldName])){
            $this->FieldError($FieldName);
        }
    }
    private function exit($json){
        exit(json_encode($json));
    }
    private function FieldError($FieldName){
        exit(json_encode(["status"=>0,"field"=>$FieldName]));
    }
}
