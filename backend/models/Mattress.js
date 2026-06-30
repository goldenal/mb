const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Mattress extends Model {}

Mattress.init(
  {
    name:         { type: DataTypes.STRING, allowNull: false },
    tag:          { type: DataTypes.STRING, allowNull: false },
    dotColor:     { type: DataTypes.STRING, defaultValue: '#9ec0df' },
    desc:         { type: DataTypes.TEXT, defaultValue: '', field: 'description' },
    price:        { type: DataTypes.STRING, allowNull: false },
    img:          { type: DataTypes.TEXT, defaultValue: '' },
    imgPublicId:  { type: DataTypes.TEXT, defaultValue: '' },
    order:        { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  },
  {
    sequelize,
    modelName: 'Mattress',
    tableName: 'mattresses',
    underscored: true,
  },
)

module.exports = Mattress
