import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ManageDemosComponent } from '../../questions/manage-demos/manage-demos.component';

@Injectable()
export class QuestionPendingChangesGuard implements CanDeactivate<ManageDemosComponent> {

    constructor() { }

    canDeactivate(
        component: ManageDemosComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> | boolean {
        return component.canDeactivate();
    }

}
