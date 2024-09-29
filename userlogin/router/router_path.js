const express=require("express")
const router=express.Router();
const path=require("path");

//creating a route for controller
const controller_route=require("../controller/controller_path");

router.get("/loginpage",controller_route.login_page);

module.exports=router;