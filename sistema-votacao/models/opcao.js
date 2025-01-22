const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Enquete = require('./enquete');

const Opcao = sequelize.define('Opcao', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  votos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'opcoes', // Definindo o nome correto da tabela
  timestamps: false, // Desabilita createdAt e updatedAt
});

// Relacionamento: uma opção pertence a uma enquete
Opcao.belongsTo(Enquete, { 
  as: 'Enquete', // Define o alias para o relacionamento
  foreignKey: 'enqueteId', 
  onDelete: 'CASCADE' 
});
// Relacionamento: uma enquete tem várias opções
Enquete.hasMany(Opcao, { 
  as: 'Opcoes', // Define o alias para o relacionamento
  foreignKey: 'enqueteId', 
  onDelete: 'CASCADE' 
});

module.exports = Opcao;
