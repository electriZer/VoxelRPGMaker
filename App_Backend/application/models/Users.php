<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 10.06.2016
 * Time: 15:17
 */
class Users extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // Load Database Connection
        $this->load->database();

    }

    public function IsUser($Email,$Password){
        $data = $this->db->get_where('users', array("Email"=>$Email,"Password"=>$Password));
        if(sizeof($data->result())>0){
           $data->free_result();
           return true;
        }
        $data->free_result();
        return false;
    }
    
    public function GetUser($Email,$Password){
        $data = $this->db->get_where('users', array("Email"=>$Email,"Password"=>$Password));
        if(sizeof($data->result())>0){
            $data->free_result();
           return $data->result()[0];
        }
        $data->free_result();
        return false;
    }

    public function EmailExists($Email){
        $data = $this->db->get_where('users', ["Email"=>$Email]);
        if(sizeof($data->result())>0){
            $data->free_result();
            return true;
        }
        $data->free_result();
        return false;
    }

    public function NameExists($Name){
        $data = $this->db->get_where('users', ["Name"=>$Name]);
        if(sizeof($data->result())>0){
            $data->free_result();
            return true;
        }
        $data->free_result();
        return false;
    }
    
    public function AddNewUser($name,$email,$password){
        $data = $this->db->insert("users",["name"=>$name,"email"=>$email,"password"=>$password,"rank"=>0]);
        if($this->db->affected_rows()<1){
            return false;
        }
        return true;
    }



}
