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
  addedAttendanceList: Attendance[] = [];
  toBeAddedAttendanceList: Attendance[] = [];
  tempAttendanceList: Attendance[] = [];
  date = new Date();
  batchList: Batch[] = [];
  selectedBatch = 0;
  currentDate = '';

  date1 = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());


  constructor(private data: DataService, private attendanceService: AttendanceService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    console.log('in ngonint');
    this.currentDate = this.date.toLocaleDateString().replaceAll('/', '-');
    // this.getAllStudents();
    let bacthes = localStorage.getItem('batches');
    if(bacthes) {
      this.batchList = JSON.parse(bacthes);
      // this.getAllStudents();
    } else {
      this.getBatchList();
    }
  }

  getBatchList() {
    this.data.getBatchList().subscribe(res => {
      console.log('batches--->',res)
      this.batchList = res;
      localStorage.setItem('batches', JSON.stringify(this.batchList));
      // this.getAllStudents();
    }, err => {
      alert('Error while fetching batches');
    })
  }

  updateDate(event: any) {
    console.log(event.value.toLocaleDateString())
    // this.currentDate = this.dateFormat(event.value.toLocaleDateString())
    this.currentDate = event.value.toLocaleDateString().replaceAll('/', '-');
    console.log(this.currentDate)
    this.getAllStudents();
    // this.attendanceList.forEach(attendance => {
    //   attendance.attendanceDate = this.currentDate;
    // })
  }

  dateFormat(date: string) {
    var d = date.split("/"); 
    // `y` : year
    var y = d.splice(-1)[0];
    // set `y` as item at index `0` of `d`
    d.splice(0, 0, y);
    // join items within `d` with dash character `"-"`
    return d.join("-");
  }

  getAllStudents() {
    this.addedAttendanceList = [];
    this.toBeAddedAttendanceList = [];
    this.attendanceList = [];
    this.tempAttendanceList = []
    this.data.getAllStudentsByBatch(this.selectedBatch).subscribe(res => {
      console.log(res)
      // this.attendanceList = [];
      console.log(this.date.toLocaleDateString())
      
      // this.currentDate = this.dateFormat(this.date.toLocaleDateString())
      // this.currentDate = this.date.toLocaleDateString().replaceAll('/', '-');
      console.log(this.currentDate);
      res.map(student => {
        return this.attendanceList.push({
          studentId: student?.id ? student?.id : 0,
          studentName: student?.firstName,
          attendanceDate: this.currentDate,
          status: 'Absent',
          attendingTime: '6:00 PM',
          submitted: false,
          batch: this.selectedBatch
        });
      });
      console.log(this.attendanceList)
      
      this.attendanceService.getCurrentAttendance(this.currentDate, this.selectedBatch).subscribe(attendance => {
        this.addedAttendanceList = [];
        this.toBeAddedAttendanceList = [];
        console.log('attendance response')
        console.log(attendance)
        attendance.forEach(att => {
          this.attendanceList = this.attendanceList.map(attL => {
            if(att.studentId == attL.studentId) {
              this.addedAttendanceList.push(att);
              return att;
            } else {
              // this.toBeAddedAttendanceList.push(attL);
              return attL;
            }
          })
        });
        
        this.tempAttendanceList = this.attendanceList;
        console.log('after getting attendance list')
        console.log(this.attendanceList)
        this.studentsList = res;
        this.attendanceList.forEach(att => {
          if(!att.submitted) {
            this.toBeAddedAttendanceList.push(att)
          }
        })
        // console.log(this.attendanceList[1].id)
      })
      
    }, err => {
      alert('Error while fetching student data');
    })
  }

  changeTableRowColor(idx: any) { 
    console.log(this.attendanceList[idx])
    // if(!this.attendanceList[idx].submitted) {
      this.toBeAddedAttendanceList[idx].toSubmit = true;
      this.toBeAddedAttendanceList[idx].toggle = !this.toBeAddedAttendanceList[idx].toggle;
      let element = document.getElementById(idx);
      if(this.toBeAddedAttendanceList[idx].toggle) {
        this.toBeAddedAttendanceList[idx].status = 'Present';
        // document.getElementById(idx)?.style.backgroundColor = 'green';
        if(element != null) {
          element.style.backgroundColor = 'green';
        }
      } else {
        this.toBeAddedAttendanceList[idx].status = 'Absent';
        if(element != null) {
          element.style.backgroundColor = 'red';
        }
      }
      // this.attendanceList[idx].submitted = true;
      console.log(this.toBeAddedAttendanceList[idx])
    // }
  }

  // changeTableRowColor(idx: any) { 
  //   console.log(this.attendanceList[idx])
  //   if(!this.attendanceList[idx].submitted) {
  //     this.attendanceList[idx].toSubmit = true;
  //     this.attendanceList[idx].toggle = !this.attendanceList[idx].toggle;
  //     let element = document.getElementById(idx);
  //     if(this.attendanceList[idx].toggle) {
  //       this.attendanceList[idx].status = 'Present';
  //       // document.getElementById(idx)?.style.backgroundColor = 'green';
  //       if(element != null) {
  //         element.style.backgroundColor = 'green';
  //       }
  //     } else {
  //       this.attendanceList[idx].status = 'Absent';
  //       if(element != null) {
  //         element.style.backgroundColor = 'red';
  //       }
  //     }
  //     // this.attendanceList[idx].submitted = true;
  //     console.log(this.attendanceList[idx])
  //   }
  // }

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
    // this.attendanceList.forEach(attendance => {
    //   this.tempAttendanceList.forEach(tempAttendance => {
    //     if(attendance.id === undefined || attendance.id === null) {
    //       //attendance adding for the first time
    //       submitAttendanceList.push(attendance);
    //     } else if(tempAttendance.id === attendance.id && tempAttendance.attendingTime != attendance.attendingTime) {
    //       //if attendance is already added and if time is modified
    //       submitAttendanceList.push(attendance);
    //     }
    //   });
    // });
    let notAddedAttendanceList: Attendance[] = [];
    this.toBeAddedAttendanceList.forEach(att => {
      if(att.toSubmit) {
        submitAttendanceList.push(att)
      } else {
        notAddedAttendanceList.push(att)
      }
    })
    this.attendanceService.addAttendance(submitAttendanceList, this.selectedBatch).subscribe(res => {
      this.addedAttendanceList = [...this.addedAttendanceList, ...submitAttendanceList];
      this.toBeAddedAttendanceList = notAddedAttendanceList;
      console.log('attendance added')
      console.log(res)
    });
    
    // console.log('getting all attendance list')
    // this.attendanceService.getAttendance().subscribe((res) => console.log(res));
  }

  onSelectedBatch(batch: string) {

  }

}
