export class FilterParameter {
    FilterColumn: string;
    FilterValues: any;
        
    constructor(_filtercolumn: string, _filtervals: any) {
        this.FilterColumn = _filtercolumn;
        this.FilterValues = _filtervals;
    }
}
export class FilterParams {
    FilterColumn: string;
    FilterValues: any;
    DisplayText: string;
    constructor(_filtercolumn: string, _filtervals: any, _displayText: string) {
        this.FilterColumn = _filtercolumn;
        this.FilterValues = _filtervals;
        this.DisplayText = _displayText;
    }
}
