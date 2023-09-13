import { Injectable } from '@angular/core';
import { collection, doc, Firestore, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { addDoc, deleteDoc, updateDoc, onSnapshot } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Attendance } from '../model/attendance';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  attendanceUrl = 'http://localhost:8080/attendance/';
  bhoomikaServiceUrl = `${environment.bhoomikaService}`;
  constructor(private afs: Firestore, private http: HttpClient) { }

  addAttendance(attendanceList: Attendance[], batchNum: number) {
    
    // return this.http.post(this.attendanceUrl + 'batch/' + batchNum, attendanceList);
    return this.http.post(this.bhoomikaServiceUrl + 'attendance/batch/' + batchNum, attendanceList);
  }

  //get all attendance
  getAttendance(): Observable<Attendance[]> {
    let attendance = collection(this.afs, 'Attendance');
    return collectionData(attendance, {idField: 'id'}) as Observable<Attendance[]>
  }

  

  //delete student
  deleteAttendance(attendance: Attendance) {
    let attendanceRef = doc(this.afs, `Attendance/${attendance.id}`);
    return deleteDoc(attendanceRef);
  }

  //update student
  updateAttendance(attendance: Attendance, attendances: any) {
    // let attendanceRef = doc(this.afs, `Attendance/${attendance.id}`);
    // let attendanceRef = doc(this.afs, 'id', attendance.id);
    // return updateDoc(attendanceRef, attendances);
  }

  getCurrentAttendance(currentDate: string, batch: number):Observable<Attendance[]> {
    console.log('in getCurrentAttendance()')
    return this.http.get<Attendance[]>(this.bhoomikaServiceUrl + 'attendance/' + currentDate + '/batch/' + batch);
    // let q = query(collection(this.afs, 'Attendance'), where("attendanceDate", "==", "06/03/2023"))

    // onSnapshot(q, (snapshot) => {
    //   snapshot.docs.forEach((doc) => {
    //     console.log(doc.data())
    //   });
    // });
  }
}
