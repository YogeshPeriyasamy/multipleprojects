const express = require("express");
const path = require("path");
const app = express();
const cors=require("cors");
const session=require('express-session');

// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Do not use Secure in development (HTTP)
        httpOnly: true, // Cookie accessible only by the web server
        sameSite: 'lax' // Use 'lax' for local development; avoids cross-origin issues
        //When using SameSite=None, if you don't set Secure: true, modern browsers will block the cookie
         //to enhance security and prevent potential misuse. so when secure false use 'lax'
    }
}));

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3001', // Frontend origin
    credentials: true 
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

//here first install dotenv and require them as follows in main.js so we can use them in any folders
require('dotenv').config({path:('./util/.env')});

// Router Path
const router = require('./router/router_path');  
app.use("/user", router);

// Sequelize Database
const sequelize = require('./util/database');  
const userdb = require('./models/user');      
const expensedb=require('./models/expense');
const orderdb=require('./models/orderpremium');
//establishing connection between tables
expensedb.belongsTo(userdb, {
    foreignKey: {
        allowNull: false // Ensures that every expense must be linked to a user
    },
    onDelete: 'CASCADE' // Optional: Ensures expenses are deleted if the associated user is deleted
});

userdb.hasMany(expensedb, {
    foreignKey: 'userId'
});

userdb.hasMany(orderdb);
orderdb.belongsTo(userdb);


// Sync models and start the server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch(err => {
        console.log("Error during DB sync:", err);
    });


