const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Question, { foreignKey: 'userId' });
      this.hasMany(models.Offer, { foreignKey: 'expertId' });
      this.hasMany(models.Rating, { foreignKey: 'userId' });
      this.hasMany(models.Comment, { foreignKey: 'user_from', as: 'sender' });
      this.hasMany(models.Comment, { foreignKey: 'user_to', as: 'receiver' });
      this.hasMany(models.Signal, { foreignKey: 'fromId' });
      this.hasMany(models.Signal, { foreignKey: 'toId' });
      this.hasMany(models.ChatMessage, { foreignKey: 'toId' });
      this.hasMany(models.ChatMessage, { foreignKey: 'fromId' });
      this.hasMany(models.Transaction, { foreignKey: 'expertId' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    userpic: DataTypes.STRING,
    cash: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
