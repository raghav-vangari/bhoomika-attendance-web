import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Attendance } from 'src/app/model/attendance';
import { Batch } from 'src/app/model/batch';
import { Student } from 'src/app/model/student';
import { AttendanceDateService } from 'src/app/shared/attendance-date.service';
import { AttendanceService } from 'src/app/shared/attendance.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

  studentsList: Student[] = [];
  rowClicked: any;
  attendanceList: Attendance[] = [];
  tempAttendanceList: Attendance[] = [];
  date = new Date();
  batchList: Batch[] = [];
  selectedBatch = 0;

  date1 = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());


  constructor(private data: DataService, private attendanceService: AttendanceService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    console.log('in ngonint');
    // this.getAllStudents();
    let bacthes = localStorage.getItem('batches');
    if(bacthes) {
      this.batchList = JSON.parse(bacthes);
      this.getAllStudents();
    } else {
      this.getBatchList();
    }
  }

  getBatchList() {
    this.data.getBatchList().subscribe(res => {
      console.log('batches--->',res)
      this.batchList = res;
      localStorage.setItem('batches', JSON.stringify(this.batchList));
      this.getAllStudents();
    }, err => {
      alert('Error while fetching batches');
    })
  }

  updateDate(event: any) {
    console.log(event.value.toLocaleDateString())
    this.attendanceList.forEach(attendance => {
      attendance.attendanceDate = event.value.toLocaleDateString();
    })
  }

  getAllStudents() {
    this.data.getAllStudentsByBatch(this.selectedBatch).subscribe(res => {
      console.log(res)
      this.attendanceList = [];
      // let latest_date = String(this.datepipe.transform(this.date, 'yyyy-mm-dd'));
      var d = this.date.toLocaleDateString().split("/"); 
      // `y` : year
      var y = d.splice(-1)[0];
      // set `y` as item at index `0` of `d`
      d.splice(0, 0, y);
      // join items within `d` with dash character `"-"`
      var latest_date = d.join("-");
      console.log(latest_date);
      res.map(student => {
        return this.attendanceList.push({
          studentId: String(student.id),
          studentName: student?.firstName,
          attendanceDate: latest_date,
          status: 'Absent',
          attendingTime: '6:00 PM',
          submitted: false
        });
      });
      console.log(this.attendanceList)
      
      this.attendanceService.getCurrentAttendance(latest_date).subscribe(attendance => {
        console.log('attendance response')
        console.log(attendance)
        attendance.forEach(att => {
          this.attendanceList = this.attendanceList.map(attL => {
            if(att.studentId == attL.studentId) {
              return att;
            } else {
              return attL;
            }
          })
        });
        this.tempAttendanceList = this.attendanceList;
        console.log('after getting attendance list')
        console.log(this.attendanceList)
        // console.log(this.attendanceList[1].id)
      })
      this.studentsList = res;
    }, err => {
      alert('Error while fetching student data');
    })
  }

  changeTableRowColor(idx: any) { 
    console.log(this.attendanceList[idx])
    if(!this.attendanceList[idx].submitted) {
      this.attendanceList[idx].toSubmit = true;
      this.attendanceList[idx].toggle = !this.attendanceList[idx].toggle;
      let element = document.getElementById(idx);
      if(this.attendanceList[idx].toggle) {
        this.attendanceList[idx].status = 'Present';
        // document.getElementById(idx)?.style.backgroundColor = 'green';
        if(element != null) {
          element.style.backgroundColor = 'green';
        }
      } else {
        this.attendanceList[idx].status = 'Absent';
        if(element != null) {
          element.style.backgroundColor = 'red';
        }
      }
      // this.attendanceList[idx].submitted = true;
      console.log(this.attendanceList[idx])
    }
  }

  onTimeChange(event: any, idx: any) {
    console.log('in time change')
    console.log(this.attendanceList[idx]);
    this.attendanceList[idx].attendingTime = event.target.value;
    console.log(this.attendanceList[idx])
  }

  addAttendance() {
    let currDate = this.serializedDate.value;
    // this.attendanceDateService.addAttendanceDate({
    //   date: currDate?.substring(0, currDate.indexOf('T'))
    // });
    // console.log('getting dates');
    let submitAttendanceList: Attendance[] = [];
    this.attendanceList.forEach(attendance => {
      this.tempAttendanceList.forEach(tempAttendance => {
        if(attendance.id === undefined || attendance.id === null) {
          //attendance adding for the first time
          submitAttendanceList.push(attendance);
        } else if(tempAttendance.id === attendance.id && tempAttendance.attendingTime != attendance.attendingTime) {
          //if attendance is already added and if time is modified
          submitAttendanceList.push(attendance);
        }
      });
    });
    this.attendanceService.addAttendance(submitAttendanceList, this.selectedBatch).subscribe(res => {
      console.log('attendance added')
      console.log(res)
    });
    
    // console.log('getting all attendance list')
    // this.attendanceService.getAttendance().subscribe((res) => console.log(res));
  }

  onSelectedBatch(batch: string) {

  }

}
