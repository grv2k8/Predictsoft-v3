/*
 ever3stmomo - 5/1/2018
 authmodule.js  - handles API and user authentication related functionality
 */

const jwt = require('jwt-simple');
const jwtConfig = require('../config/jwtkey.js');

const util = require('./utils');
const log = util.Log;
const db = util.Database;
const config = util.Config;

var auth = {
    login: function(req, res) {

        var responseObject = {};
        console.log(req.body);
        if (util.isEmptyString(req.body.email) || util.isEmptyString(req.body.password)) {
            responseObject = {
                success : false,
                message : "Invalid  or missing credentials."
            }
            res.status(401).json(responseObject);
            res.end();
            return;
        }

        
        db.User.find({
            where: {
                email   : req.body.email,
                password: req.body.password
            }
        })
        .then(function (userResponseObject) {
                
                if (util.isEmptyObject(userResponseObject)) {
                    responseObject = {
                        success : false,
                        message : "User account not found. Please check email/password and try again."
                    }
                    res.status(401).json(responseObject);
                    res.end();
                    return;
                }
                
                //populate user data
                responseObject.success = true;
                responseObject.data = genToken(userResponseObject.dataValues);
                
                res.status(200).json(responseObject);
                res.end();
                return;
            })
        .catch(function (err) {
                //user find failed
                log.warn("Error trying to fetch user with email " + req.body.email + ". Details: " + err);
                responseObject = {
                    success : false,
                    message : "Could not find user account"
                }
                
                res.status(400).json(responseObject);
                res.end();
                return;
            });
        
    },
    /* validates /v1/* route access and returns user object if successful */
    validateAccess: function(user_email){
        return new Promise(function (resolve, reject) {
            
            db.User.find({
                where: {
                    email   : user_email
                }
            })
            .then(function(userObject)
            {
              resolve(userObject);
              return;  
            })
            .catch(function(error){
                reject(error);
                return;
            });
        });
    }
};

/* Generate a token that expires in 24 hours */
function genToken(userObject) {
    var expires = expiresIn(1); // 1 day
    console.log(">>>",userObject);
    var token = jwt.encode({
        email   : userObject.email,
        name    : userObject.name,
        points  : userObject.points,
        exp     : expires
    }, jwtConfig());

    return {
        token: token,
        expires: expires
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;