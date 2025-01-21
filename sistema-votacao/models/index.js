const { Sequelize } = require('sequelize');
require('dotenv').config(); // Para carregar variáveis do .env

// Configuração do Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Desativa logs de SQL no console
});

// Testar conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => console.log('Conexão com o banco de dados bem-sucedida!'))
  .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

// Exporta a instância do Sequelize
module.exports = sequelize;
