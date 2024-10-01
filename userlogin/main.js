const express = require("express");
const path = require("path");
const app = express();
const cors=require("cors");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // For JSON payloads if needed
app.use(cors());
// Router Path
const router = require('./router/router_path');  // Ensure this file exists
app.use("/user", router);

// Sequelize Database
const sequelize = require('./util/database');  // Ensure database.js is set up correctly
const userdb = require('./models/user');       // Ensure the user model exists

// Sync models and start the server
userdb.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch(err => {
        console.log("Error during DB sync:", err);
    });


