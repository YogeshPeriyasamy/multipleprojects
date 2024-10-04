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

// to open the  expense page
router.get("/openexpense",controller_route.openexpensepage);

//to add expense to the backend
router.post("/addexpense",controller_route.add_expense);

//to get old expense from db
router.get("/getexpense",controller_route.get_expense);
module.exports=router;