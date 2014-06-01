/**
 * Created by Dibel on 2014/6/1.
 */
function Task(task) {
    this.name=task.name;
    this.des=task.des;
    this.startday=task.startday;
    this.endday=task.endday;
    this.projectname=task.projectname;
    this.teamname=task.teamname;
    this.remainday=task.remainday;
    this.taskid=task.taskid;
    this.complete=task.complete;
}
module.exports = Task;