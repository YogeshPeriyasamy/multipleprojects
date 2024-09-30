const path=require("path")
exports.signup_page=(req,res)=>{
res.sendFile(path.join(__dirname,'../view/signup.html'));
}



// to add the req.user from the signup page
const user_database=require('../models/user');
exports.add_requser=(req,res)=>{
    const{name,mail,password}=req.body;
    console.log(name,mail,password);
    user_database.findOne({where:{mail:mail}})
    .then((user)=>{
        if(!user){
            return user_database.create({
                name:name,
                mail:mail,
                password:password
            })   
        }
      else{
        // Send response and stop further execution if user is already registered
        return user
      }
    })
    .then(user=>{
        console.log("user has been recognised");
        req.user=user;
    })
    .catch(err=>console.log(err))
}


//to check whether the login is allowed

exports.login_details = (req, res) => {
    const { mail, password } = req.body;

    user_database.findOne({ where: { mail: mail } })
    .then((user) => {
        if (!user) {
            // If no user is found, send an appropriate response
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the provided password matches
        if (user.password === password) {
            // Password is correct
            return res.status(200).json(user);
        } else {
            // Password does not match
            return res.status(401).json({ message: "Incorrect password" });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    });
};
