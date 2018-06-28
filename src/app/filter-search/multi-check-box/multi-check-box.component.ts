import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Constants, FilterParameter, CommonFilterModel } from '../../_models/index';
import { SharedService } from '../../_services/shared/shared.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-multi-check-box',
    templateUrl: './multi-check-box.component.html',
    styleUrls: ['./multi-check-box.component.css']
})
export class MultiCheckBoxComponent implements OnChanges, OnInit, OnDestroy {


    constants = Constants;

    selectAll = false;
    selectedText: string;

    @Input() filterColumn;
    @Input() ColumnName;
    @Output() updateFilterValues = new EventEmitter<FilterParameter>();
    @Output() updateLinkOfferFilters = new EventEmitter<FilterParameter[]>();

    // To Unsubscribe Observables
    private unsubscribe: Subject<void> = new Subject<void>();

    constructor(private _sharedSvc: SharedService) {
        this._sharedSvc.clearFilters$.takeUntil(this.unsubscribe).subscribe(isclear => {
            if (isclear) {
                this.filterColumn.forEach(ftr => {
                    ftr.IsSelected = false;
                });
                this.selectAll = false;
                this.selectedText = this.constants.LBL_SELECT_ALL;
            }
        });
    }

    // To get Updated Input Value
    ngOnChanges(changes: SimpleChanges) {
        for (const inputProps in changes) {
            if (inputProps === 'filterColumn') {
                const chng = changes[inputProps];
                this.filterColumn = chng.currentValue;
                this.setselectedMsg();
            }
        }
    }



    ngOnInit() {
        this.setselectedMsg();
    }

    // sets selected filters name
    setselectedMsg(): void {
        let msgs = '';
        if (this.filterColumn !== undefined && this.filterColumn !== null && this.filterColumn.length > 0) {
            let i = 0;
            this.filterColumn.forEach(li => {
                if (li.IsSelected) {
                    msgs += li.TypeName + ',';
                    i += 1;
                }
            });
            if (msgs.trim() !== '') {
                this.selectedText = msgs.substring(0, msgs.length - 1);
                if (this.filterColumn.length === i) {
                    this.selectAll = true;
                    this.selectedText = this.constants.LBL_ALL_SELECTED;
                } else {
                    this.selectAll = false;
                }
            } else {
                this.selectedText = this.constants.LBL_SELECT_ALL;
                this.selectAll = false;
            }
        }
    }

    // Updates filter to Filter Component
    updateFilterColumn() {
        let filterValues = '';
        this.filterColumn.forEach(ftr => {
            if (ftr.IsSelected) {
                filterValues += ftr.TypeID + ',';
            }
        });
        this.setselectedMsg();
        const filter = new FilterParameter(this.ColumnName, filterValues.substring(0, filterValues.length - 1));
        this.updateFilterValues.emit(filter);
    }

    // selects all in current filter type
    selectAllItems() {
        if (this.selectAll) {
            if (this.filterColumn !== undefined && this.filterColumn !== null && this.filterColumn.length > 0) {
                this.filterColumn.forEach(ft => {
                    ft.IsSelected = this.selectAll;
                });
            }

        } else {
            if (this.filterColumn !== undefined && this.filterColumn !== null && this.filterColumn.length > 0) {
                this.filterColumn.forEach(ft => {
                    ft.IsSelected = this.selectAll;
                });
            }
        }
        this.setselectedMsg();
        if (this.ColumnName === this.constants.FTR_LINKOFFER) {
            this.updateLinkOffer();
        } else {
            this.updateFilterColumn();
        }
    }

    // Updates Link offer Filter
    updateLinkOffer() {
        const filterParams = [];
        this.filterColumn.forEach(ftr => {
            if (ftr.IsSelected) {
                const filter = new FilterParameter(ftr.TypeName, "1");
                filterParams.push(filter);
            } else {
                const filter = new FilterParameter(ftr.TypeName, "0");
                filterParams.push(filter);
            }
        });
        this.setselectedMsg();
        this.updateLinkOfferFilters.emit(filterParams);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
