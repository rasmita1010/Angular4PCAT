import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SharedService, QuestionService } from '../_services/index';
import { Constants } from '../_models/index';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

    // Declarations
    constants = Constants;
    pendingSortBy = this.constants.VS_PENDING_SORTBY;
    completedSortBy = this.constants.VS_COMPLETE_SORTBY;
    sortOrder = this.constants.VS_DEF_SORT_ORDER;
    freeTextSearch = '';
    pendingSchedules = [];
    earlierCompletedSchedules = [];
    thisWeekCompletedSchedules = [];
    todayCompletedSchedules = [];
    counterToday = 1;
    counterThisWeek = 1;
    counterEarlier = 1;
    loadToday = true;
    loadThisWeek = true;
    loadEarlier = true;
    showCompleted = false;
    paginationValue = '';

    @ViewChild('progressBar')
    progressBar: BsModalComponent;
    _istodayLoaded: boolean;
    _isthisWeekLoaded: boolean;
    _isearlierLoaded: boolean;

    constructor(private _sharedSVC: SharedService, private _questionSvc: QuestionService) {
        this._sharedSVC.setActiveTab(this.constants.PCA_SCHEDULE);
    }

    ngAfterViewInit() { this.progressBar.open(); }

    ngOnInit() {
        this.loadPendingSchedules();
    }

    // To load Pending schedules
    loadPendingSchedules() {
        if (this.pendingSchedules !== undefined || this.pendingSchedules !== null) {
            this._questionSvc.GetPendingSchedules().subscribe(result => {
                this.pendingSchedules = result;
                this.showCompleted = false;
                setTimeout(() => { this.progressBar.close(); }, 1000);
            }, error => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
            });
        }
    }

    // To load completed schedules
    loadCompletedSchedules() {
        this.progressBar.open();
        this.showCompleted = true;
        this.paginationValue = localStorage.getItem(this.constants.LS_PAGINATION_VALUE);
        this.resetCompletedSchedules();
        this.loadTodayCompletedSchedules();
        this.loadThisWeekCompletedSchedules();
        this.loadEarlierCompletedSchedules();
    }

    // To reset completed schedules related variables
    resetCompletedSchedules() {
        this.counterToday = 1;
        this.counterThisWeek = 1;
        this.counterEarlier = 1;
        this.loadToday = true;
        this.loadThisWeek = true;
        this.loadEarlier = true;
        this.todayCompletedSchedules = [];
        this.thisWeekCompletedSchedules = [];
        this.earlierCompletedSchedules = [];
    }

    // To load completed schedules of today
    loadTodayCompletedSchedules() {
        this._istodayLoaded = false;
        this._questionSvc.GetCompletedSchedules('Today', this.counterToday).subscribe(result => {
            if (result.length > 0) {
                if (this.todayCompletedSchedules.length < 1) {
                    this.todayCompletedSchedules = result;
                } else {
                    this.todayCompletedSchedules = this.todayCompletedSchedules.concat(result);
                }
                this.counterToday++;
                if (this.todayCompletedSchedules.length % 5 !== 0) {
                    this.loadToday = false;
                }
            } else {
                this.loadToday = false;
            }
            this._istodayLoaded = true;
            this.hideProgressBar();
        }, error => {
            this._istodayLoaded = true;
            this.hideProgressBar();
        });
    }

    // To load completed schedules of last week
    loadThisWeekCompletedSchedules() {
        this._isthisWeekLoaded = false;
        this._questionSvc.GetCompletedSchedules('This Week', this.counterThisWeek).subscribe(result => {
            if (result.length > 0) {
                if (this.thisWeekCompletedSchedules.length < 1) {
                    this.thisWeekCompletedSchedules = result;
                } else {
                    this.thisWeekCompletedSchedules = this.thisWeekCompletedSchedules.concat(result);
                }
                this.counterThisWeek++;
                if (this.thisWeekCompletedSchedules.length % 5 !== 0) {
                    this.loadThisWeek = false;
                }
            } else {
                this.loadThisWeek = false;
            }
            this._isthisWeekLoaded = true;
            this.hideProgressBar();
        }, error => {
            this._istodayLoaded = true;
            this.hideProgressBar();
        });
    }

    // To load completed schedules earlier than last week
    loadEarlierCompletedSchedules() {
        this._isearlierLoaded = false;
        this._questionSvc.GetCompletedSchedules('Earlier', this.counterEarlier).subscribe(result => {
            if (result.length > 0) {
                if (this.earlierCompletedSchedules.length < 1) {
                    this.earlierCompletedSchedules = result;
                } else {
                    this.earlierCompletedSchedules = this.earlierCompletedSchedules.concat(result);
                }
                this.counterEarlier++;
                if (this.earlierCompletedSchedules.length % 5 !== 0) {
                    this.loadEarlier = false;
                }
            } else {
                this.loadEarlier = false;
            }
            this._isearlierLoaded = true;
            this.hideProgressBar();
        }, error => {
            this._istodayLoaded = true;
            this.hideProgressBar();
        });
    }

    hideProgressBar() {
        if (this._isearlierLoaded && this._isthisWeekLoaded && this._istodayLoaded)
            setTimeout(() => { this.progressBar.close(); }, 1000);
    }
}
