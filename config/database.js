const Sequelize = require('sequelize');

module.exports = new Sequelize('rejic','root','',{
    host:'localhost',
    dialect:'mysql',
    operatorAliases:0,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
});