/**
 * Created by Dibel on 2014/6/1.
 */
function Team(team) {
    this.name=team.name;
    this.des=team.des;
    this.owner=team.owner;
    this.startday=team.startday;
    this.teamid=team.teamid;
    this.projects=team.projects;
}
module.exports = Team;