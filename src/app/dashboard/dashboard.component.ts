import { Component, OnInit } from '@angular/core';
import { Constants } from '../_models/index';
import { CommonService } from '../_services/shared/common.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../_services/index';

let $ = null;
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    // Declarations
    constants = Constants;
    Metadata: any;
    public idleState: string = 'Not started.';
    public timedOut: boolean = false;
    public lastPing?: Date = null;
    logoutTimer: number;
    userDetails: any;
    private authServiceURL = environment.authServiceURL;

    constructor(private _commonSVC: CommonService, private idle: Idle, private authSvc: AuthService,private keepalive: Keepalive, private _router: Router) {
      $ = window["jQuery"];
      this.configUserIdle();
    }

    ngOnInit() {
        this.Metadata = this._commonSVC.GetAllMetadata().subscribe((data) => {
            if (data != null) {
                this.Metadata = data;
                localStorage.setItem(this.constants.LS_CHANNEL_METADATA, JSON.stringify(this.Metadata.Channel));
                localStorage.setItem(this.constants.LS_ANSWERTYPE_METADATA, JSON.stringify(this.Metadata.AnswerTypes));
                localStorage.setItem(this.constants.LS_STATUS_METADATA, JSON.stringify(this.Metadata.Status));        
                localStorage.setItem(this.constants.LS_PAGINATION_VALUE, JSON.stringify(this.Metadata.PaginationValue));  
            }
        });
    }
    configUserIdle() {

      // sets an idle timeout of 3600 seconds, for testing purposes.
      this.idle.setIdle(environment.UserIdleTime);

      // sets a timeout period of 60 seconds. after 60 seconds of inactivity, the user will be considered timed out.
      this.idle.setTimeout(15);

      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      //Close the warning popup
      this.idle.onIdleEnd.subscribe(() => {
        this.idleState = 'No longer idle.';
        $("#logoutWarningModal").modal("hide");
      });

      //Logout user session and redirect to login screen
      this.idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        $("#logoutWarningModal").modal("hide");
        localStorage.clear();
        sessionStorage.clear();
        this._router.navigate(['./login']);
      });

      //Through session timeout logout warning popup
      this.idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!';
        $('#logoutWarningModal').modal();
      });

      //Display session timeout counter on the warning popup
      this.idle.onTimeoutWarning.subscribe((countdown) => {
        this.idleState = 'You will time out in ' + countdown + ' seconds!';
        this.logoutTimer = countdown;
      });

      this.reset();
    }

    reset() {
      this.idle.watch();
      this.idleState = 'Started.';
      this.timedOut = false;
    }
}

