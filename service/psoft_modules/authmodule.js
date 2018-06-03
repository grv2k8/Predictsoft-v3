/*
 ever3stmomo - 5/1/2018
 authmodule.js  - handles API and user authentication related functionality
 */

const jwt = require('jwt-simple');
const jwtConfig = require('../config/jwtkey.js');

const util = require('./utils');
const log = util.Log;
const config = util.Config;

var auth = {
    login: function(req, res) {

        var userEmail = req.body.email || '';
        var userPassword = req.body.password || '';

        if (userEmail === '' || userPassword === '') {
            res.status(401)
                .json({"message": "Invalid credentials."});
            res.end();
            return;
        }

        var authResponseObject = {};

        Users.find({
            where: {
                email   : userEmail,
                password: userPassword
            }
        })
        .then(function (userObj) {
                
                if (util.isEmptyObject(userObj)) {
                    throw "User not found. Please check email/password and try again";
                }
                
                //populate user data
                authResponseObject.success = true;
                authResponseObject.data = {
                    ID:     userObj.userID,
                    email:  userObj.email,
                    name:   userObj.name,
                    token:  userObj.auth_key,
                    points: userObj.points
                };
                
                res.json(authResponseObject);
                res.end();
                return;
            })
        .catch(function (err) {
                //user find failed
                utils.logMe("Error trying to fetch user with email " + req.body.email + ". Details: " + err);
                resObj.success = false;
                resObj.message = err;
                
                res.json(resObj);
                res.end();
                return;
            });
        
    },
    /* validates /v1/* route access and returns user object if successful */
    validateAccess: function(user_token){
        var user = {};

        return new Promise(function (resolve, reject) {
            
            //TODO: validate token against DB

            user = {
                uId     : '123',
                admin   : (1 ==='1'),
                fullName: 'PK Girpade'
            };
            resolve(user);
            return;
        });
    }
};

/* Generate a token that expires in 24 hours */
function genToken(userAuthKey) {
    var expires = expiresIn(1); // 1 day
    var token = jwt.encode({
        key     : userObject.userAuthKey,
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