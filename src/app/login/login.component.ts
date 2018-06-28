import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { Constants } from '../_models/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    constructor(private _authSVC: AuthService, private _router: Router) { }

    // Declarations
    userName: string;
    password: string;
    alertMsg: string;
    notValid = false;
    showLoading = false;
    userDetails: any;
    constants = Constants;

    @ViewChild('progressBar')
    progressBar: BsModalComponent;

    ngOnInit() { }


    // Login Call
    login() {
        if (this.userName === '' && this.password === '') {
            this.notValid = true;
            this.alertMsg = this.constants.ALERT_PROVIDE_UNAME_PWD;
            return;
        } else if (this.userName === null || this.userName === '' || this.userName === undefined) {
            this.notValid = true;
            this.alertMsg = this.constants.ALERT_PROVIDE_UNAME;
            return;
        } else if (this.password === null || this.password === '' || this.password === undefined) {
            this.notValid = true;
            this.alertMsg = this.constants.ALERT_PROVIDE_PWD;
            return;
        } else {
            this.showLoading = true;
            this.progressBar.open();
            this._authSVC.login(this.userName, this.password)
                .subscribe(res => {
                    this.userDetails = res;
                    localStorage.setItem(this.constants.USER_DETAILS, JSON.stringify(this.userDetails));
                    setTimeout(() => {
                        this.progressBar.close();
                    }, 1000);
                    this._router.navigate(['./dashboard']);
                }, err => {
                    this.notValid = true;
                    const error = err.json();
                    if (error.StatusCode === 401) {
                        this.alertMsg = this.constants.ALERT_USER_PERMISSION;
                    } else {
                        this.alertMsg = this.constants.ALERT_INCORRECT_CREDENTIALS;
                    }
                    this.userName = '';
                    this.password = '';
                    setTimeout(() => {
                        this.progressBar.close();
                    }, 1000);
                });
        }

    }

    // Keyboard event to login
    enterLogin(event) {
        if (event.keyCode === 13) {
            this.login();
        }
    }
}
