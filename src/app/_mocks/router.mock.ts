import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Rx';

export class MockRouterNoLogin {
    public ne = new NavigationEnd(0, 'http://localhost:8200/dashboard', 'http://localhost:8200/dashboard');
    public events = new Observable(observer => {
        observer.next(this.ne);
        observer.complete();
    });
}