const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Store extends Model {}

Store.init(
  {
    name:    { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    hours:   { type: DataTypes.STRING, allowNull: false },
    order:   { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  },
  {
    sequelize,
    modelName: 'Store',
    tableName: 'stores',
    underscored: true,
  },
)

module.exports = Store
