/*
 ever3stmomo -  5/1/2018
 games.js  - handles all match related functions
 */

const util = require('./utils');
const log = util.Log;
const config = util.Config;
const database = util.Database;

var TFGames = {
    fetchNextMatch : function(req,res){
        database.Game.findAll()
        .then(function(tmp){
            console.log(tmp);
            
            res.status(200).end();
            return;
        })
    }
}

module.exports = TFGames;