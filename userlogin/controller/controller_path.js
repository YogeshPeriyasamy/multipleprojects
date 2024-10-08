const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const expensedb=require('../models/expense');
const userdb=require('../models/user');
const path = require("path");
const bcrypt = require("bcrypt");
exports.signup_page = (req, res) => {
    res.sendFile(path.join(__dirname, '../view/signup.html'));
}



// to add the req.user from the signup page
const user_database = require('../models/user');
exports.add_requser = async (req, res) => {
    const { name, mail, password } = req.body;
    console.log(name, mail, password);
    try {
        let encrypted_password = await bcrypt.hash(password, 10);

        console.log("its encrtpted", encrypted_password);
        await user_database.findOne({ where: { mail: mail } })
            .then((user) => {
                if (!user) {
                    return user_database.create({
                        name: name,
                        mail: mail,
                        password: encrypted_password,
                        totalspent:0,
                    })
                }
                else {
                    // Send response and stop further execution if user is already registered
                    return user
                }
            })
            .then(user => {
                console.log("user has been recognised");

            })
            .catch(err => console.log(err))
    } catch (error) {
        console.log(error);
    }
}


//to check whether the login is allowed

exports.login_details = async (req, res) => {
    const { mail, password } = req.body;
    console.log(mail, password);
    try {
        await user_database.findOne({ where: { mail: mail } })
            .then((user) => {
                console.log(user.mail, user.password);
                if (!user) {
                    // If no user is found, send an appropriate response
                    return res.json({ message: "User not found" });
                }

                // Check if the provided password matches
                // else if (user.password === password) {
                //     // Password is correct
                //     return res.status(200).json({message: "User logged in"});
                // } 
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // return res.json({ message: " user logged" });
                        //as axios doesnot understanding the res.redirect
                        // return res.redirect('/user/openexpense');
                        //setting req.user when the userlogged in
                        req.session.userId = user.id; // Store a plain object instead;

                        req.session.save(err => {
                            if (err) {
                                console.error('Session save error:', err);
                                return res.status(500).json({ message: 'Error saving session' });
                            }
                            
                            return res.json({ redirect: true, url: 'http://localhost:3000/user/openexpense' });
                        });
                    }
                    else {
                        // Password does not match
                        return res.json({ message: "Incorrect password" });
                    }
                })

            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error" });
            });
    } catch (err) {
        console.log(err);
    }
};

// to open the expense page
exports.openexpensepage = (req, res) => {
    
    res.sendFile(path.join(__dirname, '../view/expensepage.html'))
}

//to add expense to db
exports.add_expense = async (req, res) => {
    
    const { amount, description, category } = req.body;
    // here we must use instance that connects data base not the require("sequelize") class
    const t=await sequelize.transaction();
    console.log('on addexpense',req.session.userId);
    try {
        //transaction creates a function and adds operation inside it if all operation succeed it commits or all operation fails
        //here we do two action update the total spent in user and create a new expense so one fails fails entirely
        

        //  const user = await user_database.findByPk(req.session.userId);
        const user = await user_database.findByPk(req.session.userId);
        if(user){
            user.totalspent=parseInt(user.totalspent)+parseInt(amount);
            user.save({transaction:t});
        }
        const newexpense=await user.createExpense({
            amount: amount,
            description: description,
            category: category
        },{transaction:t})
            
            await t.commit();
            res.json({ id:newexpense.id,amount, description, category })
          
    } catch (err) {
        await t.rollback();
        console.log(err);
    }
}


//to get the old expense from db
exports.get_expense=async(req,res)=>{
   try{
     const user=await user_database.findByPk(req.session.userId);
     const expenses=await user.getExpenses();
     res.json(expenses);
   }catch(err){
    console.log(err);
   }
}

//to get the leaderboard list

exports.getleaderboard=async(req,res)=>{
   try{
    //   const allexpenses=await expensedb.findAll({
    //     attributes:[
    //         'userId',
    //         [Sequelize.fn('sum',Sequelize.col('amount')),'totalspent']//sum the amount of the particular group and save them in totalsent
    //     ],
    //     group:['userId'],//grouping by userId
    //     include:[{model:userdb,attributes:['name']}],
    //     order:[[Sequelize.col('totalspent'),'DESC']],
       
    //   }) 

    // instead of that we r creating a total spent on user table which will be updated for every user expenses
    const alluserexpenses=await userdb.findAll({
        attributes:['id','name','totalspent'],
        order:[['totalspent','DESC']],
    })
      res.json(alluserexpenses);
   }catch(err){
    console.log('while getting leaderboard from backend',err)
   }
}

//to delete expense from the expensedb along with user total spent amount rreduction
exports.delete_expense=async(req,res)=>{
   const{del_id,amount}=req.body;
   console.log('while deleteing get log ',del_id,amount);
   const d=await sequelize.transaction();
   try{
   const to_delete=await expensedb.findOne({where:{id:del_id}})
   if(to_delete){
    await to_delete.destroy({transaction:d});
    const user = await user_database.findByPk(req.session.userId);
    if(user){
        user.totalspent=parseInt(user.totalspent)-parseInt(amount);
        await user.save({transaction:d})
    }
    await d.commit();
    res.json({message: 'Expense deleted'});
   }
   else {
    // If the expense was not found
    res.status(404).json({ message: 'Expense not found' });
    await d.rollback(); // Rollback the transaction if nothing was deleted
}
   }catch(err){
    await d.rollback();
    console.log('while deleting expense',err)
   }
}
