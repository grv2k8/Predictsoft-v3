/**
 * (C)grjoshi 6/10/2018
 * query_list.js - defines queries that will be run for psoft
 //==============================================================================
 */

module.exports = {
    getMatchDetails: function(matchID){
        return "SELECT team1.ID as Team1ID, team1.Name as Team1Name, team1.FlagUrl as Team1LogoUrl, " +
                        "team2.ID as Team2ID,team2.Name as Team2Name, team2.FlagUrl as Team2LogoUrl, " +
                        "games.ID as MatchID, " +
                        "games.Points as MatchPoints, " +
                        "games.isLocked as IsLocked, " +
                        "games.matchDate as MatchDate " +
                        "FROM " +
                        "`games` LEFT JOIN (teams as team1, teams as team2) " +
                        "ON (team1.ID = games.Team1 AND team2.ID = games.Team2) " +
                        "WHERE games.ID=" + matchID;
    },
    getUpcomingMatchDetails: function(){
        return "SELECT T1.ID as Team1ID, T1.Name as Team1Name, T1.FlagUrl as Team1LogoUrl, " +
                    "T2.ID as Team2ID, T2.Name as Team2Name, T2.FlagUrl as Team2LogoUrl, " +
                    "G.points as GamePoints, G.gameType as GameType, G.isLocked as IsGameLocked, G.isHidden as IsGameHidden, G.matchDate as GameDate, G.matchTime as GameTime " +
                "FROM teams T1, teams T2, games G " +
                "WHERE G.Team1 = T1.ID and G.Team2 = T2.ID AND G.isActive = 1;"
    }

};
