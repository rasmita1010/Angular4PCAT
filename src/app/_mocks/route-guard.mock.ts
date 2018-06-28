import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class RouteGuardMockService implements CanActivate {
    
    constructor() { }

    canActivate() {
        return true;
    }
}
