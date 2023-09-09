import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { AttendanceDate } from '../model/AttendanceDate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceDateService {

  constructor(private afs: Firestore) { }

  async addAttendanceDate(attendanceDate: AttendanceDate) {
    let q = query(collection(this.afs, 'AttendanceDates'), where("date", "==", attendanceDate.date));
    let dateExists = false;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      dateExists = true
    });
    if(!dateExists) {
      console.log('date adding')
      attendanceDate.id = doc(collection(this.afs, 'id')).id;
      addDoc(collection(this.afs, 'AttendanceDates'), attendanceDate);
    }
  }

  getAttendanceDates(): Observable<AttendanceDate[]> {
    let attendanceDates = collection(this.afs, 'AttendanceDates');
    return collectionData(attendanceDates, {idField: 'id'}) as Observable<AttendanceDate[]>
  }
}
