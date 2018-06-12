/*
 ever3stmomo -  5/1/2018
 games.js  - handles all match related functions
 */

const util = require('./utils');
const log = util.Log;
const config = util.Config;
const database = util.Database;
const queries = database.QueryList;

var TFGames = {
    //GET details about all upcoming matches
    fetchActiveMatches : function(req,res){
        var _response = {};
        _response.games = [];
        database.query(
            queries.getUpcomingMatchDetails(),
            database.DBConnection.QueryTypes.SELECT
        )
        .then(gamesResponseObject=>{
            res.status(200).json({
                success         : true,
                number_of_games : gamesResponseObject.length,
                match_date      : gamesResponseObject[0].GameDate,
                results         : gamesResponseObject
            });
            res.end();
            return;
        })
        /* .then(function(gamesList){
            console.log(gamesList);
            _response.games = gamesList.dataValues;
            _response.number_of_games = gamesList.length;
            res.status(200).json({
                success: true,
                number_of_games: gamesList.length,
                data: gamesList
            });
            res.end();
            return;
        }) */
        .catch(function(error){
            log.error('TFGames:fetchActiveMatches() - Cannot fetch upcoming games. Details: ',error);
            res.status(500).json({
                success: false,
                message: 'The request could not be completed. The mods will be notified.'
            });
            res.end();
            return;
        })
    },
    //GET all upcoming matches
    fetchActiveMatchesOLD : function(req,res){
        var _response = {};
        _response.games = [];
        database.Game.findAll({
            where: {
                isActive: 1
            }
        })
        .then(gamesResponseObject=>{
            res.status(200).json({
                success         : true,
                number_of_games : gamesResponseObject.length,
                results         : gamesResponseObject
            });
            res.end();
            return;
        })
        .catch(function(error){
            log.error('TFGames:fetchActiveMatches() - Cannot fetch upcoming games. Details: ',error);
            res.status(500).json({
                success: false,
                message: 'The request could not be completed. The mods will be notified.'
            });
            res.end();
            return;
        })
    },

    //GET details of one match
    fetchMatchDetails : function(req,res){
        database.query(
            queries.getMatchDetails(req.params.id),
            database.DBConnection.QueryTypes.SELECT
        )
        .then(gameDetails => {
            res.status(200).json({
                success     : true,
                data        : (gameDetails && gameDetails[0]) || {}
            });
            res.end();
            return;
        })
        .catch(error=>{
            log.error('TFGames:fetchMatchDetails() - Cannot fetch details for game ID ' + req.params.id + '. Details: ',error);
            res.status(500).json({
                success: false,
                message: 'The request could not be completed. The mods will be notified.'
            });
            res.end();
            return;
        });
        
        
    }
}

module.exports = TFGames;