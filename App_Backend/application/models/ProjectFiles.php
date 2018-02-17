<?php defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 30.08.2016
 * Time: 11:22
 */


class ProjectFiles extends CI_Model
{
    public function __construct()
    {
        parent::__construct();

        // Load Database Connection
        $this->load->database();

    }

    /**
     * Sets Content to File Entry of User Project
     * @param mixed $PID Project ID
     * @param mixed $HFID File Hash
     * @param mixed $UID User ID
     * @param string $Content Content (should be base64 encoded)
     */
    public function setFileContent($HFID, $Content, $PID, $UID){
        $ret = $this->db->set("Content",$Content)
            ->where("HFID",$HFID)
            ->where("UID",$UID)
            ->where("PID",$PID)
            ->limit(1)
            ->update("ProjectFiles");
        return $ret->num_rows();
    }

    /**
     * Gets File Entry Content of User Project
     * @param mixed $HFID File Hash
     * @param mixed $PID Project ID
     * @param mixed $UID User ID
     * @return string Content (should be base64 encoded)
     */
    public function getFileContent($HFID,$PID,$UID){
        $this->db->select("Content");
        $this->db->where("HFID",$HFID);
        $this->db->where("UID",$UID);
        $this->db->where("PID",$PID);
        $File = $this->db->get("ProjectFiles");

        if($File->num_rows()<=0)   return "";
        else return $File->result()[0]->Content;
    }



    /**
     * Returns File or Folder Entry by Hash ID
     * @param mixed $HFID File HASH (Folders also have this)
     * @param mixed $PID Project ID
     * @param mixed $UID User ID
     * @return mixed Num of affected rows
     */
    public function RemoveEntry($FID,$PID,$UID){
        $result = $this->db->where("FID",$FID)
                ->where("PID",$PID)
                ->where("UID",$UID)
                ->delete("ProjectFiles");
        return $result;
    }

	/**
	 * Checks if File Name exists in Folder of User Project
	 * @param mixed $Name File Name
	 * @param mixed $Parent Parent Folder ID (0=Root)
     * @param mixed $PID Project ID
	 * @param mixed $UID User ID
	 * @return boolean true if file exists
	 */
	public function FileExists($Name,$Parent,$PID, $UID){
		$this->db->select("HFID");
        $this->db->where("NAME",$Name);
        $this->db->where("PARENT",$Parent);
        $this->db->where("UID",$UID);
        $this->db->where("PID",$PID);
		$this->db->limit(1);
		$File = $this->db->get("ProjectFiles");
		if($File->num_rows()<1)return false;
		else return true;
	}

	public function GetEntryName($FID,$PID,$UID){
	    $Q = $this->db->select("NAME")
            ->where("FID",$FID)
            ->where("PID",$PID)
            ->where("UID",$UID)
            ->limit(1)
            ->get("ProjectFiles");
	    if ($Q->num_rows()>0){
	        return $Q->result_array()[0]["NAME"];
        }
        return false;
    }
    public function EntryExists($FID,$PID,$UID){
        $Q = $this->db
            ->select("NAME")
            ->where("FID",$FID)
            ->where("PID",$PID)
            ->where("UID",$UID)
            ->limit(1)
            ->get("ProjectFiles");
        return ($Q->num_rows()>0);
    }

    public function EntryUpdate($FID,$PID,$UID,$NAME,$PARENT){
	    $Q = $this->db->set("NAME",$NAME)
            ->set("PARENT",$PARENT)
            ->where("FID",$FID)
            ->where("PID",$PID)
            ->where("UID",$UID)
            ->update("ProjectFiles");
	     return $Q;
    }

    /**
     * Checks if Folder exists in User Project
     * @param mixed $FID File ID
     * @param mixed $PID Project ID
     * @param mixed $UID User ID
     * @return boolean true if folder exists
     */
	public function FolderExists($FID,$PID, $UID){
        // Trivial Case : Root folder
        if($FID == 0)return true;
		$this->db->select("NAME");
        $this->db->where("FID",$FID);
        $this->db->where("UID",$UID);
        $this->db->where("PID",$PID);
        $this->db->where("TYPE",0);
		$this->db->limit(1);
		$File = $this->db->get("ProjectFiles");
		if($File->num_rows()<1)return false;
		else return true;
	}

    /**
     * Adds new File or Folder Entry to User Project
     * @param mixed $Name  File or Folder Name
     * @param mixed $Parent ID of Parent Folder (0=Root Folder)
     * @param mixed $type File Type (0=Dir/1-*=File Types)
     * @param mixed $PID Project ID
     * @param mixed $UID User ID
     * @return mixed File ID
     */
    public function addEntry($Name,$Parent,$type,$PID,$UID){
        $this->db->insert("ProjectFiles",[
            "NAME"=>$Name,
            "PARENT"=>$Parent,
            "PID"=>$PID,
            "UID"=>$UID,
            "TYPE"=>$type,
            ]);
        return $this->db->insert_id();
    }

    /**
     * Gets Array of all Project File Entrys (not sorted)
     * @param mixed $PID Project ID
     * @param mixed $UID User ID
     * @return mixed Array of ["ID","ME","PARENT","Name","TYPE","LAST_EDIT"]
     */
    public function getUserProjectFiles($PID,$UID){
        // Get All Rows from "ProjectFiles" Table which match the IDs in the List $Bricks
		$this->db->where("UID",$UID);
        $this->db->where("PID",$PID);
		$this->db->select("FID AS id,PARENT as parent, NAME as text,TYPE as type");
		$FileList = $this->db->get("ProjectFiles");

		if($FileList->num_rows()<=0) return false;
		else {
		    $data = $FileList->result_array();
		    $FileList->free_result();
            $ReturnArray = [];
            for($i =0 ; $i < sizeof($data); $i++ ){
                $row = $data[$i];
                $ReturnArray[$i] = [
                    "id"=>intval($row["id"]),
                    "parent"=>intval($row["parent"]),
                    "text"=>$row["text"],
                    "type"=>$row["type"]
                ];
            }
            return $ReturnArray;
        }
    }
}