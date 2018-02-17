<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 30.08.2016
 * Time: 15:17
 */
class BrickData extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library("authtool");
		$this->load->model("BrickTextures");
		$this->load->model("BrickPacks");
	}
	
	public function BrickPackage($BPID = 0){
	    // Trivial Case : User is not signed in
	    if(!$this->authtool->isSignedIn())
	    { 
	        redirect(base_url("/"));
	        return;
	    }
	    
	    // Set Content Type to JSON
	    header("Content-type:application/json");
	    
	    // Get Brick Pack Data from DB
	    $BrickPack = $this->BrickPacks->getBrickPack($BPID);
	   
	    
	    // Check : BrickPack was fetched successfully from DB
	    if(!$BrickPack){
	    	exit(json_encode(["error"=>true,"msg"=>"No Brick Pack found"]));
	    }
	    
	    // Check : BrickPacks Field "Bricks" is not empty
	    if(!is_array($BrickPack) || !isset($BrickPack["Bricks"]) || strlen($BrickPack["Bricks"]) <= 0){
	    	exit(json_encode(["error"=>true,"msg"=>"Brick Pack empty"]));
	    }
	    
	    // Parse Brick List as Array
	    $Bricks = unserialize($BrickPack["Bricks"]);
	    
	    // Check : Brick List is not empty Array
	    if(!is_array($Bricks) || sizeof($Bricks)==0){
	    	// output empty JSON Object
	    	exit(json_encode([]));
	    }
	    
	    // Get All Rows from "Bricks" Table which match the IDs in the List $Bricks
		$BrickList = $this->brickpacks->getBricks($Bricks);
		
		
		$BrickPack = [];	// Resulting JSON Object
		
		// Iterate through the Brick List and add each Brick to the Resulting JSON Object
		foreach($BrickList as $Brick){
			$BrickName = $Brick["Name"];
			
			$tmp_NameCounter = 2;
			RetryName: 
			if( isset($BrickPack[$BrickName] )){
				$BrickName = $Brick["Name"]."_".$tmp_NameCounter;
				$tmp_NameCounter++;
				goto RetryName;
			}
			
			$BrickPack[$BrickName] = [
					"TextureImages" => $Brick["Textures"],
					"TextureMapping" => $Brick["Mapping"]
				];
				
			echo json_encode($BrickPack);
		}
		
		// Output resulting JSON Object
		echo(json_encode($BrickPack));
		
	}
	
	public function BrickTexture($BTID){
	    // Trivial Case : User is not signed in
	    if(!$this->authtool->isSignedIn())
	    { 
	        redirect(base_url("/"));
	        return;
	    }
	    
	    // Get Texture by BTID from DB
	    $res = $this->bricktextures->DownloadTexture($BTID);
	    
	    // Check if Textue was not found in DB
	    if(!$res){
	        redirect(base_url("/"));
	        return;
	    }
	    
	    // Set Content-type to mime type of image file
	    header("Content-type:"+$res["type"]);
	    
	    // output image binary
	    echo $res["IMG"];
	}
	
}