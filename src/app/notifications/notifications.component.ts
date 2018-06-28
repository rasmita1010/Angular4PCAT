import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { CommonService, AnswerService } from '../_services/index';
import { Constants, DemoCode, Roles, Status, NotificationRequest, ApproveReturnRequest, UnAuthMagazines } from '../_models/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DataTableModule, DataTable } from 'angular2-datatable';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, AfterViewInit {

  // Declarations
  constants = Constants;
  data: any = [];
  checked: boolean[];
  headerChecked = false;
  isApprover = false;
  isAdmin = false;
  userDetails: any;
  userRoles: any;
  hasAllRecords = true;
  magazineList = [];
  unAuthMags: UnAuthMagazines[];
  pendingNotifications = [];
  returnedNotifications = [];
  selectedMagazine = '';
  selectedItems = [];
  selectedIndex: number;
  selectedGroupIds: number[];
  isEnabled = false;
  isApprove = false;
  showPending = true;
  showCommentMessage = false;
  approvalNotes = '';
  businessMessage = '';
  todayDate = new Date();
  rowsOnPage = this.constants.QT_SUMMARY_ROWSPERPAGE;

  @ViewChild('commentsModal')
  commentsModal: BsModalComponent;
  @ViewChild('successModal')
  successModal: BsModalComponent;
  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;
  @ViewChild('modelIsApproveReturn')
  modelIsApproveReturn: BsModalComponent;
  @ViewChild('modelComments')
  modelComments: BsModalComponent;
  @ViewChild('modelUnAuthMagazines')
  modelUnAuthMagazines: BsModalComponent;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  // private unsubscribe: Subject<void> = new Subject<void>();
  constructor(private _router: Router, private _commonSvc: CommonService, private _answerSvc: AnswerService) {
  }

  ngAfterViewInit() {
    this.progressBar.open();
  }

  ngOnInit() {
    this.rowsOnPage = JSON.parse(localStorage.getItem(this.constants.LS_USER_PAGINATION_DEMO_SUMMARY));
    this.rowsOnPage = this.rowsOnPage !== null ? this.rowsOnPage : this.constants.QT_SUMMARY_ROWSPERPAGE;
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.magazineList = this.userDetails.resources;
    this.userRoles = this.userDetails.roles;
    this.isApprover = (this.userRoles.indexOf(Roles.TCS) > -1 || this.userRoles.indexOf(Roles.Admin) > -1) ? true : false;
    this.isAdmin = this.userRoles.indexOf(Roles.Admin) > -1 ? true : false;
    if (this.userRoles.length == 1 && this.userRoles.indexOf(Roles.Marketers) > -1) {
      this.hasAllRecords = false;
    }
    this.checked = [];
    const notifRequest = new NotificationRequest(this.userDetails.username, this.userDetails.resources.map(r => r.ResourceName), this.hasAllRecords);
    this._commonSvc.GetNotifications(notifRequest).subscribe(notifications => {
      if (notifications !== null) {
        this.pendingNotifications = notifications.PendingNotifications;
        this.returnedNotifications = notifications.ReturnedNotifications;
        this.data = JSON.parse(JSON.stringify(this.pendingNotifications));
        for (let index = 0; index < this.data.length; index++) {
          this.checked.push(false);
        }
        this.progressBar.close();
      }
    }, error => {
      setTimeout(() => { this.progressBar.close(); }, 1000);
    });
  }

  // To bind pending notifications to data table
  loadPendingNotifications() {
    this.data = JSON.parse(JSON.stringify(this.pendingNotifications));
    this.showPending = true;
    this.checked = [];
    for (let index = 0; index < this.data.length; index++) {
      this.checked.push(false);
    }
    this.headerChecked = false;
    this.selectedItems = [];
    this.selectedIndex = -1;
    this.selectedGroupIds = [];
    this.magazineFilter(); // filter by magazine
  }

  // To bind returned notifications to data table
  loadReturnedNotifications() {
    this.data = JSON.parse(JSON.stringify(this.returnedNotifications));
    this.showPending = false;
    this.checked = [];
    for (let index = 0; index < this.data.length; index++) {
      this.checked.push(false);
    }
    this.headerChecked = false;
    this.selectedItems = [];
    this.selectedIndex = -1;
    this.selectedGroupIds = [];
    this.magazineFilter(); // filter by magazine
  }

  // On change of magazine in dropdown
  changeMagazine() {
    if (this.showPending) {
      this.loadPendingNotifications();
    } else {
      this.loadReturnedNotifications();
    }
  }

  // To filter data based on selected magazine
  magazineFilter() {
    if (this.selectedMagazine !== '') {
      for (let i = this.data.length - 1; i >= 0; i--) {
        if (this.data[i].MagazineAssociations.filter(component => component.Magazines.indexOf(this.selectedMagazine) > -1).length === 0) {
          this.data.splice(i, 1);
        }
      }
    }
  }

  // On change of header check box
  changeHeaderCheckbox(event) {
    this.headerChecked = !this.headerChecked;
    for (let index = 0; index < this.data.length; index++) {
      this.checked[index] = this.headerChecked;
    }

    this.selectedItems = [];
    if (this.headerChecked) {
      this.selectedItems = this.data.map((val) => { return val; });
    }
  }

  // On change on individual row check box
  changeCheckBox(index: number, row: any): void {
    this.headerChecked = false;
    this.checked[index] = !this.checked[index];
    if (this.checked[index]) {
      this.selectedItems.push(row);
    } else {
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (row.SubmittedGroupId === this.selectedItems[i].SubmittedGroupId) {
          this.selectedItems.splice(i, 1);
          break;
        }
      }
    }
  }

  // show selected demo offer history details
  showDetails(index: number): void {
    if (this.selectedIndex === index && this.isEnabled) {
      this.isEnabled = false;
    } else {
      this.selectedIndex = index;
      this.isEnabled = true;
    }

  }

  // Update comments in pending and returned objects
  updateComments(updatedComments: any) {
    this.data[this.selectedIndex].Comments = updatedComments;
    if (this.showPending) {
      const value = this.pendingNotifications.filter(item => item.SubmittedGroupId === this.data[this.selectedIndex].SubmittedGroupId);
      if (value.length > 0) {
        value[0].Comments = updatedComments;
      }
    } else {
      const value = this.returnedNotifications.filter(item => item.SubmittedGroupId === this.data[this.selectedIndex].SubmittedGroupId);
      if (value.length > 0) {
        value[0].Comments = updatedComments;
      }
    }
  }

  // Navigate to Demo Code View
  navigateToView(demoCode: string) {
    let filteredDemoOffer = '';
    sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(filteredDemoOffer));
    sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(demoCode));
    this._router.navigate(['./dashboard/questions/view']);
  }

  // Approve single Demo Offer
  approveItem(groupId) {
    this.isApprove = true;
    this.selectedGroupIds = [groupId];
    const unAuthMags = this.getAccessibility();
    if (unAuthMags.length > 0) {
      this.modelUnAuthMagazines.open();
    } else {
      this.modelIsApproveReturn.open();
    }
  }

  // Approve all selected demo offers
  approveAllItems() {
    this.isApprove = true;
    this.selectedGroupIds = [];
    this.selectedItems.forEach(item => {
      this.selectedGroupIds.push(item.SubmittedGroupId);
    });
    const unAuthMags = this.getAccessibility();
    if (unAuthMags.length > 0) {
      this.modelUnAuthMagazines.open();
    } else if (this.selectedGroupIds.length > 0) {
      this.modelIsApproveReturn.open();
    }
    else {
      this.businessMessage = this.constants.MSG_SELECT_APPROVE;
      this.modalValidate.open();
      setTimeout(() => {
        this.modalValidate.close();
      }, 2000);
    }
  }

  // To check the approver has access for the magazines in selected demo offers
  getAccessibility() {
    const userMagazines = this.magazineList.map(r => r.ResourceName);
    this.unAuthMags = [];
    for (let i = 0; i < this.selectedGroupIds.length; i++) {
      let dt = this.data.filter(r => r.SubmittedGroupId == this.selectedGroupIds[i]);
      if (dt.length > 0) {
        dt[0].MagazineAssociations.forEach(val => {
          let magazine = val.Magazines.filter(v => userMagazines.indexOf(v) == -1);
          if (magazine.length > 0) {
            let mags = new UnAuthMagazines(dt[0].DemoCode, magazine.join());
            this.unAuthMags.push(mags);
          }
        });
      }
    }
    return this.unAuthMags;
  }

  // Return single Demo Offer
  returnItem(groupId) {
    this.isApprove = false;
    this.selectedGroupIds = [groupId];
    this.modelIsApproveReturn.open();

  }

  // Return all selected demo offers
  returnAllItems() {
    this.isApprove = false;
    this.selectedGroupIds = [];
    this.selectedItems.forEach(item => {
      this.selectedGroupIds.push(item.SubmittedGroupId);
    });

    if (this.selectedGroupIds.length > 0) {
      this.modelIsApproveReturn.open();
    }
    else {
      this.businessMessage = 'Please select the Demo Offer(s) to return';
      this.modalValidate.open();
      setTimeout(() => {
        this.modalValidate.close();
      }, 2000);
    }
  }

  // To show comment box before user submit (approve/return)
  ShowComments() {
    this.modelIsApproveReturn.close();
    this.modelComments.open();
  }

  // On submit of approve and return 
  ApproveReturnChanges() {
    if (this.approvalNotes.trim() === '' && !this.isApprove) {
      this.showCommentMessage = true;
    }
    else {
      this.modelComments.close();
      const approveRequest = new ApproveReturnRequest(this.userDetails.username, this.approvalNotes, this.userDetails.DisplayName, this.selectedGroupIds, this.userDetails.EMailAddress);

      if (this.isApprove) {
        this.progressBar.open();
        this._answerSvc.approve(approveRequest).subscribe(response => {
          if (response.Status) {
            this.businessMessage = response.BusinessMessage;
            this.successModal.open();
            setTimeout(() => {
              this.successModal.close();
              this.approvalNotes = '';
            }, 2000);
            this.selectedGroupIds.forEach(id => {
              const existingNotifications = this.pendingNotifications.filter(item => item.SubmittedGroupId == id);
              if (existingNotifications.length > 0) {
                const idx = this.pendingNotifications.indexOf(existingNotifications[0], 0);
                if (idx > -1) {
                  this.pendingNotifications.splice(idx, 1);
                }
              }
            });
            this.loadPendingNotifications();
            this.progressBar.close();
          }
        }, error => {
          setTimeout(() => { this.progressBar.close(); }, 1000);
        });
      } else {
        this.progressBar.open();
        this._answerSvc.return(approveRequest).subscribe(response => {
          if (response.Response.Status) {
            this.businessMessage = response.Response.BusinessMessage;
            this.successModal.open();
            setTimeout(() => {
              this.successModal.close();
              this.approvalNotes = '';
            }, 2000);
            this.selectedGroupIds.forEach(id => {
              const existingNotifications = this.pendingNotifications.filter(item => item.SubmittedGroupId == id);
              if (existingNotifications.length > 0) {
                const idx = this.pendingNotifications.indexOf(existingNotifications[0], 0);
                if (idx > -1) {
                  this.returnedNotifications.push(existingNotifications[0]);
                  this.pendingNotifications.splice(idx, 1);

                  // update comments in returned notifications
                  response.ReturnComments.forEach(res => {
                    const notifyValue = this.returnedNotifications.filter(item => item.SubmittedGroupId == res.GroupId);
                    if (notifyValue.length > 0) {
                      notifyValue[0].Comments = res.Comments;
                    }
                  });
                }
              }
            });
            this.loadPendingNotifications();
            this.progressBar.close();
          }
        }, error => {
          setTimeout(() => { this.progressBar.close(); }, 1000);
        });
      }
    }
  }

  ngOnDestroy() {
  }

}
