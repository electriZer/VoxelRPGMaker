<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 30.08.2016
 * Time: 11:22
 */


class BrickPacks extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // Load Database Connection
        $this->load->database();
    }
    
    public function getBrickPack($BPID){
        // Get Brick Pack Data from DB
        $BrickPack = $this->db->get_where("BrickPacks",["BPID"=>$BPID]);
        if($BrickPack->num_rows()<=0)   return false;
        else return $BrickPack->result();
    }
    
    public function getBricks($Bricks){
        // Get All Rows from "Bricks" Table which match the IDs in the List $Bricks
		$this->db->where_in("BRICK_ID",$Bricks);
		$BrickList = $this->db->get("Bricks");
		if($BrickList->num_rows()<=0) return false;
		else return $BrickPack->result();
    }
}