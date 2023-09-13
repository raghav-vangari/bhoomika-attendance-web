import { Component, OnInit } from '@angular/core';
import { Batch } from 'src/app/model/batch';
import { Student } from 'src/app/model/student';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  studentsList: Student[] = [];
  batches: Batch[] = [];
  selectedBatch: number = 0;
  studentObj: Student = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    deposit: 2500,
    batchNumber: 0,
    balance: 2500
  };
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  mobile: string = '';
  batch: number = 0;
  batchId: number = 0;

  noOfStudents = 0;

  constructor(private auth: AuthService, private data: DataService) { }

  ngOnInit(): void {
    this.getBatchList();
    this.getAllStudents();
    this.noOfStudents = this.studentsList.length;
  }

  // register() {
  //   this.auth.logout();
  // }

  getBatchList() {
    this.data.getBatchList().subscribe(res => {
      console.log('batches--->',res)
      this.batches = res;
      localStorage.setItem('batches', JSON.stringify(this.batches));
    }, err => {
      alert('Error while fetching batches');
    })
  }

  getAllStudents() {
    this.data.getAllStudents().subscribe(res => {
      console.log(res)
      this.studentsList = res;
    }, err => {
      alert('Error while fetching student data');
    })
  }

  getAllStudentsByBatch() {
    this.data.getAllStudentsByBatch(this.selectedBatch).subscribe(res => {
      console.log(res)
      this.studentsList = res;
    }, err => {
      alert('Error while fetching student data by batch');
    })
  }

  resetForm() {
    this.id = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.mobile = '';
    this.batch = 0;
  }

  addStudent() {
    if (this.first_name == '' || this.mobile == '' || this.email == '' || this.batch < 1 || this.batchId < 1) {
      alert('Fill all input fields');
      return;
    }

    // this.studentObj.id = '';
    this.studentObj.email = this.email;
    this.studentObj.firstName = this.first_name;
    this.studentObj.lastName = this.last_name;
    this.studentObj.mobile = this.mobile;
    this.studentObj.batchNumber = this.batch;
    this.studentObj.id = this.batchId;

    this.data.addStudent(this.studentObj).subscribe(res => {
      console.log('Student added successfully!');
      this.getAllStudents();
      this.getBatchList();
    });
    this.resetForm();

  }

  updateStudent() {

  }

  deleteStudent(student: Student) {
    if (window.confirm('Are you sure you want to delete ' + student.firstName + ' ' + student.lastName + ' ?')) {
      this.data.deleteStudent(student);
    }
  }

}