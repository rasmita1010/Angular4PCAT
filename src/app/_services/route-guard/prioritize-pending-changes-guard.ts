import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {PrioritizeDemosComponent } from '../../questions/prioritize-demos/prioritize-demos.component'

@Injectable()
export class PrioritizePendingChangesGuard implements CanDeactivate<PrioritizeDemosComponent> {

    constructor() { }

    canDeactivate(
        component: PrioritizeDemosComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> | boolean {
        return component.canDeactivate();
    }

}
