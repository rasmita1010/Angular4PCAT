import { FilterParameter } from './FilterParameter';

export class SearchRequest {
    FilterParameters: FilterParameter[];
    IsLoad: boolean;
    UserId: string;
    constructor(_filterparams: FilterParameter[], _isLoad: boolean, _userId: string) {
        this.FilterParameters = _filterparams;
        this.IsLoad = _isLoad;
        this.UserId = _userId;
    }
}

export class SaveSearchRequest {
    FilterParameters: FilterParameter[];
    UserId: string;
    constructor(_filterparams: FilterParameter[], _userId: string) {
        this.FilterParameters = _filterparams;
        this.UserId = _userId;
    }
}