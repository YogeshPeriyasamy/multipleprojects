
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const Sequelize=require("sequelize");
const sequelize=new Sequelize('sequelizedatabase','root','Yogesh@1209',{
    dialect:'mysql',
    host:'localhost',
   
})
const products=sequelize.define('appointments',{
  id : {
      type: Sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true 
  },
  name : {
      type: Sequelize.STRING,
      allowNull:false
  },
  ph_number:{
      type: Sequelize.STRING,
      allowNull:false
  },
  email:{
      type: Sequelize.STRING,
      allowNull:false
  },
})

// Route to receive data from the frontend
app.post('/appointment/booking', (req, res) => {
  const product=products;
  const { name,number,mail } = req.body;
  product.create({
    name:name,
    ph_number:number,
    email:mail
  }).then(()=>console.log("table added"))
  .catch((err)=>console.log(err))
  console.log(name,number,mail)
  const info={name,number,mail}
  res.json(info);
});

products.sync()
.then(()=>{
// Start server
app.listen(port, () => {
  console.log(`Server running on 3000`);
});

})
.catch(err=>console.log(err))
