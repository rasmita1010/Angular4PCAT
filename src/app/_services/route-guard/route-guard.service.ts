import { Injectable } from '@angular/core';
import { CanActivate, Router, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Constants, Roles } from '../../_models/index';
import { AdminSetupComponent } from '../../admin-setup/admin-setup.component';

@Injectable()
export class RouteGuardService implements CanActivate {

    constants = Constants;
    constructor(private _router: Router) { }

    canActivate() {

        const token = sessionStorage.getItem(this.constants.TOKEN);

        if (token !== null) {
            return true;
        } else {
            this._router.navigate(['./login']);
            return false;
        }
    }
}

@Injectable()
export class LoginGuardService implements CanActivate {

    constants = Constants;
    constructor(private _router: Router) { }

    canActivate() {

        const token = sessionStorage.getItem(this.constants.TOKEN);

        if (token !== null) {
            this._router.navigate(['./dashboard']);
            return false;
        } else {
            return true;
        }
    }
}

@Injectable()
export class AdminGuardService implements CanActivate {

    constants = Constants;
    constructor(private _router: Router) { }

    canActivate() {

        const userRoles = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).roles;

        if (userRoles.indexOf(Roles.Admin) > -1) {
            return true;
        } else {
            this._router.navigate(['./dashboard']);
            return false;
        }
    }
}

@Injectable()
export class ReadOnlyGuardService implements CanActivate {

    constants = Constants;
    constructor(private _router: Router) { }

    canActivate() {

        const userRoles = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).roles;

        if (userRoles.indexOf(Roles.ReadOnly) > -1 && userRoles.length === 1) {
            this._router.navigate(['./dashboard/questions']);
            return false;
        } else {
            return true;
        }
    }
}

@Injectable()
export class AdminTMMGuardService implements CanActivate {

    constants = Constants;
    constructor(private _router: Router) { }

    canActivate() {

        const userRoles = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).roles;

        if (userRoles.indexOf(Roles.Admin) > -1 || userRoles.indexOf(Roles.Marketers) > -1) {
            return true;
        } else {
            this._router.navigate(['./dashboard']);
            return false;
        }
    }
}

@Injectable()
export class AdminChangesGuardService implements CanDeactivate<AdminSetupComponent> {

    constructor() { }

    canDeactivate(
        component: AdminSetupComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> | boolean {
        return component.canDeactivate();
    }

}
