const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Pillow extends Model {}

Pillow.init(
  {
    slug:          { type: DataTypes.STRING, allowNull: false, unique: true },
    name:          { type: DataTypes.STRING, allowNull: false },
    desc:          { type: DataTypes.TEXT, defaultValue: '', field: 'description' },
    img:           { type: DataTypes.TEXT, defaultValue: '' },
    imgPublicId:   { type: DataTypes.TEXT, defaultValue: '' },
    price:         { type: DataTypes.STRING, defaultValue: '' },
    sizes:         { type: DataTypes.JSONB, defaultValue: [] },
    featured:      { type: DataTypes.BOOLEAN, defaultValue: false },
    featuredOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    order:         { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  },
  {
    sequelize,
    modelName: 'Pillow',
    tableName: 'pillows',
    underscored: true,
  },
)

module.exports = Pillow
