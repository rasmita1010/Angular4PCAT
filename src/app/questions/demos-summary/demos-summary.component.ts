import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../_services/index';
import { Constants, SearchRequest, FilterParameter, Roles, FilterParams,SaveSearchRequest } from '../../_models/index';
import { QuestionService } from '../../_services/questions/question.service';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'app-demos-summary',
    templateUrl: './demos-summary.component.html',
    styleUrls: ['./demos-summary.component.css']
})
export class DemosSummaryComponent implements OnInit, OnDestroy {

    // Declarations
    constants = Constants;
    data: any = [];
    sortBy = '';
    sortOrder = '';
    rowsOnPage = this.constants.QT_SUMMARY_ROWSPERPAGE;
    freeTextSearch = '';
    alertMsg: string;
    userId: string;
    userName: string;
    demoCode: string;
    modalMessage: string;
    showFilterPane = false;
    filterParams: FilterParameter[] = [];
    role: string;
    isDisabled: boolean;
    filteredValues: FilterParams[] = [];
    isremvFilter = false;
    initializeFilterDemoOffer = '';
    // For Filters 
    StatusArray: any;
    ChannelArray: any;
    MagazineArray: any;
    AnswerType: any;
    @ViewChild('modalDeleteDemo')
    modalDeleteDemo: BsModalComponent;
    @ViewChild('modalDeleteSuccess')
    modalDeleteSuccess: BsModalComponent;
    @ViewChild('modalDemoLocked')
    modalDemoLocked: BsModalComponent;
    @ViewChild('progressBar')
    progressBar: BsModalComponent;


    constructor(private _sharedSVC: SharedService, private _router: Router, private _service: QuestionService) {
        this._sharedSVC.setActiveTab(this.constants.PCA_QUESTIONS);

    }

