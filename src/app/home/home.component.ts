import { Component, OnInit } from '@angular/core';
import { SharedService } from '../_services/shared/shared.service';
import { Constants, Roles } from '../_models/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    // Declarations
    constants = Constants;
    userDetails: any;
    isTCSUser = false;
    userRoles: any;
    userName: string;

    constructor(private _sharedSVC: SharedService) {
        this._sharedSVC.setActiveTab(this.constants.PCA_HOME);
    }

    ngOnInit() {
        this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
        this.userName = this.userDetails.FirstName;
        this.userRoles = this.userDetails.roles;
        this.isTCSUser = (this.userRoles.indexOf(Roles.TCS) > -1 && this.userRoles.length == 1) ? true : false;
  }

}
