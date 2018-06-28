import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

    constructor() { }

    // To Set Active Tab based on user selection
    private ActiveTab = new Subject<string>();
    setActiveTab$ = this.ActiveTab.asObservable();
    setActiveTab(tabName: string) {
        this.ActiveTab.next(tabName);
    }

    // To Clear filters - OverAll
    private CLRFilters = new Subject<boolean>();
    clearFilters$ = this.CLRFilters.asObservable();
    clearFilterValues(isClear: any) {
        this.CLRFilters.next(isClear);
    }

    // To Remove filters MultiChecks - filter update
    private RemvFilters = new Subject<any>();
    remvFilters$ = this.RemvFilters.asObservable();
    remvFilterValues(updatedFtrValues: any) {
        this.RemvFilters.next(updatedFtrValues);
    }

    // To Remove filters textboxes - filter update
    private RemvFiltersTXT = new Subject<string>();
    remvFiltersTxt$ = this.RemvFiltersTXT.asObservable();
    remvFilterValuesTxt(txtType: string) {
        this.RemvFiltersTXT.next(txtType);
    }


    // To Update filtered demoOffer from view-demo to user-view components
    public filteredDemoOffer = new Subject<any>();
    updateFilteredDemoOffer$ = this.filteredDemoOffer.asObservable();
    updateFilteredDemoOffer(demoOffer: string) {
        this.filteredDemoOffer.next(demoOffer);
    }

}
