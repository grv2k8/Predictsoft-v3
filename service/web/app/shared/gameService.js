/*
grjoshi 3/30/2016
     Service to handle all game-related API calls
*/

angular.module("psoftUI").service("gameService", function ($http) {


    var rem_predictions = 0;

    var predictionGrid = {
        enableColumnMenus: false,
        minRowsToShow: 17,
        columnDefs: [
            { field: 'href',
                displayName: 'Name',
                cellTemplate: '<div class="ngCellText"><a href="/src/index.html#/profile?id={{row.entity.uid}}">{{row.entity.Name}}</a></div>'
            },
            { field: 'Team',
                displayName: 'Predicted Team'
            }]
    };
    
    this.getRemainingPredictionCount = function(){
        return rem_predictions;
    };

    this.setRemainingPredictionCount = function(remP){
        rem_predictions = remP;
    };
    this.fillPredictionGrid = function(pred_data){
        predictionGrid.data = pred_data;
    };

    this.getPredictionGrid = function(){
        return predictionGrid;
    }

    this.getNextGame = function (auth_token) {
        return $http.get("/api/v1/games/active?access_token="+auth_token);
        
    };
    
    this.submitPrediction = function (auth_token, predObj) {
        
        var data = {
            //token: usr_token,               //user token
            predictionData : predObj                //array of predictions (if more than 1 game)
        };
        
        //console.log("SENDINGG..." + angular.toJson(data, true));
        return $http.post("/api/v1/games/predict?access_token="+auth_token, data);
    };
    
    this.showNextGamePredictions = function (auth_token) {
        return $http.get("/api/getPredictions?access_token="+auth_token);
    };
    
    this.getLeaderboardScores = function (auth_token) {
        return $http.get("/api/getLeaderboardScores?access_token="+auth_token);
    };
    
    this.getPredictionList = function (auth_token) {
        return $http.get("/api/getPredictions?access_token="+auth_token);
    };
    
    this.checkIfUserPredicted = function (auth_token) {
        return $http.get("/api/checkIfPredicted?access_token="+auth_token);
    };
});