    ngOnInit() {
        this.userId = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).username;
        this.userName = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).DisplayName;
        let Magazines = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).resources;
        this.MagazineArray = Magazines === null ? [] : Magazines;
        this.ChannelArray = JSON.parse(localStorage.getItem(this.constants.LS_CHANNEL_METADATA));
        this.AnswerType = JSON.parse(localStorage.getItem(this.constants.LS_ANSWERTYPE_METADATA));
        this.StatusArray = JSON.parse(localStorage.getItem(this.constants.LS_STATUS_METADATA));
        this.role = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).roles;
        if (this.role.indexOf(Roles.Admin) > -1 || this.role.indexOf(Roles.Marketers) > -1) {
            this.isDisabled = false;
        } else {
            this.isDisabled = true;
        }
        
        this.rowsOnPage = JSON.parse(localStorage.getItem(this.constants.LS_USER_PAGINATION_DEMO_SUMMARY));
        this.rowsOnPage = this.rowsOnPage !== null ? this.rowsOnPage : this.constants.QT_SUMMARY_ROWSPERPAGE;
        this.loadInitialState();
    }

    ngAfterViewInit() { this.progressBar.open(); }

    loadInitialState() {
        var searchRequest = new SearchRequest(this.filterParams, true, this.userId);
        this._service.Search(searchRequest).subscribe((response) => {
            setTimeout(() => {
                this.progressBar.close();
                this.data = response.DemoCodes;
                this.filterParams = response.FilterParameters;
                this.formFilterParamObj(this.filterParams);
            },1000);
            
        }, error => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
        });
    }

    // calls create DemoCode
    callCreate(): void {
        sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.initializeFilterDemoOffer));
        this._router.navigate(['./dashboard/questions', 'create']);
    }

    callPrioritize(): void {
        sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.initializeFilterDemoOffer));
        this._router.navigate(['./dashboard/questions/prioritize']);
    }

    // Navigates to View of Selected DemoCode
    viewDemo(demoCodeDetails: any): void {
        let demoCode = demoCodeDetails.DemoCode;
        sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(demoCode));
        if (this.filteredValues.length > 0 && demoCodeDetails.DemoOfferCodes[0]!==null && demoCodeDetails.DemoOfferCodes.length === 1) {
            let filteredDemoOffer = demoCodeDetails.DemoOfferCodes[0];
            sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(filteredDemoOffer));
        } else {
            sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.initializeFilterDemoOffer));
        }
        this._router.navigate(['./dashboard/questions/view']);
    }

    trackByDemoCode(index: number, data: any): string {
        return data.DemoCode;
    }

    UserPaginationChoice(choice: number) {
        localStorage.setItem(this.constants.LS_USER_PAGINATION_DEMO_SUMMARY, JSON.stringify(choice));
    }

    deleteDemoCode(demoCode: string) {
        this.modalDeleteDemo.open();
        this.alertMsg = this.constants.ALERT_QT_SUMMARY_DELETE;
        this.demoCode = demoCode;
    }

    demoValidate() {
        this.modalDeleteDemo.close();
        this._service.deleteDemoCodeDetails(this.demoCode, this.userId, this.userName).subscribe((data) => {
            if (data.Status) {
                this.modalDeleteSuccess.open();
                this.modalMessage = data.BusinessMessage;
                setTimeout(() => {
                    this.modalDeleteSuccess.close();
                    const savesearchRequest = new SaveSearchRequest(this.filterParams, this.userId);
                    this._service.SaveSearch(savesearchRequest).subscribe((response) => {
                        this.loadInitialState();
                    });
                    
                }, 3000);

            } else {
                this.modalDemoLocked.open();
                this.modalMessage = data.BusinessMessage;
                setTimeout(() => {
                    this.modalDemoLocked.close();
                }, 3000);
            }
        });
    }

    showFilter() {
        this.showFilterPane = !this.showFilterPane;
    }


    // Set Filter Badges
    formFilterParamObj(filter) {
        this.filteredValues = [];
        filter.forEach(ftr => {
            switch (ftr.FilterColumn) {
                case Constants.FTR_MAGCODE:
                    {
                        let magCodes = ftr.FilterValues.split(',');
                        this.MagazineArray.forEach(mag => {
                            if (magCodes.filter(mc => mc === mag.ResourceName).length > 0) {
                                this.filteredValues.push(new FilterParams(ftr.FilterColumn, mag.ResourceName, mag.Description));
                            }
                        });
                        break;
                    }
                case Constants.FTR_CHNNLID:
                    {
                        let Ids = ftr.FilterValues.split(',');
                        this.ChannelArray.forEach(ch => {
                            if (Ids.filter(id => Number(id) === ch.ChannelId).length > 0) {
                                this.filteredValues.push(new FilterParams(ftr.FilterColumn, ch.ChannelId, ch.ChannelName));
                            }
                        });
                        break;
                    }
                case Constants.FTR_STATUSID:
                    {
                        let Ids = ftr.FilterValues.split(',');
                        this.StatusArray.forEach(st => {
                            if (Ids.filter(id => Number(id) === st.StatusId).length > 0) {
                                this.filteredValues.push(new FilterParams(ftr.FilterColumn, st.StatusId, st.StatusType));
                            }
                        });
                        break;
                    }
                case Constants.FTR_ANSWERID:
                    {
                        let Ids = ftr.FilterValues.split(',');
                        this.AnswerType.forEach(at => {
                            if (Ids.filter(id => Number(id) === at.AnswerId).length > 0) {
                                this.filteredValues.push(new FilterParams(ftr.FilterColumn, at.AnswerId, at.AnswerType));
                            }
                        });
                        break;
                    }
                case Constants.FTR_DEMOCODE:
                case Constants.FTR_DEMOOFFERCODE:
                case Constants.FTR_DEMOCHOICETXT:
                    {
                        if (ftr.FilterValues.trim() !== '') {
                            this.filteredValues.push(new FilterParams(ftr.FilterColumn, ftr.FilterValues, ftr.FilterValues));
                        }
                        break;
                    }
                case Constants.FTR_LINKPREMIUM:
                case Constants.FTR_LINKDIGITAL:
                    {
                        let canAdd = ((ftr.FilterValues === '1') || (ftr.FilterValues === true)) ? true : false;
                        ftr.FilterValues = canAdd === true ? '1' : '0';
                        if (canAdd) {
                            this.filteredValues.push(new FilterParams(ftr.FilterColumn, ftr.FilterValues, ftr.FilterColumn));
                        }
                        break;
                    }
                default:
                    break;
            }
        });
    }

    // Updates Filter badges
    updateFilters(filterParams) {
        let removeEmptyFilters = filterParams;
        removeEmptyFilters.forEach((ftr, idx) => {
            if ((ftr.FilterColumn !== Constants.FTR_LINKPREMIUM) && (ftr.FilterColumn !== Constants.FTR_LINKDIGITAL)) {
                if (ftr.FilterValues.trim() === '') {
                    this.filterParams = filterParams.filter(f => f.FilterColumn !== ftr.FilterColumn);
                }
            }
            else {
                if (ftr.FilterValues === false) {
                    this.filterParams = filterParams.filter(f => f.FilterColumn !== ftr.FilterColumn);
                }
            }
        });
        this.updateFilterValues(this.filterParams);
    }

    // Removes individual filters
    removeFilter(remftr) {
        this.isremvFilter = true;
        this.filterParams.forEach(ftr => {
            switch (ftr.FilterColumn) {
                case Constants.FTR_DEMOCODE:
                case Constants.FTR_DEMOOFFERCODE:
                case Constants.FTR_DEMOCHOICETXT:
                    {
                        if (remftr.FilterColumn === ftr.FilterColumn) {
                            this.filterParams = this.filterParams.filter(f => f.FilterColumn !== ftr.FilterColumn);
                            this.updateFilters(this.filterParams);
                            this._sharedSVC.remvFilterValuesTxt(remftr.FilterColumn);
                        }
                        break;
                    }
                default:
                    {
                        if (remftr.FilterColumn === ftr.FilterColumn) {
                            let filterValues = ftr.FilterValues.split(',');
                            for (let index = 0; index <= filterValues.length; index++) {
                                if (filterValues[index] === remftr.FilterValues.toString()) {
                                    filterValues.splice(index, 1);
                                }
                            }
                            ftr.FilterValues = filterValues.toString();
                            if (ftr.FilterValues.trim() === '') {
                                this.filterParams = this.filterParams.filter(f => f.FilterColumn !== ftr.FilterColumn);
                            }
                            this.updateFilters(this.filterParams);
                            this._sharedSVC.remvFilterValues(this.filterParams);
                        }
                        break;
                    }
            }
        });
    }

    // Service to emit clear request to filter/Multicheckbox components
    clearFilters(isClear) {
        if (isClear) {
            this.filteredValues = [];
            this.filterParams = [];
            this._sharedSVC.clearFilterValues(true);
            this.updateFilterValues(this.filterParams);
        }
    }

    // Server Call to update/clear filters
    updateFilterValues(filterParams) {
        var searchRequest = new SearchRequest(filterParams, false, this.userId);
        this._service.Search(searchRequest).subscribe((response) => {
            this.progressBar.open();
            this.formFilterParamObj(filterParams);
            this.data = response.DemoCodes;
            setTimeout(() => {
                this.progressBar.close();
            }, 1000);
        });
    }

    ngOnDestroy() {
        if (this.isremvFilter) {            
            const savesearchRequest = new SaveSearchRequest(this.filterParams, this.userId);
            this._service.SaveSearch(savesearchRequest).subscribe((response) => {
            });
        }
    }
}
