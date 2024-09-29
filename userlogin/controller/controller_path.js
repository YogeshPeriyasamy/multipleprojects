const path=require("path")
exports.get("/login_page")=(req,res)=>{
res.sendFile(path.join(__dirname,'../view/login'));
}