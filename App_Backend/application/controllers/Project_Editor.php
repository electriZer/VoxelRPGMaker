<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 24.06.2016
 * Time: 00:41
 */


class Project_Editor extends CI_Controller {

	private $ProjectManager = "Project-Manager";
	public function __construct()
	{
		parent::__construct();
		$this->load->library("authtool");
		$this->load->model("projects");
	}

	public function index()
	{
		// Allways redirect to Start Page
		// Here is nothing to see
		redirect(base_url($this->ProjectManager));
	}
	
	public function Show($PID){
		// Trivial Case : Invalid Project ID
		if($PID==null||!is_numeric($PID)){
			redirect(base_url($this->ProjectManager));
		}
		
		if(!$this->authtool->isSignedIn()){
			redirect(base_url());
		}
		$data = ["PID"=>$PID];
		$this->load->view("ProjectEditor/Main",$data);
	}
}
