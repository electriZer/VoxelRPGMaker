<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 30.08.2016
 * Time: 11:22
 */


class BrickTextures extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // Load Database Connection
        $this->load->database();
    }
    
    /**
     * Inserts uploaded Texture File to DB
     * 
     * @return BTID (Brick Texture ID)
     * 
     * @param $Name File Name
     * @param $BLOB File Binary ( FieldType : "MEDIUMBLOB" => Max 16MB )
     * @param $Size File Size
     * @param $Type Meta Type
     * @param $UID Uploader/Author UID (User ID)
     */ 
    public function UploadTexture($Name,$BLOB,$Size,$Type,$UID){
        // INSERT INTO `VoxelRPGMaker`.`BrickTextures` (`BTID`, `Name`, `Hash`, `Size`, `Type`, `UID`) VALUES (NULL, 'NeuesTextdokument', '', '0', 'text/text', '');
        $Data = ["Name"=>$Name,"Size"=>$Size,"Type",$Type,"UID"=>$UID];
        $Data["hash"] = md5($BLOB);
        $Data["IMG"] = $BLOB;
        $this->db->insert("bricktextures",$Data);
        
        if($this->db->affected_rows()<1){
            // Error
            return false;
        }
        return $this->db->insert_id();
    }
    
    /**
     * @return Brick Texture Row by BTID (Brick Texture ID).
     * @return If not found, it returns false.
     * 
     * Remarks :
     *  Brick Texture Row structure : ["BTID","Name","Hash","Size","IMG",Type","UID"]
     *  (The Field "IMG" contains the BLOB of the File)
     */
    public function DownloadTexture($BTID){
        $res = $this->db->get_where("bricktextures",["BTID"=>$BTID],1);
        if($res->num_rows()>0)return $res->first_row();
        
        return false;
    }
}