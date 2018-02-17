<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * This File is Part of the VoxelRPGMaker Project.
 * (C) Copyright 2016 by Jiyan Akgül.
 *
 * Date: 10.06.2016
 * Time: 04:12
 */

class Authtool
{

    /**
     * @var CI_Controller
     */
    private $CI;

    /// Settings
    private $MIN_RANK;

    /// Procedure Checks
    private $RANK_OK;
    private $SIGNED_IN;

    #region Constants
    const DEFAULT_RANK = 0;
    // Error Messages
    private $ERR_MSG = array("403"=>"You have no permissions to access this Page.",
        "403_SE"=>"You have no permissions to access this Page. Please sign in.");
    #endregion

    public function __construct($params=[])
    {
        //////// Init Code Igniter
        $this->CI =& get_instance();
        $this->CI->load->library('session');

        //////// Set Parameters
        // Rank
        if(isset($params["rank"])){
            $this->MIN_RANK = $params["rank"];
        }else{
            $this->MIN_RANK = self::DEFAULT_RANK; // Default Value (Everyone has Access)
        }

        //////// Proceed
        $this->initSession();


    }

    private function initSession(){
        if(isset($_SESSION["user"])) {
            $this->SIGNED_IN = true;
            if (isset($_SESSION["user"]["rank"])) {
                if ($_SESSION["user"]["rank"] >= $this->MIN_RANK) $this->RANK_OK = true;
                else $this->ERR_FORBIDDEN();
            }
        }
        else {
            if($this->MIN_RANK <= self::DEFAULT_RANK) $this->RANK_OK = true;
            else $this->ERR_FORBIDDEN_SE();
        }
    }

    #region Error Handlers
    /**
     * Returns 403 Forbidden Error
     * This Function is called if a user has not enough rights to view (or simply call) a Page
     */
    private function ERR_FORBIDDEN(){
        show_error($this->ERR_MSG["403"],403,"Forbidden");
    }

    /**
     * Returns 403 Forbidden Error
     * This Function is called if a user has not enough rights to view (or simply call) a Page
     * Properly because his/her session expired
     */
    private function ERR_FORBIDDEN_SE(){
        show_error($this->ERR_MSG["403_SE"],403,"Please Sign In");
    }
    #endregion

    #region Public Methods
    public function SignInSession($UserDetails){
        $_SESSION["user"] = ["rank"=>$UserDetails->Rank,
                            "name"=>$UserDetails->Name,
                            "uid"=>$UserDetails->UID,
                            "email"=>$UserDetails->Email];
        $this->initSession();
    }
    
    public function SignOutSession(){
        session_destroy();
    }
    #endregion

    #region Getter
    public function hasRank(){
        return $this->RANK_OK;
    }
    public function isSignedIn(){
        return $this->SIGNED_IN;
    }
    #endregion




}