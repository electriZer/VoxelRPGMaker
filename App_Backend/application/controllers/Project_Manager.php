<?php
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 24.06.2016
 * Time: 00:41
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Project_Manager extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library("authtool");
		$this->load->model("projects");
	}
	
	private $ProjectEditor = "Project-Editor/Show";		// Name of the Project Editor Controller
	private $ProjectManager = "Project-Manager";		// Name of this Controller

	public function index()
	{
		// Trivial Case : User is not signed in
		if(!$this->authtool->isSignedIn()){
		    redirect(base_url("/"));
		}
		/* PlaceFor : Check User Rights and redirect to error Page or show blocked Page */
		
		$this->load->view('ProjectManager/head.tmpl.php');
		
		/*  View Functions :
		- Load Project Information from DB and List Projects 
		- Remove Projects and open Projects in Editor View
		*/
		$Projects  = $this->projects->listForUser($_SESSION["user"]["uid"]);
		$ProjectListContainer = $this->load->view('ProjectManager/ProjectList.tmpl.php',
				["Projects"=>$Projects,
				"ProjectEditor"=>$this->ProjectEditor,
				"ProjectManager"=>$this->ProjectManager],true);
		
		$this->load->view('ProjectManager/Page',["ProjectListContainer"=>$ProjectListContainer]);
		$this->load->view('ProjectManager/foot.tmpl.php');
	}
	
	public function NewProject(){
		 // Set Content Type
	    header("Content-type:application/json");
	    
		// Trivial Cases : User not signed in OR Form Fields not set
		if(!$this->authtool->isSignedIn() || !isset($_POST["ProjectName"]) || !isset($_POST["ProjectDescription"])){
			// Redirect to Home
			redirect(base_url("/"));
		}
		
		// Check String length
		if(strlen($_POST["ProjectName"]) > 50 || strlen($_POST["ProjectName"]) < 4){
			// Return Error Message to client
			echo json_encode(["error"=>true,"status"=>-1]);
			return;
		}
		
		// Compress Strings
		$Name = $_POST["ProjectName"];//gzencode ($_POST["ProjectName"],0);
		$Description = (isset($_POST["ProjectDescription"]) && strlen($_POST["ProjectDescription"])>0)?$_POST["ProjectDescription"]:"";//gzencode (strlen($_POST["ProjectDescription"])>0?$_POST["ProjectDescription"]:"",0);
		
		// Load into DB
		$ok = $this->projects->addForUser($_SESSION["user"]["uid"],$Name,$Description);
		
		echo json_encode(["error"=>!$ok,"status"=>1]);
		return;
	}
	public function RemoveProject($PID){
		 // Set Content Type
	    header("Content-type:application/json");
	    
		/* Trivial Fail Cases : */
		// Wrong request method		
		if($_SERVER['REQUEST_METHOD']!="DELETE") 					
		{
			redirect(base_url($this->ProjectManager));
		}
		
		// Invalid credential information
		if(!$this->authtool->isSignedIn()){
			return json_encode(["status"=>"0","error"=>true,"msg"=>"Session expired"]);
		}
		
		/* Call Database Model : */
		$DB_Result = $this->projects->removeForUser($PID,$_SESSION["user"]["uid"]);
		
		// If Database Action was successfull
		if($DB_Result==0){
			// Return OK Status
			return json_encode(["status"=>"1","error"=>false]);
		}else{
			// Return Error Code as Status 
			return json_encode(["status"=>$DB_Result,"error"=>true]);
		}
	}
}
