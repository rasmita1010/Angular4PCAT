import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Constants, Roles } from '../_models/index';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared/shared.service';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'app-nav-tabs',
    templateUrl: './nav-tabs.component.html',
    styleUrls: ['./nav-tabs.component.css']
})
export class NavTabsComponent implements OnInit, OnDestroy {

    // Declarations
    constants = Constants;
    activeTab: string;
    role: string;
    isEnabled: boolean;
    @ViewChild('modelLogout')
    modelLogout: BsModalComponent;
    private unsubscribe: Subject<void> = new Subject<void>();


    constructor(private _router: Router, private _sharedSVC: SharedService) {

        // Subscriber for highlighting current tab selected
        this._sharedSVC.setActiveTab$.takeUntil(this.unsubscribe).subscribe(tabName => {
            this.activeTab = tabName;
        });
    }

    ngOnInit() {
        this.role = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).roles;
        if (this.role.indexOf(Roles.Admin) > -1) {
            this.isEnabled = true;
        }       
    }

    // Loads Question Summary
    loadQuestions(): void {
        this._router.navigate(['./dashboard/questions']);
    }

    // Loads Admin Tables
    loadAdminTables(): void {
        this._router.navigate(['./dashboard/digital']);
    }

    // Loads Schedules
    loadSchedules(): void {
        this._router.navigate(['./dashboard/schedule']);
    }

    // Loads Admin Setup
    loadSetup(): void {
        this._router.navigate(['./dashboard/setup']);
    }

    // Loads Home Page
    loadHome(): void {
        this._router.navigate(['./dashboard/home']);
    }

    // Logs user Out of the application
    logOut(): void {
      sessionStorage.removeItem('token');
        localStorage.clear();
        sessionStorage.clear();
        this._router.navigate(['./login']);
    }


    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
