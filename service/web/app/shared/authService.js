/*
 grjoshi 5/24/2016
 Authentication factory to hold user object
 */

angular.module("psoftUI").factory('authService', function ($http){
    var session_name = 'nofapp2_session';
    var usrObj = {
        ID      : '',
        email   : '',
        name    : '',
        token   : '',
        points  : 0
    };

    usrObj.login = function(email, passwordHash){
        var loginData = {
            email: email,
            password: passwordHash
        };

        return $http.post('/api/login', loginData);
    };

    usrObj.saveSession = function (psoftData){
        //save current user object and token in session storage
        delete psoftData.success;
        window.localStorage[session_name] = angular.toJson(psoftData);
    };

    usrObj.loadSession = function () {
        //check local storage for login, and return true if found
        if (window.localStorage[session_name]) {
            this.usrObj = angular.fromJson(window.localStorage[session_name]);
            return true;
        }
        else
            return false;
    };

    usrObj.isLoggedIn = function(){
        if(!this.usrObj){
            return false;
        }
        else{
            return true;
        }
    };

    usrObj.getName = function(){
        if(this.usrObj)
            return this.usrObj.name;
    };

    usrObj.getPoints = function(){
        if(this.usrObj)
            return this.usrObj.points;
    };

    usrObj.getToken = function () {
        if(!this.usrObj){
            return '';
        }
        else
            return this.usrObj.token;
    };

    usrObj.clearAuth = function(){
        this.usrObj = {
            userID: '',
            email: '',
            name: '',
            token: '',
            points: 0
        };
    };

    return usrObj;

});
