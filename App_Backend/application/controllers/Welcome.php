<?php
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 24.06.2016
 * Time: 00:41
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library("authtool");
	}

	public function index()
	{
		$this->load->view('Welcome/head');
		if($this->authtool->isSignedIn()){
			$this->load->view('Welcome/BigHeader_member');
		}else{
			$this->load->view('Welcome/BigHeader');
		}
		
		$this->load->view('Welcome/foot');
	}
}
