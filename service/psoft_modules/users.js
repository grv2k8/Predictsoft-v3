/*
 ever3stmomo - 5/1/2018
 users.js  - handles all user related functions
 */

const util = require('./utils');
const log = util.Log;
const config = util.Config;

var TFUsers = {
    /* Register a user (while registration period is open, defined in config file) */
    addUser: function(req,res){
        var responseObject = {};
        var reqEmail = (req.body && req.body.email) || 'N/A';
        
        if (!config.psIsRegistrationActive) {
            log.warn("Registration period has expired. Unable to register account for " + reqEmail);
            responseObject = {
                success : false,
                message : "Registration period has ended. New accounts will not be added!"
            }
            res.status(401).json(responseObject);
            res.end();
            return;
        }
        
        if(!req.body || !req.body.username || !req.body.password){
            responseObject = {
                success : false,
                message : "Please enter all required fields"
            }
            res.status(400).json(responseObject);
            res.end();
            return;
        }


        //TODO: START HEREEEEE

        /* //check if email ID already exists
        Users.find({
            where: {
                email: req.body.email,
            }
        }).then(function (usrObj) {
        }); */
    },
    
    /* Update user details */
    updateUser: function(req,res){

    },

    /* GET /review by :id */
    getUserDetails: function (req, res) {
        
    }
}

module.exports = TFUsers;