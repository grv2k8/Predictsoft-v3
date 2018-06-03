/*
ever3stmomo 3/30/2016
game.js - Models match table in database
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'game', 
    {
        matchID   : {type: DataTypes.INTEGER, primaryKey: true},
        team1ID   : DataTypes.INTEGER,
        team2ID   : DataTypes.INTEGER,
        isActive  : DataTypes.INTEGER,
        isHidden  : DataTypes.INTEGER,
        isLocked  : DataTypes.INTEGER,	  
        MatchDate : DataTypes.DATEONLY,
        winningTeamID: DataTypes.INTEGER
    });
}