import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Batch } from '../model/batch';
import { Student } from '../model/student';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  studentsUrl = 'http://localhost:8080/students';
  batchUrl = 'http://localhost:8080/batches';

  constructor(private http: HttpClient) { }

  addStudent(student: Student) {
    // student.id = doc(collection(this.afs, 'id')).id;
    // return addDoc(collection(this.afs, 'Students'), student);
    console.log(student)
    return this.http.post(this.studentsUrl, student);
  }

  //get all students
  getAllStudents(): Observable<Student[]> {
    // let students = collection(this.afs, 'Students');
    // return collectionData(students, {idField: 'id'}) as Observable<Student[]>
    return this.http.get<Student[]>(this.studentsUrl);
  }

  //get all students by Batch
  getAllStudentsByBatch(batch: number): Observable<Student[]> {
    // let students = collection(this.afs, 'Students');
    // return collectionData(students, {idField: 'id'}) as Observable<Student[]>
    return this.http.get<Student[]>(this.batchUrl + '/' + batch + '/students');
  }

  //delete student
  deleteStudent(student: Student) {
    // let stuRef = doc(this.afs, `Students/${student.id}`);
    return this.http.delete(this.studentsUrl + '/' + student.id);
  }

  //update student
  updateStudent(student: Student, students: any) {
    console.log(student)
    return this.http.put(this.studentsUrl, student);
  }

  getBatchList() {
    return this.http.get<Batch[]>(this.batchUrl);
  }
}
