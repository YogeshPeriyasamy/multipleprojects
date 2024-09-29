const express = require("express");
const cors = require("cors");
const app = express();

//middlewares for the functionality
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//get the data from frontend
let tablename;
let Field_data = [];
app.post('/main/tablecreation', async (req, res, next) => {
    console.log("sequelize models: ", sequelize.models);
    const { tableName, fields } = req.body
    tablename = tableName;
    Field_data = [...fields];
    try {
        const table_definition = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        };
        //to define the database from fields
        Field_data.forEach(field => {
            table_definition[field.fieldName] = {
                type: Sequelize[field.fieldType],
                allowNull: false
            }
        })
        //to define the model
        let obj = {};
        let modelname = tablename;
        //freezeTableName: true its stop the database from pluralizing itsels like when we enter money its stored
        //as moneys it prvents that
        //timestamps : false stops default creation of createdat and updated at da
        obj[modelname] = sequelize.define(tablename, table_definition, { freezeTableName: true ,timestamps: false});

        console.log("sequelize models: ", sequelize.models);
       
        //sync the model with database
        await obj[modelname].sync()
            .then(() => {
                console.log("database created");
                res.json()
            })
            .catch(err => { console.log(err) })
    } catch (error) {
        console.log(error);
    }
})


//backend to get tablemames
app.get('/tables/fetch', async (req, res) => {
    console.log(" tables called");
    try { 
        const queryInterface = sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();
        if (tables.length === 0) {
            console.log("No tables found");
        }

        res.json(tables);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching tables' });
    }
});



// get the data from the table

app.get('/tabless/:tablename', async (req, res) => {
    const { tablename } = req.params;
    try {
        let table = tablename.toLowerCase();;
        console.log("tablename", table);
        // Get the model for the specified table
        const model = await sequelize.models[table];

        // Get the field names from the model
        const fieldNames = Object.keys(model.rawAttributes);
        const fetched_data = await sequelize.models[table].findAll();
        console.log("fetched :", fetched_data, fieldNames);
        res.json({fetched_data,fieldNames})
    } catch (err) {
        console.log(err);
    }
})


// insert a new record into database
app.post('/insert/newrecord',async(req,res)=>{
    const {newRecord,tablename}=req.body;
    console.log(" to insert new record",newRecord,tablename);
    try{
          const model=sequelize.models[tablename];
          const toinsert=await model.create(newRecord);
          res.json({data:toinsert});
    }catch(err){
        console.log(err);
    }
})



const Sequelize = require("sequelize");
const sequelize = new Sequelize('sequelizedatabase', 'root', 'Yogesh@1209', {
    dialect: 'mysql',
    host: 'localhost',

})
app.listen(3000, () => {
    console.log("server started");
});