'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Company.init({
    id: {
      type: DataTypes.TEXT,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    ceo: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    sector: DataTypes.STRING,
    score: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};