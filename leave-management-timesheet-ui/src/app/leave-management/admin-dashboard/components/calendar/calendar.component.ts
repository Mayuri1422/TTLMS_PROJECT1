import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateModalComponent } from './date-modal/date-modal.component';
import { CalenderService } from './calender.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {};
  selectedLeaveStatus: string = 'Leave Status';



  setLeaveStatus(label: string, status: string) {
    this.selectedLeaveStatus = label;
    this.loadLeavesByStatus(status);
  }

  constructor(private calenderService: CalenderService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.initializeCalendarOptions();
    // this.loadHolidays();
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      height: 'auto',
      navLinks: true,
      events: [],
      dateClick: this.handleDateClick.bind(this),
      eventContent: (arg) => {
        return { html: `<div class="event-title">${arg.event.title}</div>` };
      }
    } as CalendarOptions;
  }

  // loadHolidays(): void {
  //   this.calenderService.getHolidays().subscribe(holidays => {
  //     const events = holidays.map(holiday => ({
  //       title: holiday.occasion,
  //       start: holiday.occasion_date
  //     }));
  //     this.calendarOptions.events = events;
  //   });
  // }

  loadLeavesByStatus(status: string): void {
    this.calenderService.getLeavesByStatus(status).subscribe(leaves => {
      const events = leaves.map(leave => ({
        title: `Leave: ${leave.leave_type} (${leave.status})`,
        start: leave.from_date,
        end: leave.to_date,
      }));
      this.calendarOptions.events = events;
    });
  }

  handleDateClick(arg: { dateStr: string }): void {
    const selectedDate = new Date(arg.dateStr); // Convert dateStr to Date object
    const modalRef = this.modalService.open(DateModalComponent);
    modalRef.componentInstance.selectedDate = selectedDate;
    modalRef.result.then((result) => {
      if (result) {
        // Handle result from modal if needed
        console.log('Modal closed with result:', result);
      }
    }, (reason) => {
      console.log('Dismissed', reason);
    });
  }


  createReport(): void {
    // this.reportsService.setUserData(this.employee.first_name + ' ' + this.employee.last_name, this.employee.id);
    this.router.navigate(['/leave-management/admin-dashboard/reports']);
  }

  navigateToLeaveCalendar(): void {
    // this.reportsService.setUserData(this.employee.first_name + ' ' + this.employee.last_name, this.employee.id);
    this.router.navigate(['/leave-management/admin-dashboard/leave-calendar']);
  }
}
