<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 30.08.2016
 * Time: 15:17
 */
class ProjectData extends CI_Controller {
    public $UID;
	public function __construct()
	{
		parent::__construct();
		$this->load->library("authtool");
		$this->load->model("ProjectFiles");

		// Set Content Type to JSON
	    //header("Content-type:application/json");
	    $this->ValidateUser();
        $this->UID = $_SESSION["user"]["uid"];
	}

	private function ValidateUser(){
	    // Trivial Case : User is not signed in
	    if(!$this->authtool->isSignedIn())
	    {
	        redirect(base_url("/"));
	        return false;
	    }
	    return true;
	}

	public function Remove($PID){
        $ID = intval($this->input->post("id"));

        $ENTRY_NAME = $this->ProjectFiles->GetEntryName($ID,$PID,$this->UID);
        if(!$ENTRY_NAME){
            exit(json_encode(["error"=>true,"msg"=>"Entry Does not exist","status"=>-1]));
        }

        $Q = $this->ProjectFiles->RemoveEntry($ID,$PID,$this->UID);

        if($Q){
            exit(json_encode(["error"=>false]));
        }else{
            exit(json_encode(["error"=>true,"msg"=>"Unknown Error"]));
        }

    }
	public function Update($PID){
	    $ID = intval($this->input->post("id"));
	    $NAME = strval($this->input->post("text"));
	    $PARENT = intval($this->input->post("parent"));

	    $ENTRY_NAME = $this->ProjectFiles->GetEntryName($ID,$PID,$this->UID);
	    if(!$ENTRY_NAME){
            exit(json_encode(["error"=>true,"msg"=>"Entry Does not exist","status"=>-1]));
        }
        if($ENTRY_NAME==$NAME){
            exit(json_encode(["error"=>true,"msg"=>"Name already used","status"=>-2]));
        }

        $update = $this->ProjectFiles->EntryUpdate($ID,$PID,$this->UID,$NAME,$PARENT);
        if(!$update){
            exit(json_encode(["error"=>true]));
        }else{
            exit(json_encode(["error"=>false,"id"=>$ID]));
        }
    }
    /**
     * Creates New Node
     * @param $PID Project ID
     *
     * Post params :
     * @param parent Parent Node ID (0 for Root Node)
     * @param type Node Type ( 0= Dir, 1-*= File)
     * @param text Node Name
     */
	public function Add($PID){
        $PARENT = intval($this->input->post("parent"));
        $TYPE = intval($this->input->post("type"));
        $NAME = $this->input->post("text");

        if($PARENT>0){
            $FolderExists = $this->ProjectFiles->FolderExists($PARENT,$PID,$this->UID);
            if(!$FolderExists){
                // Stop here and output error
                exit( json_encode(["error"=>true,"msg"=>"Parent Folder not found","status"=>-1]));
            }
        }else $PARENT = 0;

        $FID = $this->ProjectFiles->addEntry($NAME,$PARENT,$TYPE,$PID,$this->UID);
        exit(json_encode(["error"=>false,"msg"=>"","status"=>1,"ID"=>$FID]));
    }

	/**
	 * Creates new User Project Entry
	 * @param mixed $PID Project ID
	 * @param mixed $Parent Parent Folder ID (0=Root)
	 * @param mixed $TYPE ("0" = Dir, "1-*" = File)
	 * @return void

	public function AddFile($PID,$Parent,$TYPE){
        //$Type = $this->input->post("type");
        $Name = $this->input->post("name");
        // Check if Parent Folder exists
        $FolderExists = $this->ProjectFiles->FolderExists($Parent,$PID,$this->UID);
        if(!$FolderExists){
            // Stop here and output error
             echo json_encode(["error"=>true,"msg"=>"Folder not found","status"=>-1]);
             return;
        }
        $FileExists = $this->ProjectFiles->FileExists($Name,$Parent,$PID,$this->UID);
		if($FileExists){
            // Stop here and output error
            echo json_encode(["error"=>true,"msg"=>"File already exists","status"=>0]);
            return;
        }
        $FID = $this->ProjectFiles->addEntry($Name,$Parent,$TYPE,$PID,$this->UID);
        $HFID = $this->ProjectFiles->getHFIDByFID($FID,$PID,$this->UID);
        echo json_encode(["error"=>false,"status"=>1,"HFID"=>$HFID]);
	}
     */
	/**
	 * Set File Content
	 * @param mixed $PID Project File ID
	 * @param mixed $HFID File Hash
	 * @return void
	 */
	public function SetFile($PID,$HFID){
        $Content = $this->input->post("file");
        // Check if File Content is served
        if(!isset($Content)){
            // Output error and exit if not
            echo json_encode(["error"=>true,"status"=>0]);
            return;
        }
        // Check if HFID is valid
        $FileExists = $this->ProjectFiles->HFIDExists($HFID);
        if(!$FileExists){
            echo json_encode(["error"=>true,"status"=>-1]);
            return;
        }
        // set File Content in DB
        $Compressed = gzcompress($Content);
        $ret = $this->ProjectFiles->setFileContent($HFID,$Compressed,$PID,$this->UID);
	}


	public function ListFiles($PID){
        header("Content-type:application/json");
        $main = ["id"=>0,"text"=>"Workspace","type"=>"#","parent"=>"#"];
        $FilesList = $this->ProjectFiles->getUserProjectFiles($PID,$this->UID);
	    if(!$FilesList){
	        //exit(json_encode(["error"=>true,"msg"=>"No Files Found","status"=>0]));
            exit(json_encode($main));
	    }
	    //preprocess data
        //$RootFiles = $this->GetChildsOfME($FilesList,0);
        //echo json_encode([["Name"=>"Workspace","TYPE"=>"0","ID"=>"0", "Files"=>$RootFiles]]);
        array_push($FilesList,$main);
        echo json_encode(array_values($FilesList));
	}

    /**
     * @param $ARR  Array containing
     * @param $ME
     * @return array
     * /
	private function GetChildsOfME($ARR,$ME){
	    $OUT = [];
	    for($i = 0; $i < sizeof($ARR);$i++){
	        $NODE = $ARR[$i]; // Get Information for New Entry from Node Array
            if($NODE["PARENT"]==$ME){
                $ENTRY = ["Name"=>$NODE["Name"],"TYPE"=>$NODE["TYPE"],"ID"=>$NODE["ID"]];
                if($NODE["TYPE"]==0){
                    $ENTRY["Files"] = $this->GetChildsOfME($ARR,$NODE["ME"]);
                }
                array_push($OUT,$ENTRY);
            }
        }
        return $OUT;
    }*/

    /**
    * Output File Content
    */
	public function GetFile($PID,$HFID){
        // Check if File Content is served
        if(!isset($Content)){
            // Output error and exit if not
            echo json_encode(["error"=>true,"status"=>0]);
            return;
        }
        // Check if HFID is valid
        $FileExists = $this->ProjectFiles->HFIDExists($HFID);
        if(!$FileExists){
            echo json_encode(["error"=>true,"status"=>-1]);
            return;
        }

		$FileContent = $this->ProjectFiles->getProjectFileContent($HFID,$this->UID,$PID);

	    // Set Content Type to plain Text
	    header("Content-type:text/plain");
	    echo gzuncompress($FileContent);
	}

    // Debug helper
	private  function  ln(){
        echo "
";
    }
}