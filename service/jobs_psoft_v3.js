/**
 * jobs_psoftv3.js - NodeJS script for jobs functionality for PredictSoft v3.00+
 * DOES NOT ACCEPT INCOMING REQUESTS, RUNS IN DAEMON MODE
 * Jobs handled:
 *  - scheduled match locks
 *  - scheduled database backups
 *  - (OPT)scheduled match activations
 * Created by G (ever3stmomo@gmail.com) on 4/8/2017.
 *
 */
var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var moment = require('moment');

var schedule = require('node-schedule');

const utils = require('./psoft_modules/utils');
const config = utils.Config;
config.init();                      //need to init config before loading log and DB handles


var log = utils.Log;
var database = utils.Database;

/*==========================Load config===================================*/

const psoft_config_parameters = require('./config/psoft_config.js');

const psoft_job_port = psoft_config_parameters.r00t_port;         //psoft_job_port that predictsoft r00t will run on
const lock_threshold = psoft_config_parameters.match_lock_threshold_in_minutes;        //look-ahead time in minutes
const tz_offset = psoft_config_parameters.server_timezone_offset || '+00:00';


var lock_time_table = [];

/*========================== SCHEDULER =====================================*/
//function to check and lock matches; runs three times, as according to WC 2018 times (1100 hrs and 1600 hrs EST/server times are in EST)
//also remember to change value for 'match_lock_threshold_in_minutes' in config file
var lockMatch1 = schedule.scheduleJob('Lock1','55 10 * * *',function(){      //1 hour prior to 10:30 am EST
    lockMatch(lock_threshold)
        .then(function () {
            var lock_done_msg = "*** Upcoming match has been locked successfully at 10:55 AM EDST by psoft scheduler.";
            log.info(lock_done_msg);
            /*getPredictionList()
                .then(function (pred_list) {
                    sendEmailWithPredictions(pred_list);
                    return;
                })*/
        })
        .error(function(err){
            log.info("Error trying to lock match by schedule at 9:30 AM EDST. Description: ",err);
            return;
        });
});

var lockMatch2 = schedule.scheduleJob('30 5 * * *',function(){     //15 min prior to 6:30 am EST
    lockMatch(lock_threshold)
        .then(function () {
            var lock_done_msg = "*** Upcoming match has been locked successfully at 5:30 AM EDST by psoft scheduler.";
            log.info(lock_done_msg);
            /*getPredictionList()
                .then(function (pred_list) {
                    sendEmailWithPredictions(pred_list);
                    return;
                })*/
        })
        .error(function(err){
            log.info("Error trying to lock match at 5:30 AM EDST. Description: ",err);
            return;
        });
});

var initLockTimes = function(){
    //read config file for hours where lock script needs to run, and start the scheduler(s)
    var config_hours = psoft_config_parameters.match_lock_times;
    if(!config_hours || !config_hours.length){
        log.error('Could not load config hours.Automatic scheduled lock will NOT run.');
        return;
    }
    config_hours.forEach(lockTime=>{
        lock_time_table.push(addLockSchedule(lockTime));
        log.info("Added new auto-lock schedule at",lockTime,"hrs to the schedule list.");
    });

    return Promise.all(lock_time_table)
        .then(lockSetupResponse =>{
            log.info('Lock time table has been initialized. Returned message: ',lockSetupResponse);
            return;
        })
        .catch(error=>{
            log.error(error);
        });
};


/* private methods */
var lockMatch = function(threshold){
    var SP_query = "CALL sp_lock_next_match(" + threshold + ",'" + config.psTZOffset + "');";
    log.info("Running stored procedure to lock matches within the next " + threshold + " minutes...");
    return database.query(SP_query)
    .then(()=> {
        log.info('psoft job was run by scheduler to lock the next upcoming game(s)')
    })
    .catch(err=>{
        console.error(err);
    });
};

var activateNextMatch = function(){
    log.info("Running automated stored procedure to activate next day's match(es)");
    var SP_activate_query = "CALL sp_activate_next_match();";
    return database.query(SP_activate_query);
};

var addLockSchedule = function(lockTime){
    return new Promise(function(resolve,reject){
        return schedule.scheduleJob('Lock-Active-Matches-Job @ '+lockTime,getScheduleTimeFormat(lockTime),function(){
            lockMatch(lock_threshold)
                .then(()=> {
                    var lock_done_msg = "*** Upcoming match has been locked successfully at " + lockTime + " EDST by psoft scheduler.";
                    log.info(lock_done_msg);
                    resolve(lock_done_msg);
                    return;
                })
                .catch(err => {
                    console.error(err);
                    reject("The lock scheduler encountered an error trying to lock match at " + lockTime + " hrs EDST. Description: ",err);
                    return;
                });
        })
    });
};

var getScheduleTimeFormat = function(hhmmTime){
    var timeArr = hhmmTime.split(':');
    var hour = timeArr[0].trim();
    var min = timeArr[1].trim();
    return min + " " + hour + " * * *";         //run everyday at these times
};



app.listen(psoft_job_port);
log.info("Predictsoft automated jobs service started on port: " + psoft_job_port);
log.info("===================================");
initLockTimes();
lockMatch1.name = "LockFirstMatch";
