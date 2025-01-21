const { DataTypes } = require('sequelize');
const sequelize = require('./index'); 

const Enquete = sequelize.define(
  'Enquete',
  {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desabilita createdAt e updatedAt
  }
);

module.exports = Enquete;
