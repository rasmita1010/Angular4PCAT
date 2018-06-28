import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { QuestionService, SharedService } from '../../_services/index';
import { Constants, DemoCode, ApplicationStatus, AnswerTypes } from '../../_models/index';
import { IonRangeSliderComponent } from 'ng2-ion-range-slider';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IMyDpOptions, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-user-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']

})
export class UsersViewComponent implements OnInit, OnDestroy {

  // Declarations
  constants = Constants;
  @Input() DemoCodeObj: any;
  @Input() ViewMode: boolean;
  @Input() isLocked: boolean;
  @Input() lockedUser: string;

  //@Output() ErrorDetail = new EventEmitter<boolean>();
  @Output() SelectedDemoOffers = new EventEmitter<any>();
  @Output() clearFilter = new EventEmitter<any>();

  userViewConfigurations: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showTodayBtn: false
  }

  DemoCodeModel: DemoCode;
  DemoOffers = [];
  SelectedDemoOffer = [];
  freeTextSearch = '';
  UserViewMessage = '';
  UserViewHasErrors = false;
  applicationStatus = ApplicationStatus;
  demoOfferCount: string;
  filteredDemoOffer: string;
  answerType = AnswerTypes;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  // To Unsubscribe Observables
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private _router: Router, private _sharedSVC: SharedService, private _questionSVC: QuestionService) {
    this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(searchText => {
      this.filteredDemoOffer = searchText;
      this.freeTextSearch = searchText;
    });
  }

  //ngAfterViewInit() { this.progressBar.open(); }

  ngOnInit() {
    // On navigating to User's view, Load and Validate Demo details entirely
    this.validateAndIntializeDemoCode();
    this.filteredDemoOffer = JSON.parse(sessionStorage.getItem(this.constants.LS_FILTRED_DEMO_OFFER));
    this.freeTextSearch = this.filteredDemoOffer;
    this.demoOfferCount = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_OFFER_COUNT));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // Validate the Demo Code Details
  validateAndIntializeDemoCode() {
    let message = '';
    if (this.DemoCodeObj === null || this.DemoCodeObj.length === 0) {
      message += this.constants.MSG_USRVW_NODEMOCODE;
      this.UserViewHasErrors = true;
      this.UserViewMessage = message;
    } else {
      this.DemoCodeModel = this.DemoCodeObj.DemoCode;
      this.validateAndIntializeDemoCodeOffer();
    }
    // this.emitErrorToParent();
  }

  // Validate the Demo Code Details
  validateAndIntializeDemoCodeOffer() {
    let message = '';
    if (this.DemoCodeObj.DemoOffers === null || this.DemoCodeObj.DemoOffers.length === 0) {
      //setTimeout(() => {
      //    this.progressBar.close();
      //}, 1000);
      message += this.constants.MSG_USRVW_NODEMOOFFER;
      this.UserViewHasErrors = true;
      this.UserViewMessage = message;
    } else {
      //setTimeout(() => {
      //    this.progressBar.close();
      //}, 1000);
      this.DemoOffers = JSON.parse(JSON.stringify(this.DemoCodeObj.DemoOffers));

      if (this.DemoCodeModel.AnswerType.toUpperCase() === AnswerTypes.DateRange) {
        this.formatDates(this.DemoOffers);
      }
    }
    // this.emitErrorToParent();
  }

  //Formats dates
  formatDates(offers) {
    this.DemoOffers.forEach(of => {
      if (of.MinDate !== null && of.MaxDate !== null) {
        of.MinDate = this.formatDate(of.MinDate);
        of.MaxDate = this.formatDate(of.MaxDate);
      }
    });

  }

  formatDate(scDate): any {
    var parts = scDate.toString().match(/(\d+)/g);
    let myDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const editDate = { year: myDate.getFullYear(), month: myDate.getMonth() + 1, day: myDate.getDate() };
    return editDate;
  }

  // Validate the Demo Magazine Channel Mapping Details
  validateAndIntializeDemoCodeChannel(): string {
    let message = '';
    let missedOffers = [];
    this.DemoOffers.forEach(offer => {
      const magazines = this.DemoCodeObj.Magazine.filter(value => value.DemoOfferCode === offer.DemoOfferCode)[0];
      if (magazines === undefined || magazines.length === 0) {
        missedOffers.push(offer.DemoOfferCode);
      } else {
        const demoOfferChannel = magazines.DemoOfferChannel;
        if (demoOfferChannel === undefined || demoOfferChannel.length === 0) {
          missedOffers.push(offer.DemoOfferCode);
        }
      }
    });
    if (missedOffers.length > 0) {
      message += this.constants.MSG_USRVW_NOMAGAZINES + missedOffers.join(',');
    }
    this.UserViewMessage = message;
    // this.emitErrorToParent();
    return message;
  }

  // Validate indvidual Demo Offer
  validateDemoOffer(demoOfferCode): boolean {
    let value: boolean;
    if (this.DemoCodeObj.Magazine === undefined || this.DemoCodeObj.Magazine.length === 0) {
      value = false;
    } else {
      const demoOfferChannel = (this.DemoCodeObj.Magazine.filter(value => value.DemoOfferCode === demoOfferCode)[0]).DemoOfferChannel;
      if (demoOfferChannel === undefined || demoOfferChannel.length === 0) {
        value = false;
      } else {
        value = true;
      }
    }
    return value;
  }

  // Pass flag to parent component indicating error
  //emitErrorToParent() {
  //    if (this.UserViewHasErrors) {
  //        this.ErrorDetail.emit(true);
  //    } else {
  //        this.ErrorDetail.emit(false);
  //    }
  //}

  // Updating Selected Demo Offers
  updateCheckedOffers(demoOfferCode) {
    if (this.SelectedDemoOffer.indexOf(demoOfferCode) === -1) {
      this.SelectedDemoOffer.push(demoOfferCode);
    } else {
      this.SelectedDemoOffer.splice(this.SelectedDemoOffer.indexOf(demoOfferCode), 1);
    }
    this.emitSelectedDemoOffersToparent();
  }

  // Pass Selected Demo Offers to parent component
  emitSelectedDemoOffersToparent() {
    this.SelectedDemoOffers.emit(this.SelectedDemoOffer);
  }

  // Check if Schedule date is valid for a Demo Offer for Submitting
  isScheudledDateValid(date): boolean {
    let checkDate = date.split('T')[0];
    var parts = checkDate.toString().match(/(\d+)/g);
    let myDate = new Date(parts[0], parts[1] - 1, parts[2]);
    if (myDate <= new Date()) {
      return false;
    } else {
      return true;
    }
  }

  // Check if Status valid for a Demo Offer for Submitting
  isValidStatus(demoOfferStatus): boolean {
    if (demoOfferStatus === this.applicationStatus.Draft
      || demoOfferStatus === this.applicationStatus.Active_In_Edit
      || demoOfferStatus === this.applicationStatus.Returned) {
      return true;
    } else {
      return false;
    }
  }

  clearFilterUserView() {
    this.clearFilter.emit();
  }

  SetPinnedFilter() {
    const filterDemoOffer = this.DemoOffers.filter(m => m.DemoOfferCode.toUpperCase() === this.freeTextSearch.toUpperCase());
    if (this.freeTextSearch !== '' && filterDemoOffer.length === 1) {
      sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.freeTextSearch));
      this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    }
    if (this.freeTextSearch === '') {
      sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.freeTextSearch));
      this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    }

  }
}
