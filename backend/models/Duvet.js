const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Duvet extends Model {}

Duvet.init(
  {
    name:         { type: DataTypes.STRING, allowNull: false },
    desc:         { type: DataTypes.TEXT, defaultValue: '', field: 'description' },
    price:        { type: DataTypes.STRING, allowNull: false },
    img:          { type: DataTypes.TEXT, defaultValue: '' },
    imgPublicId:  { type: DataTypes.TEXT, defaultValue: '' },
    category:     {
      type: DataTypes.STRING,
      defaultValue: 'duvet',
      validate: { isIn: [['duvet', 'bedcover', 'pillowcase', 'other']] },
    },
    isFeatured:   { type: DataTypes.BOOLEAN, defaultValue: false },
    order:        { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  },
  {
    sequelize,
    modelName: 'Duvet',
    tableName: 'duvets',
    underscored: true,
  },
)

module.exports = Duvet
