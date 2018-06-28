import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable, Subscription } from 'rxjs/Rx';
import { SharedService, CommonService } from '../_services/index';
import { Constants, UpdateAprovalRequest } from '../_models/index';

@Component({
    selector: 'app-admin-setup',
    templateUrl: './admin-setup.component.html',
    styleUrls: ['./admin-setup.component.css'],

})
export class AdminSetupComponent implements OnInit {

    // Declarations
    checked: boolean[];
    checkAllFlag = false;
    userList: any = [];
    checkedList: any = [];
    freeUserSearch = '';
    userDetails: any;
    resources: any;
    authorizedmagazines: any;
    constants = Constants;
    isMagSelected = false;
    selectedMagazine: string;
    loadedMagazine: string;
    AllAuthorizedUsers = [];
    AvailableUsers = [];
    AssociatedUsers = [];
    modalMessage = '';
    newEmail = '';
    isDirty = false;
    showError = false;

    @ViewChild('modalSaveSuccess')
    modalSaveSuccess: BsModalComponent;
    @ViewChild('modelSave')
    modelSave: BsModalComponent;
    @ViewChild('modalIsDirty')
    modalIsDirty: BsModalComponent;
    @ViewChild('modalError')
    modalError: BsModalComponent;
    @ViewChild('progressBar')
    progressBar: BsModalComponent;

    constructor(private _sharedSVC: SharedService, private _commonSvc: CommonService) {
        this.checked = [];
        this._sharedSVC.setActiveTab(this.constants.PCA_SETUP);
    }

    ngOnInit() {
        this.AvailableUsers = [];
        for (let index = 0; index < this.AvailableUsers.length; index++) {
            this.checked[index] = false;
        }
        this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
        this.resources = this.userDetails.resources;
        this.authorizedmagazines = this.resources.map(r => r.ResourceName);
        this.selectedMagazine = null;
        this.loadedMagazine = null;
    }

    loadMagazineDetails(event, value) {
        if (this.isDirty) {
            const subscriptionOnClose: Subscription = this.modalIsDirty.onClose.subscribe(() => {
                subscriptionOnClose.unsubscribe();
                subscriptionOnDismiss.unsubscribe();
                this.loadUsers();
            });
            const subscriptionOnDismiss: Subscription = this.modalIsDirty.onDismiss.subscribe(() => {
                subscriptionOnClose.unsubscribe();
                subscriptionOnDismiss.unsubscribe();
                this.selectedMagazine = this.loadedMagazine;
            });
            this.modalIsDirty.open();
        } else {
            this.loadUsers();
        }
    }

    loadUsers() {
        this.progressBar.open();
            this._commonSvc.getauthorizedUsers(this.selectedMagazine).subscribe(result => {
                this.AllAuthorizedUsers = result.AllAuthorizedUsers.map(function (email) { return email.toLowerCase() });
                this.AvailableUsers = result.AvailableUsers.map(function (email) { return email.toLowerCase() });
                this.AssociatedUsers = result.AssociatedUsers.map(function (email) { return email.toLowerCase() });
                this.isMagSelected = true;
                this.loadedMagazine = this.selectedMagazine;
                this.isDirty = false;
                this.progressBar.close();
            }, error => {
                setTimeout(() => { this.progressBar.close();}, 1000);
            });
    }

    onSelectUser = (e, user, idx) => {
        this.checked[idx] = e.target.checked;
        if (e.target.checked) {
            this.checkedList.push(user);
        } else {
            const index = this.checkedList.indexOf(user);
            if (index > -1) {
                this.checkedList.splice(index, 1);
            }
        }
    }

    droppedUsers = (event) => {
        if (event.dragData != null) {
            event.dragData.forEach((item) => {
                const index = this.AssociatedUsers.indexOf(item);
                if (index === -1) {
                    this.AssociatedUsers.push(item);
                }
                const availbleIdx = this.AvailableUsers.indexOf(item);
                if (availbleIdx !== -1) {
                    this.AvailableUsers.splice(availbleIdx, 1);
                }

            });
        }
        this.checked = [];
        this.checkedList = [];
        for (let index = 0; index < this.AvailableUsers.length; index++) {
            this.checked.push(false);
        }
        this.isDirty = true;
    }

    removeSelectedUser = (index) => {
        const removedUser = this.AssociatedUsers[index];
        this.AssociatedUsers.splice(index, 1);
        let idx = this.AllAuthorizedUsers.indexOf(removedUser);
        if (idx !== -1) {
            idx = this.AvailableUsers.indexOf(removedUser);
            if (idx === -1) {
                this.AvailableUsers.push(removedUser);
            }
        }
        this.isDirty = true;
    }

    addUserToAssociatedUsers() {
        if (this.validateEmail() && this.newEmail !== '' && this.newEmail !== null) {
            const idx = this.AssociatedUsers.indexOf(this.newEmail);
            if (idx === -1) {
                this.AssociatedUsers.push(this.newEmail);
                const availbleIdx = this.AvailableUsers.indexOf(this.newEmail);
                if (availbleIdx !== -1) {
                    this.AvailableUsers.splice(availbleIdx, 1);
                }
                this.isDirty = true;
                this.newEmail = '';
            } else {
                this.modalMessage = 'This email address already exists';
                this.modalError.open();
                setTimeout(() => {
                    this.modalError.close();
                }, 3000);
            }
        }
    }

    validateEmail() {
        const EMAIL_REGEXP = /[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

        if (this.newEmail === '' || this.newEmail === null || EMAIL_REGEXP.test(this.newEmail)) {
            return true;
        } else {
            return false;
        }
    }

    updateApprovalList() {
        this.modelSave.close();
        this.progressBar.open();
        const updateApprovalReq = new UpdateAprovalRequest(this.AssociatedUsers.join(';'), this.selectedMagazine);

        this._commonSvc.updateApprovalList(updateApprovalReq).subscribe(res => {
            this.modalMessage = this.constants.RESULT_SAVE + this.resources.find(resource => resource.ResourceName === this.selectedMagazine).Description;
            setTimeout(() => { this.progressBar.close(); this.modalSaveSuccess.open();}, 1000);
            this.isDirty = false;
            
            setTimeout(() => {
                this.modalSaveSuccess.close();
            }, 3000);
        }, error => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
        });
    }

    public canDeactivate(): Promise<boolean> | boolean {
        return new Promise<boolean>((resolve, reject) => {
            if (this.isDirty) {
                const subscriptionOnClose: Subscription = this.modalIsDirty.onClose.subscribe(() => {
                    subscriptionOnClose.unsubscribe();
                    subscriptionOnDismiss.unsubscribe();
                    resolve(true);
                });
                const subscriptionOnDismiss: Subscription = this.modalIsDirty.onDismiss.subscribe(() => {
                    subscriptionOnClose.unsubscribe();
                    subscriptionOnDismiss.unsubscribe();
                    resolve(false);
                });
                this.modalIsDirty.open();

            } else {
                resolve(true);
            }
        });
    }
}

