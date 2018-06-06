/*
 ever3stmomo - 5/1/2018
 utils.js  - utility functions (with config object) for psoftv3
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
var Sequelize = require('sequelize');
const md5 = require('md5');
const moment = require('moment');

var Utils = module.exports = {
    Log: null,
    Database: {
        DBConnection: null,
        Game        : null,
        User        : null,
        Prediction  : null,
        User        :  null,
        loadModels  : function(dbconnect){
            this.Game =  dbconnect.import(__dirname + '/../models/game');
            this.User = dbconnect.import(__dirname + '/../models/user');
            this.Team = dbconnect.import(__dirname + '/../models/team');
            this.Prediction = dbconnect.import(__dirname + '/../models/prediction');
        },
        query: function(queryString,queryType){
            return this.DBConnection.query(queryString,{type: queryType});
        }
    },
    Config: {
        psAppName: '',
        psAppVersion: '',
        psAppPort: 0,
        psAppEnvironment: '',
        psLogDir: '',
        psLogMode: '',
        psIsRegistrationActive: false,
        psRunMode: '',
        /* init(): if this function fails, the application will quit with a message to the console */
        init: function () {
            //read and fill self from config files
            var psoftConfig = '';

            try {
                psoftConfig = require('../config/psoft_config');
                dbConfig = require('../config/dbconfig');
                //internal service stuff
                this.psAppName = psoftConfig.app_name || 'PSOFT_CONFIG_READ_ERROR';
                this.psAppVersion = psoftConfig.app_version || '???';
                this.psAppPort = psoftConfig.app_port || 8080;

                this.psIsRegistrationActive = psoftConfig.allow_registration || false;
                this.psRunMode = psoftConfig.run_mode || 'N/A';
                this.psLogLevel = psoftConfig.log_level || '';

                //setup log config
                this.psLogDir = psoftConfig.log_directory_name || 'psoftv3_logs';
                if (!fs.existsSync(this.psLogDir)) {
                    // Create the directory if it does not exist
                    fs.mkdirSync(this.psLogDir);
                };
                this.psLogMode = psoftConfig.log_level || '';           //quiet (production mode) by default
                Utils.Log = new (winston.Logger)({
                    transports: [
                        new (winston.transports.Console)({
                            'timestamp': function () { return moment().format('YYYY-MM-DD HH:mm:ss').trim(); },
                            'colorize': true
                        }),
                        new (winston.transports.File)({
                            filename: path.join(this.psLogDir, '/Log-psoft(' + this.psAppVersion + ').log'),
                            'timestamp': function () { return moment().format('YYYY-MM-DD HH:mm:ss').trim(); }
                        })
                    ]
                });

                //load Sequelize config and setup DB connection...
                var sequelizeInit = new Sequelize(
                    dbConfig.database,    //Predictsoft DB
                    dbConfig.user,
                    dbConfig.password,
                    {
                        host: dbConfig.host,
                        dialect: 'mysql',
                        logging: false,
                        define: {
                            //freezeTableName: true          //so table names won't be assumed pluralized by the ORM
                        },
                        pool: {
                            max: 50,
                            min: 0,
                            idle: 10000
                        }
                    }
                );
                //...then load DB models
                Utils.Database.loadModels(sequelizeInit);
                Utils.Log.info('Utils loaded...');
            }
            catch (e) {
                console.error('Error trying to parse one or more config file(s). Details: \r\n', e);
                process.exit(1);
            }
        },
        getAppSignature: function () {
            //returns app details in a signature similar to "Tablefest Service - Core v1.00"
            return this.psAppName + ' v' + this.psAppVersion + ' [Port ' + this.psAppPort + ']';
        },
        getUserCount: function(){
            return new Promise(function(resolve,reject){
                Utils.Database.User.count()
                .then(c => {
                    console.log(">>>",c);
                    resolve(c);
                })
                .catch(e => {
                    Utils.Log.error('Error trying to get number of users. Details: ',e);
                    reject(e);
                })                
            });
        }
    },    
    ping: function (req, res) {
        {
            res.status(200).json({
                status: 'Ping! psoftv3 (SERVICE: ' + Utils.Config.getAppSignature() + ') is up and running',
                requestedBy: (req.user) ? req.user.fullName + '(is_admin: ' + req.user.admin + ')' : 'N/A'     //to support both auth and non-auth pings
            });
            Utils.Log.info('Ping successful!');
            res.end();
            return;
        }
    },
    hashString: function (message) {
        return md5(message);
    },
    isEmptyObject: function (obj) {
        return (!obj || obj === undefined ||  Object.keys(obj).length === 0);
    },
    isEmptyString: function (str) {
        return (this.isEmptyObject(str) || str === '');
    },
    parseAuthToken(bearer_token) {
        var words = bearer_token.split(' ');
        return words[1];
    }
};
