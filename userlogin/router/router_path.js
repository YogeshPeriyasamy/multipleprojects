const express=require("express")
const router=express.Router();
const path=require("path");

//creating a route for controller
const controller_route=require('../controller/controller_path');

router.get("/signup_page",controller_route.signup_page);
//method to add the user as req.user
router.post("/login_credentials",controller_route.add_requser);

//get the login page details
router.post("/login",controller_route.login_details);


module.exports=router;