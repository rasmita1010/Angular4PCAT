import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Constants, FilterParameter, CommonFilterModel, FilterParams, SaveSearchRequest, ApplicationStatus } from '../_models/index';
import { SharedService, QuestionService } from '../_services/index';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.css']
})
export class FilterSearchComponent implements OnInit, OnDestroy {

  userId: string;
  constants = Constants;
  StatusArray: any;
  ChannelArray: any;
  MagazineArray: any;
  AnswerType: any;
  LinkOffers: LinkOffer[] = [];

  // For Multi-CheckBox Component
  MCStatus: CommonFilterModel[] = [];
  MCChannel: CommonFilterModel[] = [];
  MCMagazine: CommonFilterModel[] = [];
  MCAnswerType: CommonFilterModel[] = [];
  MCLinkOffer: CommonFilterModel[] = [];


  // Model binders
  filterDemoCode = '';
  filterDemoOfferCode = '';
  filterDemoChoiceText = '';

  @Input() filterParams: FilterParameter[] = [];
  @Output() updateFilters = new EventEmitter<FilterParameter[]>();
  @Output() clearFilters = new EventEmitter<boolean>();

  // To Unsubscribe Observables
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private _sharedSVC: SharedService, private _questionSvc: QuestionService) {
    // To clear overall filters
    this._sharedSVC.clearFilters$.takeUntil(this.unsubscribe).subscribe(isclear => {
      if (isclear) {
        this.clearAll();
        this.setInitialState();
      }
    });
    // to remove filters of type checkboxes
    this._sharedSVC.remvFilters$.takeUntil(this.unsubscribe).subscribe(ftrParams => {
      this.clearAll();
      this.setInitialState();
      this.formFilterValues(ftrParams);
    });
    // to remove filters of type texts
    this._sharedSVC.remvFiltersTxt$.takeUntil(this.unsubscribe).subscribe(coltype => {
      if (coltype === Constants.FTR_DEMOCODE) {
        this.filterDemoCode = '';
      } else if (coltype === Constants.FTR_DEMOOFFERCODE) {
        this.filterDemoOfferCode = '';
      } else {
        this.filterDemoChoiceText = '';
      }
    });
  }

  ngOnInit() {
    this.loadInitialState();
    this.setInitialState();
    this.formFilterValues(this.filterParams);
    this.userId = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).username;
  }

  loadInitialState() {
    const Magazines = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).resources;
    this.MagazineArray = Magazines === null ? [] : Magazines;
    this.ChannelArray = JSON.parse(localStorage.getItem(this.constants.LS_CHANNEL_METADATA));
    this.AnswerType = JSON.parse(localStorage.getItem(this.constants.LS_ANSWERTYPE_METADATA));
    this.StatusArray = JSON.parse(localStorage.getItem(this.constants.LS_STATUS_METADATA));

  }

  clearAll() {
    this.MCMagazine = [];
    this.MCChannel = [];
    this.MCStatus = [];
    this.MCAnswerType = [];
    this.MCLinkOffer = [];
    this.filterDemoCode = '';
    this.filterDemoOfferCode = '';
    this.filterDemoChoiceText = '';
  }

  setInitialState() {
    this.MagazineArray.forEach(mag => {
      this.MCMagazine.push(new CommonFilterModel(mag.Description, mag.ResourceName, false));
    });
    this.ChannelArray.forEach(ch => {
      this.MCChannel.push(new CommonFilterModel(ch.ChannelName, ch.ChannelId, false));
    });
    this.StatusArray.forEach(st => {
      const unallowedStatus = [ApplicationStatus.Deleted, ApplicationStatus.Archived, ApplicationStatus.Active_In_Edit];
      if (unallowedStatus.find(s => s === st.StatusType) === undefined) {
        this.MCStatus.push(new CommonFilterModel(st.StatusType, st.StatusId, false));
      }
    });
    this.AnswerType.forEach(at => {
      this.MCAnswerType.push(new CommonFilterModel(at.AnswerType, at.AnswerId, false));
    });
    this.LinkOffers = [{ OfferType: Constants.FTR_LINKPREMIUM, IsLinked: '0' }, { OfferType: Constants.FTR_LINKDIGITAL, IsLinked: '0' }];
    this.LinkOffers.forEach(of => {
      this.MCLinkOffer.push(new CommonFilterModel(of.OfferType, of.IsLinked, false));
    });
  }

  formFilterValues(filterParams) {
    filterParams.forEach(filter => {
      switch (filter.FilterColumn) {
        case Constants.FTR_MAGCODE:
          {
            this.MCMagazine = [];
            const magCodes = filter.FilterValues.split(',');
            this.MagazineArray.forEach(mag => {
              if (magCodes.filter(mc => mc === mag.ResourceName).length > 0) {
                this.MCMagazine.push(new CommonFilterModel(mag.Description, mag.ResourceName, true));
              } else {
                this.MCMagazine.push(new CommonFilterModel(mag.Description, mag.ResourceName, false));
              }
            });
            break;
          }
        case Constants.FTR_CHNNLID:
          {
            this.MCChannel = [];
            const Ids = filter.FilterValues.split(',');
            this.ChannelArray.forEach(ch => {
              if (Ids.filter(id => Number(id) === ch.ChannelId).length > 0) {
                this.MCChannel.push(new CommonFilterModel(ch.ChannelName, ch.ChannelId, true));
              } else {
                this.MCChannel.push(new CommonFilterModel(ch.ChannelName, ch.ChannelId, false));
              }
            });
            break;
          }
        case Constants.FTR_STATUSID:
          {
            this.MCStatus = [];
            const Ids = filter.FilterValues.split(',');
            this.StatusArray.forEach(st => {
              const unallowedStatus = [ApplicationStatus.Deleted, ApplicationStatus.Archived, ApplicationStatus.Active_In_Edit];
              if (unallowedStatus.find(s => s === st.StatusType) === undefined) {
                if (Ids.filter(id => Number(id) === st.StatusId).length > 0) {
                  this.MCStatus.push(new CommonFilterModel(st.StatusType, st.StatusId, true));
                } else {
                  this.MCStatus.push(new CommonFilterModel(st.StatusType, st.StatusId, false));
                }
              }
            });
            break;
          }
        case Constants.FTR_ANSWERID:
          {
            this.MCAnswerType = [];
            const Ids = filter.FilterValues.split(',');
            this.AnswerType.forEach(at => {
              if (Ids.filter(id => Number(id) === at.AnswerId).length > 0) {
                this.MCAnswerType.push(new CommonFilterModel(at.AnswerType, at.AnswerId, true));
              } else {
                this.MCAnswerType.push(new CommonFilterModel(at.AnswerType, at.AnswerId, false));
              }
            });
            break;
          }
        case Constants.FTR_DEMOCODE:
          {
            this.filterDemoCode = filter.FilterValues;
            break;
          }
        case Constants.FTR_DEMOOFFERCODE:
          {
            this.filterDemoOfferCode = filter.FilterValues;
            break;
          }
        case Constants.FTR_DEMOCHOICETXT:
          {
            this.filterDemoChoiceText = filter.FilterValues;
            break;
          }
        case Constants.FTR_LINKPREMIUM:
        case Constants.FTR_LINKDIGITAL:
          {
            const index = this.MCLinkOffer.findIndex(f => f.TypeName === filter.FilterColumn);
            if (filter.FilterValues === '1' || filter.FilterValues === true) {
              if (index > -1) {
                this.MCLinkOffer[index].IsSelected = true;
              }
            } else {
              this.MCLinkOffer[index].IsSelected = false;
            }
            break;
          }
        default:
          break;
      }
    });
  }


  // DemoCode Filter
  onDemoCodeChange() {
    this.addFilter(Constants.FTR_DEMOCODE, this.filterDemoCode);
  }

  // DemoOfferCode Filter
  onDemoOfferCodeChange() {
    this.addFilter(Constants.FTR_DEMOOFFERCODE, this.filterDemoOfferCode);
  }

  // DemoChoiceText Filter
  onDemoChoiceTextChange() {
    this.addFilter(Constants.FTR_DEMOCHOICETXT, this.filterDemoChoiceText);
  }

  // Common for Text types
  addFilter(column, data) {
    if (data.trim() !== '') {
      const filter = new FilterParameter(column, data);
      this.updateFilterValues(filter);
    }
  }

  // looks for input changes
  valuechange(ev, value, column) {
    if (ev.inputType === 'deleteByCut' || ev.inputType === 'deleteContentBackward' || ev.inputType === 'deleteContentForward') {
      if (value.trim() === '') {
        const data = '';
        const filter = new FilterParameter(column, data);
        this.updateFilterValues(filter);
      }
    }
  }

  // Updates added filter values from MultiCheckBox to Demo Summary component
  updateFilterValues(filter) {
    const index = this.filterParams.findIndex(f => f.FilterColumn === filter.FilterColumn);
    if (index > -1) {
      // Updates existing filter
      this.filterParams[index].FilterValues = filter.FilterValues;
    } else {
      // adds if new filter type is selected
      const newFilter = new FilterParameter(filter.FilterColumn, filter.FilterValues);
      this.filterParams.push(newFilter);
    }
    this.updateFilters.emit(this.filterParams);
  }

  // Updates added Link offerfilter values from MultiCheckBox to Demo Summary component
  updateLinkOfferFilters(filterParams) {
    filterParams.forEach(filter => {
      const index = this.filterParams.findIndex(f => f.FilterColumn === filter.FilterColumn);
      if (index > -1) {
        // Updates existing filter
        this.filterParams[index].FilterValues = filter.FilterValues;
      } else {
        // adds if new filter type is selected
        const newFilter = new FilterParameter(filter.FilterColumn, filter.FilterValues);
        this.filterParams.push(newFilter);
      }
    });
    this.updateFilters.emit(this.filterParams);
  }


  // Saves Filter when user moves out of filter component -  on Destroy
  ngOnDestroy() {
    const removeEmptyFilters = this.filterParams;
    removeEmptyFilters.forEach((ftr, idx) => {
      if ((ftr.FilterColumn !== Constants.FTR_LINKPREMIUM) && (ftr.FilterColumn !== Constants.FTR_LINKDIGITAL)) {
        if (ftr.FilterValues.trim() === '') {
          this.filterParams = this.filterParams.filter(f => f.FilterColumn !== ftr.FilterColumn);
        }
      } else {
        if (ftr.FilterValues === false) {
          this.filterParams = this.filterParams.filter(f => f.FilterColumn !== ftr.FilterColumn);
        }
      }
    });
    const savesearchRequest = new SaveSearchRequest(this.filterParams, this.userId);
    this._questionSvc.SaveSearch(savesearchRequest).subscribe((response) => { });
    // Unsubscribing Observables
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}


export interface LinkOffer {
  OfferType: string;
  IsLinked: any;
}
