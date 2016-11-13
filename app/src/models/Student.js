/**
 * Created by dummy on 11/10/16.
 */
export class Student {
  constructor (remoteJsonObject) {
    this.id = remoteJsonObject.studentId
    this.firstName = remoteJsonObject.firstName
    this.lastName = remoteJsonObject.lastName
    this.preferredName = remoteJsonObject.nickName
    this.rfid = remoteJsonObject.rfid
    if (remoteJsonObject.type === 1) {
      this.dorm = remoteJsonObject.dorm
    } else {
      this.dorm = 'Day'
    }
    this.grade = remoteJsonObject.grade
  }

  getDisplayName () {
    return this.lastName + ', ' + this.firstName + this.preferredName === this.firstName ? '' : ' (' + this.preferredName + ')'
  }
}
