import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalenderService } from '../../calendar/calender.service';
import { Router } from '@angular/router';
import { ReportsService } from '../../reports/reports.service';
import { EmployeeService } from '../employee.service';
import { response } from 'express';


interface Leave {
  leave_type: string;
  status: string;
  from_date: string;
  to_date: string;
}

@Component({
  selector: 'app-employee-leave-calendar',
  templateUrl: './employee-leave-calendar.component.html',
  styleUrls: ['./employee-leave-calendar.component.css']
})
export class EmployeeLeaveCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {};
  userId: any;
  selectedLeaveStatus: string = 'Leave Status';

  constructor(private employeeService: EmployeeService, private router: Router, private reportService: ReportsService) { }

  ngOnInit(): void {
    this.userId = this.reportService.getUserId();
    this.initializeCalendarOptions();
    this.loadLeavesByStatus('pending'); // Load pending leaves by default
  }

  setLeaveStatus(label: string, status: string) {
    this.selectedLeaveStatus = label;
    this.loadLeavesByStatus(status);
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
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

  loadLeavesByStatus(status: string): void {
    this.employeeService.getLeavesByStatusAndUserId(status, this.userId).subscribe((leaves: Leave[]) => {
      const events = leaves.map((response: Leave) => ({
        title: `Leave: ${response.leave_type} (${response.status})`,
        start: response.from_date,
        end: response.to_date,
      }));
      this.calendarOptions.events = events;
    });
  }

  handleDateClick(arg: { dateStr: string }): void {
    // Handle date click if needed
  }

  createReport(): void {
    this.router.navigate(['/leave-management/admin-dashboard/reports']);
  }

  navigateToLeaveCalendar(): void {
    this.router.navigate(['/leave-management/admin-dashboard/leave-calendar']);
  }
}
