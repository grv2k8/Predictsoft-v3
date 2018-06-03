/*
ever3stmomo 3/30/2016
team.js - Models team table in database
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'team', 
    {
      teamID: {type: DataTypes.INTEGER, primaryKey: true},
      Name:   {type: DataTypes.INTEGER, primaryKey: true}
    });
}