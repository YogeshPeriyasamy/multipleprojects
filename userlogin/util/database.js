const Sequelize=require('sequelize')
const sequelize=new Sequelize('sequelizedatabase', 'root', 'Yogesh@1209',{
    dialect: 'mysql',
    host: 'localhost'
})
module.exports=sequelize;