import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../../../../components/services/master.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RejectReasonModalComponent } from './reject-reason-modal/reject-reason-modal.component';
import { UpdateLeaveTypeModalComponent } from './update-leave-type-modal/update-leave-type-modal.component';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  userId: number | null = null;
  userData: any;
  adminData: any;
  pendingLeaves: any[] = [];
  adminPendingLeave: any[] = [];
  showLeaves: boolean = false; // Show adminPendingLeave by default
  leaves: any[] = [];
  selectedLeave: any;
  constructor(
    private masterService: MasterService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.adminData = this.masterService.getAdminId();
    this.fetchPendingLeaves();
    this.fetchLeaves(); // Fetch both sets of data on component initialization
  }

  fetchPendingLeaves(): void {
    this.masterService.getPendingLeaves().subscribe((data: any[]) => {
      console.log("Data received from backend:", data);
      this.pendingLeaves = data.map(leave => ({ ...leave, selected: false }));
    }, error => {
      console.error('Error fetching pending leaves:', error);
    });

    this.masterService.getPAndingLeavesAdmin().subscribe((data: any[]) => {
      console.log("Admin data received from backend:", data);
      this.adminPendingLeave = data.map(leave => ({ ...leave, selected: false }));
    }, error => {
      console.error('Error fetching admin pending leaves:', error);
    });
  }

  toggleShowLeaves(): void {
    this.showLeaves = !this.showLeaves;
  }

  openRejectReasonModal(leaveId: number): void {
    const modalRef = this.modalService.open(RejectReasonModalComponent, { centered: true });
    modalRef.componentInstance.leaveId = leaveId;
    modalRef.result.then((result) => {
      if (result) {
        this.updateLeaveStatus(leaveId, 'rejected', result);
      }
    }, (reason) => {
      console.log(`Dismissed reason: ${reason}`);
    });
  }

  updateLeaveStatus(leaveId: number, status: string, rejectionReason?: string): void {
    if (status === 'rejected' && !rejectionReason) {
      console.error('Rejection reason is required for rejection.');
      return;
    }

    this.masterService.updateLeaveStatus(leaveId, status, rejectionReason).subscribe(() => {
      this.fetchPendingLeaves(); // Refresh the list after updating status
    }, error => {
      console.error('Error occurred while updating leave status:', error);
    });
  }

  approveLeave(leaveId: number): void {
    this.updateLeaveStatus(leaveId, 'approved');
  }

  rejectLeave(leaveId: number): void {
    this.openRejectReasonModal(leaveId);
  }

  approveSelected(): void {
    const selectedLeaveIds = this.getSelectedLeaves().map(leave => leave.id);
    if (selectedLeaveIds.length === 0) {
      console.warn('No leaves selected for approval.');
      return;
    }

    selectedLeaveIds.forEach(leaveId => {
      this.updateLeaveStatus(leaveId, 'approved');
    });
  }

  rejectSelected(): void {
    const selectedLeaveIds = this.getSelectedLeaves().map(leave => leave.id);
    if (selectedLeaveIds.length === 0) {
      console.warn('No leaves selected for rejection.');
      return;
    }

    selectedLeaveIds.forEach(leaveId => {
      this.openRejectReasonModal(leaveId);
    });
  }

  getSelectedLeaves(): any[] {
    return this.showLeaves ? this.pendingLeaves.filter(leave => leave.selected) : this.adminPendingLeave.filter(leave => leave.selected);
  }

  hasSelectedLeaves(): boolean {
    return this.getSelectedLeaves().length > 0;
  }









  fetchLeaves(): void {
    this.masterService.getAllComponyLeaveType().subscribe((data:any) => {
      this.leaves = data;
    });
  }

  selectLeave(leave: any): void {
    this.selectedLeave = leave;
  }

  openUpdateLeaveModal(): void {
    // const modalRef = this.modalService.open(UpdateLeaveTypeModalComponent);
    // modalRef.componentInstance.leave = leave;

    // modalRef.result.then((result) => {
    //   if (result) {
    //     this.updateLeave(leave.id, result);
    //   }
    // }, (reason) => {
    //   console.log(`Dismissed reason: ${reason}`);
    // });
  }

  updateLeave(id: number, updatedData: any): void {
    // this.masterService.updateLeave(id, updatedData).subscribe(() => {
    //   this.fetchLeaves();
    // });
  }
}
