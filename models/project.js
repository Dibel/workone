/**
 * Created by Dibel on 2014/6/1.
 */
function Project(project) {
    this.name=project.name;
    this.des=project.des;
    this.owner=project.owner;
    this.ownername=project.ownername;
    this.startday=project.startday;
    this.endday=project.endday;
    this.teamname=project.teamname;
    this.teamid=project.teamid;
    this.projectid=project.projectid;
    this.remainday=project.remainday;
}
module.exports = Project;