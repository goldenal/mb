const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Bed extends Model {}

Bed.init(
  {
    name:         { type: DataTypes.STRING, allowNull: false },
    sub:          { type: DataTypes.STRING, allowNull: false },
    thickness:    { type: DataTypes.STRING, allowNull: false },
    feel:         { type: DataTypes.STRING, allowNull: false },
    price:        { type: DataTypes.STRING, allowNull: false },
    desc:         { type: DataTypes.TEXT, defaultValue: '', field: 'description' },
    img:          { type: DataTypes.TEXT, defaultValue: '' },
    imgPublicId:  { type: DataTypes.TEXT, defaultValue: '' },
    order:        { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  },
  {
    sequelize,
    modelName: 'Bed',
    tableName: 'beds',
    underscored: true,
  },
)

module.exports = Bed
