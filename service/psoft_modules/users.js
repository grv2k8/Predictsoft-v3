/*
 ever3stmomo - 5/1/2018
 users.js  - handles all user related functions
 */

const util = require('./utils');
const log = util.Log;
const db = util.Database;
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
        
        if(!req.body || !req.body.name || !req.body.password || !req.body.email){
            responseObject = {
                success : false,
                message : "Please enter all required fields"
            }
            res.status(400).json(responseObject);
            res.end();
            return;
        }

        //check if email ID already exists
        util.Database.User.find({
            where: {
                email: req.body.email,
            }
        }).then(function (userExistsResponse) {
            if(!util.isEmptyObject(userExistsResponse))
            {
                responseObject = {
                    success : false,
                    message : "That email address has already been registered."
                };
                res.status(400).json(responseObject);
                res.end();
                return null;        //this return is for next then block
            }

            return db.User
            .build({
                name    : req.body.name,
                email   : req.body.email,
                password: req.body.password,
                auth_key: req.body.token,
                points  : 0
            })
            .save();
        })
        .then(function(registrationResponseObject){
            if(!util.isEmptyObject(registrationResponseObject)){
                log.info("New user account has been successfully added with email: ",req.body.email);    
                responseObject = {
                        success : true,
                        message : "Successfully registered account"
                    };
                res.status(200).json(responseObject);
                res.end();
                return;
            }
        })
        .catch(function(error){
            log.warn('Error trying to register user account with email ',req.body.email,'.Details:\r\n',error);
            res.status(400).json();
            res.end();
            return;
        })
    },
    
    /* Update user details */
    updateUser: function(req,res){

    },

    /* GET /review by :id */
    getUserDetails: function (req, res) {
        
    }
}

module.exports = TFUsers;