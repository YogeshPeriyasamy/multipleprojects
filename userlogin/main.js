 const express=require("express");
 const path=require("path");
 const app=express();

//middlewares
app.use(express.urlencoded({extended:false}));



//creating  router path
const router=require('./router/router_path');
app.use("/login",router)