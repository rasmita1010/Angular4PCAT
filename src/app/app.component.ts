import { Component } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { environment } from '../environments/environment';
import { AuthService } from './_services/index';
import { Constants } from './_models/index';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    public idleState: string = 'Not started.';
    public timedOut: boolean = false;
    public lastPing?: Date = null;
    private authServiceURL = environment.authServiceURL;
    userDetails: any;

    constructor(private idle: Idle, private keepalive: Keepalive, private authSvc: AuthService) {

        keepalive.interval(environment.keepAliveInterval);

        keepalive.onPing.subscribe(() => {
            this.userDetails = JSON.parse(localStorage.getItem(Constants.USER_DETAILS));
            this.lastPing = new Date();
            authSvc.authtoken(this.userDetails.username);
        });
    }
}
