import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance-dates',
  templateUrl: './attendance-dates.component.html',
  styleUrls: ['./attendance-dates.component.css']
})
export class AttendanceDatesComponent {

  constructor(private router: Router) {

  }

  addAttendance() {
    this.router.navigateByUrl('/addAttendance')
  }
}
