<?php
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 24.06.2016
 * Time: 00:41
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->library("authtool");
        $this->load->model("users");
        
         // Set Content Type
	    //header("Content-type:application/json");
    }

    public function index(){
        redirect(base_url(''));
    }

    public function Form($which)
    {
        switch($which){
            case 'Registration':
                $this->load->view('Welcome/head');
                $this->load->view('Welcome/registration');
                $this->load->view('Welcome/foot');
                break;
        }
        
    }
    
    
    public function Logout(){
        
        // Delete Session
        $this->authtool->SignOutSession();
       
        // Redirect to Start Page
        redirect(base_url(''));
    }
    
    public function Login()
	{
		header("Content-type:application/json");
        // Check : Is Login Form
		if(!isset($_POST["login"])){
		    redirect(base_url("/"));
            exit();
		}
		// Check : User is not already signed in
		if($this->authtool->isSignedIn()){
		    redirect(base_url("/"));
            exit();
		}
		// Check : Email Field and Hash Field are not null
		$this->assertField("email");
		$this->assertField("hash");
		
		/* Validate "email" and "hash" Values */
		$email = $this->input->post("email",true);
		$hash = $this->input->post("hash",true);
		if(strlen($hash)!=64)  $this->FieldError("hash");
		if(!filter_var($email, FILTER_VALIDATE_EMAIL))  $this->FieldError("email");
		
		/* Validate Account */
		$UserDetails = $this->users->GetUser($email,$hash);
		if($UserDetails!=false){
		    // Default Login Page will give only Rank 0
		    $this->authtool->SignInSession($UserDetails);
            echo json_encode(["status"=>1]);
		}else{
            $this->_exit(["status"=>-1]);
		}
		
	}

    public function Registrate(){
		header("Content-type:application/json");
        /* Check Trivial Fail Cases :
            - Is Registration Form
            - Email is set
            - Username is set
            - Hash is set
        */
        if(!isset($_POST["register"])){
            redirect(base_url("/Auth/Form/Registration"));
            exit();
        }
        $this->assertField("email");
        $this->assertField("username");
        $this->assertField("hash");
        
        $email = $this->input->post("email",true);
        $username = $this->input->post("username",true);
        $hash = $this->input->post("hash",true);
        
        /* Sanitize Inputs */
        if(strlen($hash)!=64){
           $this->FieldError("hash");
        }
        if(strlen($username)>16||strlen($username)<4 || !preg_match('/^\w{4,16}$/', $username)){
            $this->FieldError("username");
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
           $this->FieldError("email");
        }
        
        /* Check availability in DB :
            - Username
            - Email
        */
        
        if($this->users->NameExists($username)){
             $this->_exit(["status"=>-1]); // Output Error Name in use
        }
        
        if($this->users->EmailExists($email)){
             $this->_exit(["status"=>-2]); // Output error Email in use
        }
        
        /* Insert new User to Table */
        if($this->users->AddNewUser($username,$email,$hash))
        {
            // Sucessfull 
            echo json_encode(["status"=>1]);
        }else{
            echo json_decode(["status"=>0]);
        }
        
        
    }

    public function assertField($FieldName){
        if(!isset($_POST[$FieldName])){
            $this->FieldError($FieldName);
        }
    }
    
    private function _exit($object){
        $object["error"] = true;
        exit(json_encode($object));
    }
    
    private function FieldError($FieldName){
        $this->_exit(["status"=>0,"field"=>$FieldName]);
    }
}
