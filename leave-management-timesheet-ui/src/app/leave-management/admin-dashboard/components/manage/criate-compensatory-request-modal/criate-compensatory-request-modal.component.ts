import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeaveType } from '../../../../employee-dashboard/components/apply-leave/leave.interfaces';

@Component({
  selector: 'app-criate-compensatory-request-modal',
  templateUrl: './criate-compensatory-request-modal.component.html',
  styleUrls: ['./criate-compensatory-request-modal.component.css']
})
export class CriateCompensatoryRequestModalComponent implements OnInit {
  @Input() users: any[] = [];
  @Input() leaveTypes: LeaveType[] = [];
  selectedUsers: number[] = [];
  leaveReason: string = '';
  leaveDate: string = '';
  leaveType: number | null = null;
  dayCount: number = 1;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {}

  ngOnInit(): void {}

  incrementDayCount() {
    this.dayCount++;
  }

  decrementDayCount() {
    if (this.dayCount > 1) {
      this.dayCount--;
    }
  }

  save() {
    const data = {
      leave_reason: this.leaveReason,
      leave_date: this.leaveDate,
      leave_type: this.leaveType,
      day_count: this.dayCount
    };

    this.submitCompensatoryLeave(data);
  }

  submitCompensatoryLeave(data: any) {
    this.selectedUsers.forEach((user_id: number) => {
      const payload = {
        ...data,
        user_id: user_id,
        compensatory_count: data.day_count
      };
      this.http.patch(`http://localhost:3001/user-leave-balance/${user_id}`, payload).subscribe(
        response => {
          console.log('Compensatory leave submitted successfully', response);
        },
        error => {
          console.error('Error submitting compensatory leave', error);
        }
      );
    });

    this.activeModal.close(data);
  }
}
