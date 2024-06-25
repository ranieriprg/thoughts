const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
    sequelize.authenticate()
    console.log(`sucesso ao conectar`);
} catch (error) {
    console.log('Erro ao conectar ao banco', error);
}

module.exports = sequelize;
