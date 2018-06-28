import { Component, OnInit, ViewChild,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Rx';
import { CommonService, SharedService } from '../../_services/index';
import { Constants, Tuple, PrioritySchedule, ValidatePrioritizeRequest } from '../../_models/index';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
    selector: 'app-prioritize-demos',
    templateUrl: './prioritize-demos.component.html',
    styleUrls: ['./prioritize-demos.component.css']
})
export class PrioritizeDemosComponent implements OnInit {

    channelList: any = [];
    magazineList: any = [];
    offerChannelList: any = [];
    viewScheduledList: any = [];
    selectedMagazine = '';
    selectedChannelId = 0;
    publishDate = null;
    constants = Constants;
    modalMessage = '';
    warningMessage = '';
    isOrderChanged = false;
    isPrioritizeDateChanged = false;
    userDetails;
    isValidDate = true;
    isScheduled = false;
    navRouteResponse: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('modalValidate')
    modalValidate: BsModalComponent;
    @ViewChild('modalSaveSuccess')
    modalSaveSuccess: BsModalComponent;
    @ViewChild('modelIsExisting')
    modelIsExisting: BsModalComponent;
    @ViewChild('modelViewSchedules')
    modelViewSchedules: BsModalComponent;
    @ViewChild('progressBar')
    progressBar: BsModalComponent;
    @ViewChild('modelIsDirty')
    modelIsDirty: BsModalComponent;
    // Date Picker Configuration
    myDate = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
    selectedDate: any = { year: this.myDate.getFullYear(), month: this.myDate.getMonth() + 1, day: this.myDate.getDate() };
    prioritizeDate: any;
    myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy',
        showTodayBtn: false,
        minYear: 2000,
        maxYear: 3000
    };

    constructor(private _router: Router, private _commonService: CommonService, private _sharedSVC: SharedService) {
        this._sharedSVC.setActiveTab(this.constants.PCA_QUESTIONS);
    }

    ngOnInit() {
        this.prioritizeDate = this.selectedDate;
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
        this.magazineList = this.userDetails.resources;
        this._commonService.getChannelList()
            .subscribe(res => {
                this.channelList = res;
            });
    }

    validateDate(ev) {
        this.isValidDate = ev.valid;
        if (this.isValidDate) {
            this.prioritizeDate = ev.value;
            this.isPrioritizeDateChanged = true;
        } else {
            this.isValidDate = false;
        }
    }

    changeMagazine() {
        this.isOrderChanged = false;
        if (this.selectedChannelId > 0 && this.selectedMagazine !== '') {
            this._commonService.getPrioritizeDemoOffers(this.selectedMagazine, this.selectedChannelId)
                .subscribe(res => {
                    this.offerChannelList = res;
                    if (this.offerChannelList.length === 0) {
                        this.showValidationMessage(this.constants.MSG_NO_DEMO_OFFERS);
                    }
                });
        }
    }

    changeChannel() {
        this.isOrderChanged = false;
        if (this.selectedChannelId > 0 && this.selectedMagazine !== '') {
            this._commonService.getPrioritizeDemoOffers(this.selectedMagazine, this.selectedChannelId)
                .subscribe(res => {
                    this.offerChannelList = res;
                    if (this.offerChannelList.length === 0) {
                        this.showValidationMessage(this.constants.MSG_NO_DEMO_OFFERS);
                    }
                });
        }
    }

    PublishDemoOffers() {

        if (this.checkPrioritizeDate(this.prioritizeDate)) {
            return;
        } else {
            if (!this.isOrderChanged) {
                if (!this.isPrioritizeDateChanged) {
                    this.showValidationMessage(this.constants.MSG_NO_SORTING);
                    return;
                } else if (this.selectedChannelId === 0 || this.selectedMagazine === '') {
                    this.showValidationMessage('Please Select a Magazine Channel Combination');
                    return;
                }
            }
        }


        const magazine = this.magazineList.filter(value => value.ResourceName == this.selectedMagazine)[0];
        const channelName = this.channelList.filter(value => value.ChannelId == this.selectedChannelId)[0].ChannelName;

        const validateRequest = new ValidatePrioritizeRequest(this.selectedChannelId, this.selectedMagazine, channelName, magazine.Description);
        this.progressBar.open();
        this._commonService.checkPrioritizeAlreadyScheduled(validateRequest)
            .subscribe(res => {
                setTimeout(() => {
                    this.progressBar.close();
                });
                if (res.Status) {
                    const subscripOnClose: Subscription = this.modelIsExisting.onClose.subscribe(() => {
                        subscripOnClose.unsubscribe();
                        this.PublishDemoOffersService();
                    });
                    this.showWarningMessage(res.BusinessMessage);
                } else {
                    this.PublishDemoOffersService();
                }
            }, error => { this.progressBar.close; });
    }

    PublishDemoOffersService() {
        const demoOfferOrder: Tuple[] = [];

        for (let i = 0; i < this.offerChannelList.length; i++) {
            demoOfferOrder.push(new Tuple(this.offerChannelList[i].DemoOfferChannelId, i + 1));
        }
        // Change date format to JS date from mydatepicker date
        if (!this.isPrioritizeDateChanged && !this.isScheduled) {
            this.prioritizeDate =  this.changeDateFormats(this.prioritizeDate);
        }

        const magazine = this.magazineList.filter(value => value.ResourceName == this.selectedMagazine)[0];
        const priorityScheduleDetails = new PrioritySchedule(this.selectedChannelId, this.selectedMagazine, magazine.Description, this.prioritizeDate, this.publishDate, demoOfferOrder);
        this.progressBar.open();
        this._commonService.updatePrioritizeDemoOffers(priorityScheduleDetails)
            .subscribe(res => {
                setTimeout(() => {
                    this.progressBar.close();
                });
                this.modalSaveSuccess.open();
                this.modalMessage = res.BusinessMessage;
                setTimeout(() => {
                    this.modalSaveSuccess.close();
                }, 2000);
                this.isScheduled = true;
                this.isOrderChanged = false;
                this.isPrioritizeDateChanged = false;
            }, error => { this.progressBar.close(); });
    }

    viewAllSchedules() {
        this.modelViewSchedules.open();
        this._commonService.getPrioritizeScheduledOffers()
            .subscribe(res => {
                this.viewScheduledList = res;
            });
    }

    showValidationMessage(errMsg: string): void {
        this.modalValidate.open();
        this.modalMessage = errMsg;
        setTimeout(() => {
            this.modalValidate.close();
        }, 2000);
    }

    showWarningMessage(msg: string): void {
        this.modelIsExisting.open();
        this.warningMessage = msg;
    }

    dropSuccess() {
        this.isOrderChanged = true;
    }

    goToViewDemoCode(demoCode) {
        sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(demoCode));
        this._router.navigate(['/dashboard/questions/view']);
    }

    checkPrioritizeDate(date): boolean {
        let allowedDate = new Date();
        let currentDate;
        if (!this.isPrioritizeDateChanged && !this.isScheduled) {
            currentDate = this.changeDateFormats(this.prioritizeDate);
        }
        else {
            currentDate = new Date(this.prioritizeDate);
        }
        if (this.isValidDate) {
            if (allowedDate > currentDate) {
                this.modalValidate.open();
                allowedDate.setDate(allowedDate.getDate() + 1);
                this.modalMessage = 'Prioritization Date cannot be lesser than ' + allowedDate.toLocaleDateString('en-US');
                setTimeout(() => {
                    this.modalValidate.close();
                }, 2000);
                return true;
            } else {
                return false;
            }
        } else {
            this.showValidationMessage(this.constants.MSG_VALID_DATE);
            return true;
        }
    }

    changeDateFormats(dateToChange) {
        const changedDate = dateToChange.month + '/' + dateToChange.day + '/' + dateToChange.year;
        return changedDate;
    }

    goToSummary() {
        this._router.navigate(['/dashboard/questions']);
    }

    public canDeactivate(): Promise<boolean> | boolean {
        const isDirty = sessionStorage.getItem(this.constants.LS_ISALLOW);
        return new Promise<boolean>((resolve, reject) => {
            if (this.isOrderChanged === true) {
                const subscrip: Subscription = this.navRouteResponse.subscribe((val) => {
                    subscrip.unsubscribe();
                    resolve(val);
                });
                this.modelIsDirty.open();
            } else {
                resolve(true);
            }
        });
    }

    allowNavigation() {
        this.modelIsDirty.close();
        this.navRouteResponse.emit(true);
    }

    blockRouteNavigation() {
        this.modelIsDirty.close();
        this.navRouteResponse.emit(false);
    }
}
