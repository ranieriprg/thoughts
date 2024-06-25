const DataTypes =  require('sequelize')
const db = require("../db/conn");

//importar o user
const User = require('./User')

const Toughts = db.define("Toughts", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

Toughts.belongsTo(User);
User.hasMany(Toughts);

module.exports = Toughts;
