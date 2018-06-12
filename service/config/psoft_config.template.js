/**
 * (C)grjoshi 4/20/2018
 * psoft_config.js - handles application config options
 * First-run instructions: Rename this file to psoft_config.js in the /config folder
 //==================================================================================
 */

module.exports = {
	app_port: 8990,
	app_name: 'Predictsoft',
    app_version: '3.0.0',
    app_description: '',
    app_environment: 'Dev',
    //admin config ahead
    r00t_port: 8999,
    allow_registration: true,                       //'true' to allow new user registration
    match_lock_threshold_in_minutes: 15,				//defines the number of minutes before the match time to lock
    //diagnostics etc
    run_mode: 'dev',                                    //dev or prod (dev by default)
    log_level: 'Verbose'                                                                 
};
