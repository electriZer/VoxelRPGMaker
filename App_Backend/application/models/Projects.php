<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 10.06.2016
 * Time: 15:17
 */
class Projects extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // Load Database Connection
        $this->load->database();

    }
    
    public function removeForUser($PID,$UID){
        // Trivial Error Case
        if($UID==null||$PID==null)
            return -1;
        
        try
        {
            $data = $this->db->delete('projects',["uid"=>$UID,"pid"=>$PID]);
        }
        catch(Exception $e)
        {
            $data->free_result();
            return -1; // Unknown Error (for example DB Error)
        }
        
        $data->free_result();
        return 1;
    }
    
    public function listForUser($UID){
        // Trivial Error Case
        if($UID==null)return [];
        $result = [];
        
        // Fetch Information from DB
        $data = $this->db->get_where('projects',["uid"=>$UID]);
        
        if($data->num_rows()>0) 
            $result = $data->result_array();
        
        $data->free_result();
        return $result;
    }
    
    public function addForUser($UID,$ProjectName,$ProjectDescription){
        // Trivial Error Case
        if($UID==null||$ProjectName==null)return false;
        
        $this->db->insert('projects',[      "UID"=>$UID,
                                            "Name"=>$ProjectName,
                                            "Description"=>$ProjectDescription,
                                            "CreatedDate"=>date("Y-m-d H:i:s"),
                                            "LastEditDate"=>date("Y-m-d H:i:s"),
                                            "Data"=>"{}"]);
        if($this->db->affected_rows()<1){
            // Error
            return false;
        }
        return true;
                                            
    }
}
