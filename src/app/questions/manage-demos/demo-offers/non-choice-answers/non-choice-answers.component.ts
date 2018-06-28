import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Constants, AnswerTypes, DemoOfferDetails, DemoChoiceDetails, DemoOfferRequest, ApplicationStatus } from '../../../../_models/index';
import { AnswerService, CommonService, QuestionService, SharedService } from '../../../../_services/index';
import { DemoOfferActionsComponent } from '../demo-offer-actions.component';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-non-choice-answers',
  templateUrl: './non-choice-answers.component.html',
  styleUrls: ['./non-choice-answers.component.css']
})
export class NonChoiceAnswersComponent extends DemoOfferActionsComponent implements OnInit, OnDestroy {

  @Input() questionTabDetails;
  @Input() filteredDemoOffer;
  @Output() updatedDemoOffers = new EventEmitter<any>();
  @Output() updateMagazines = new EventEmitter<any>();
  @Output() updateDCStatus = new EventEmitter<any>();
  @Output() demoCodeDetails = new EventEmitter<any>();
  @Output() clearFilter = new EventEmitter<any>();

  constants = Constants;
  applicationStatus = ApplicationStatus;
  answerTypeConst = AnswerTypes;
  paramValue;
  userDetails;
  answerHeader: string;
  selectedSourceType = '';
  answerType: string;
  modalMessage = '';
  Magazines: any;
  previousStatus: string;
  BusinessMessage: string;
  duplicateDemoOfferCodeMsg = '';
  digitalOffers: any = [];
  sourceTypes: any = [];
  recordTypes: any = [];
  selectedDemoOffer: DemoOfferDetails;
  recalledDemoOffer: DemoOfferDetails;
  demoOfferDetails: DemoOfferDetails[] = [];
  premiumTypes = this.constants.PREMIUM_TYPES;
  controlTypes = this.constants.CONTROL_TYPES;
  demoOfferCode: string;
  Status: any;
  chainOffers: any;
  demoOfferCount: string;
  freeTextSearch = '';
  recallConfirm: string;
  demoCodeStatus: string;
  selectedScheduleDate: Date;
  recalledMinDate: any;
  recalledMaxDate: any;
  validateDemoOffer: boolean;
  validationMsg: string;
  unSavedChangesResponse: EventEmitter<boolean> = new EventEmitter();
  // Date Picker Configuration
  myDate = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
  selectedDate: any = { year: this.myDate.getFullYear(), month: this.myDate.getMonth() + 1, day: this.myDate.getDate() };
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showTodayBtn: false,
    minYear: 2000,
    maxYear: 3000,
    width: '70%'
  };
  minMaxConfigurations: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showTodayBtn: false,
    width: '70%'
  }
  userViewConfigurations: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showTodayBtn: false,
    width: '50%'
  }

  // Bool declarations
  isAddDemoOffer = true;
  demoOfferChanged = false;
  choicesChanged = false;
  scheduleChanged = true;
  inProgress = false;
  duplicateDemoOfferCode = false;
  disableLinking = false;
  archiveoffer: any;
  deleteMessage = '';
  demooffer: any;
  digitalLinkError: string;
  isValidSCHdate = true;
  isValidMinDate = true;
  isValidMaxDate = true;
  isMinDateChanged = false;
  isMaxDateChanged = false;
  isCDBModel: boolean;
  filteredDigitalDemoOffers: any[];
  digitalMagazines: any[];

  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;
  @ViewChild('modalSaveSuccess')
  modalSaveSuccess: BsModalComponent;
  @ViewChild('modelNonChoiceAnswer')
  modelNonChoiceAnswer: BsModalComponent;
  @ViewChild('modalRecallDemoOffer')
  modalRecallDemoOffer: BsModalComponent;
  @ViewChild('modalRecallDelete')
  modalRecallDelete: BsModalComponent;
  @ViewChild('modalRecallEdit')
  modalRecallEdit: BsModalComponent;
  @ViewChild('modalRecallDiscard')
  modalRecallDiscard: BsModalComponent;
  @ViewChild('modalRecallSuccess')
  modalRecallSuccess: BsModalComponent;
  @ViewChild('modalArchive')
  modalArchive: BsModalComponent;
  @ViewChild('modalRecallConfirmation')
  modalRecallConfirmation: BsModalComponent;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  @ViewChild('modelUnSavedChanges')
  modelUnSavedChanges: BsModalComponent;
  @ViewChild('modalDiscardError')
  modalDiscardError: BsModalComponent;

  // To Unsubscribe Observables
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(_router: Router, _route: ActivatedRoute, _commonService: CommonService, _answerService: AnswerService, _questionService: QuestionService, public _sharedSVC: SharedService) {
    super(_router, _route, _commonService, _answerService, _questionService);

    this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(demoOffer => {
      this.filteredDemoOffer = demoOffer;
      this.freeTextSearch = this.filteredDemoOffer;
    });
  }

  ngOnInit() {
    this.loadInitalState();
    this.setInitialData();
  }

  loadInitalState() {
    this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
    this.Status = JSON.parse(localStorage.getItem(this.constants.LS_STATUS_METADATA));
    this.isCDBModel = this.questionTabDetails.DemoCode.IsCDBModel;
    this.demoOfferCount = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_OFFER_COUNT));
    this.freeTextSearch = this.filteredDemoOffer;
    this._route.params.subscribe(params => {
      this.paramValue = params['action'];

      if (this.paramValue.toLowerCase() === this.constants.MSG_ROUTE_EDIT) {
        this.demoOfferDetails = this.questionTabDetails.DemoOffers;
        this.answerType = this.questionTabDetails.DemoCode.AnswerType.toUpperCase();
        this.Magazines = this.questionTabDetails.Magazine;
        this.chainOffers = this.questionTabDetails.ChainOffers;
        this.demoCodeStatus = this.questionTabDetails.DemoCode.Status;
      } else {
        this.demoOfferDetails = this.questionTabDetails.DemoOffers.length === 0 ? [] : this.questionTabDetails.DemoOffers;
        this.answerType = this.questionTabDetails.DemoCode.AnswerType.toUpperCase();
        this.Magazines = this.questionTabDetails.Magazine.length === 0 ? [] : this.questionTabDetails.Magazine;
        this.chainOffers = this.questionTabDetails.ChainOffers.length === 0 ? [] : this.questionTabDetails.ChainOffers;
      }
    });
    if ((this.answerType !== null) && (this.answerType !== undefined)) {
      if (this.answerType.toUpperCase() === AnswerTypes.Numeric) {
        this.answerHeader = this.constants.NUMERIC_RANGE;
      } else if (this.answerType.toUpperCase() === AnswerTypes.Date) {
        this.answerHeader = this.constants.DATE;
      } else if (this.answerType.toUpperCase() === AnswerTypes.DateRange) {
        this.answerHeader = this.constants.DATE_RANGE;
      } else if (this.answerType.toUpperCase() === AnswerTypes.Marking) {
        this.answerHeader = this.constants.MARKING;
      } else if (this.answerType.toUpperCase() === AnswerTypes.FreeText) {
        this.answerHeader = this.constants.FREE_TEXT;
      } else {
        this.answerHeader = '';
      }
    }
    this.setSourceRecordTypes();
    //this._commonService.getDigitalData().subscribe(res => {
    //    const digitalOffersList = [];
    //    res.forEach(code => {
    //        code.DemoOfferCodes.forEach(offer => {
    //            digitalOffersList.push(offer);
    //        });
    //    });

    //    const uniqueOffers = digitalOffersList.filter((elem, index, item) => item.indexOf(elem) === index);
    //    this.digitalOffers = uniqueOffers;
    //});
  }

  setInitialData() {
    this.scheduleChanged = false;
    this.isMaxDateChanged = false;
    this.isMinDateChanged = false;
    this.demoOfferChanged = false;
    this.isValidSCHdate = true;
    this.isValidMinDate = true;
    this.isValidMaxDate = true;
    this.selectedScheduleDate = this.selectedDate;
    if (this.answerType.toUpperCase() === AnswerTypes.DateRange) {
      const myDate = new Date();
      const editDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
      const minDate = this.formatDate(editDate);
      const maxDate = this.selectedDate;
      this.selectedDemoOffer = new DemoOfferDetails(this.questionTabDetails.DemoCode.Code, null, this.selectedScheduleDate, null, null, 1, this.applicationStatus.Draft, null,
        null, null, minDate, maxDate, null, null, null, this.selectedSourceType, '', this.userDetails.username, null, new Date(), null, 1, null, null, null, null);
    } else {
      this.selectedDemoOffer = new DemoOfferDetails(this.questionTabDetails.DemoCode.Code, null, this.selectedScheduleDate, null, null, 1, this.applicationStatus.Draft, null,
        null, null, null, null, null, null, null, this.selectedSourceType, '', this.userDetails.username, null, new Date(), null, 1, null, null, null, null);
    }
  }

  setSourceRecordTypes() {
    const demoCodeDetails = this.questionTabDetails.DemoCode;
    this.recordTypes = this.constants.RECORD_TYPES;
    if (demoCodeDetails.IsCDBModel) {
      this.sourceTypes = this.constants.CDB_SOURCE_TYPES;
      this.selectedSourceType = 'D';
    } else {
      this.sourceTypes = this.constants.OTHER_SOURCE_TYPES;
    }
  }

  isDemoCodeNotPending(): boolean {
    return !(this.demoCodeStatus === ApplicationStatus.Pending);
  }

  // On Model Change events
  onOtherFieldsChange(event) {
    this.demoOfferChanged = true;
    if (this.selectedDemoOffer.PremiumOffer === 'null') {
      this.selectedDemoOffer.PremiumOffer = null;
    }
    if (this.selectedDemoOffer.DigitalOffer === 'null') {
      this.selectedDemoOffer.DigitalOffer = null;
    }
  }

  onDemoOfferCodeChange(event) {
    if (event !== null) {
      if (event.trim() !== '') {
        this.validationMsg = 'Validating DemoOfferCode....'
        this.validateDemoOffer = true;
        this.progressBar.open();
        this.inProgress = true;
        this.demoOfferChanged = true;
        this.duplicateDemoOfferCode = false;
        this._questionService.checkCodeIsUnique(event, 'DemoOfferCode')
          .subscribe(res => {
            this.validateDemoOffer = false;
            setTimeout(() => {
              this.progressBar.close();
            }, 1000);
            if (!res.Status) {
              this.duplicateDemoOfferCodeMsg = res.BusinessMessage;
              this.duplicateDemoOfferCode = true;
            }
            this.inProgress = false;
          }, error => {
            setTimeout(() => { this.validateDemoOffer = false; this.progressBar.close(); }, 1000);
          });
      }
    }
  }

  onScheduleDateChange(event) {
    if (event.value.trim() !== '') {
      this.isValidSCHdate = event.valid;
      if (this.isValidSCHdate) {
        this.selectedDemoOffer.ScheduleDate = event.value;
        this.scheduleChanged = true;
      } else {
        this.isValidSCHdate = false;
      }
    }
  }

  onMinDateChange(event) {
    if (event.value.trim() !== '') {
      this.isValidMinDate = event.valid;
      if (this.isValidMinDate) {
        this.selectedDemoOffer.MinDate = event.value;
        this.isMinDateChanged = true;
        this.demoOfferChanged = true;
      } else {
        this.isValidMinDate = false;
      }
    }
  }

  onMaxDateChange(event) {
    if (event.value.trim() !== '') {
      this.isValidMaxDate = event.valid;
      if (this.isValidMaxDate) {
        this.selectedDemoOffer.MaxDate = event.value;
        this.isMaxDateChanged = true;
        this.demoOfferChanged = true;
      } else {
        this.isValidMaxDate = false;
      }
    }
  }

  validateMinDateRange() {
    let minDate;
    let maxDate;
    // If date is changed, format will be 'mm-dd-yyyy' which can be used directly. Else,format will be 'day:01,month:10,year:2017' which needs to be changed to 'mm-dd-yyyy' format.
    if (this.isMinDateChanged) {
      minDate = new Date(this.selectedDemoOffer.MinDate);
    } else {
      minDate = this.changeFromDatePicker(this.selectedDemoOffer.MinDate);
    }
    if (this.isMaxDateChanged) {
      maxDate = new Date(this.selectedDemoOffer.MaxDate);
    } else {
      maxDate = this.changeFromDatePicker(this.selectedDemoOffer.MaxDate);
    }
    if (minDate >= maxDate) {
      this.showValidationMessage('Min Date should be lesser than Max date');
      return true;
    } else {
      return false;
    }
  }

  // Changes Date format from 'day:01,month:10,year:2017' to javascript date format
  changeFromDatePicker(dpDate): Date {
    const changedDate = dpDate.month + '/' + dpDate.day + '/' + dpDate.year;
    const dateChanged = new Date(changedDate);
    return dateChanged;
  }

  // To validate empty dates
  checkEmpty(ev, datetype) {
    if (ev.formatted.trim() === '') {
      if (datetype === 'schDate') {
        this.isValidSCHdate = false;
      } else if (datetype === 'minDate') {
        this.isValidMinDate = false;
      } else {
        this.isValidMaxDate = false;
      }
    }
  }

  onDisplayTextChange(event) {
    this.selectedDemoOffer.DisplayText = event.target.value;
    this.demoOfferChanged = true;
  }

  // To check whether offer is chained already
  onOfferLinkage(linkedOffer) {
    if (!this.disableLinking) {
      if ((this.answerType.toUpperCase() === AnswerTypes.SingleOption) && (this.chainOffers.length !== 0) && (!this.isAddDemoOffer)) {
        if (linkedOffer !== '') {
          const FC = this.chainOffers.ForcedChainOffers;
          const CC = this.chainOffers.ChoiceChainOffers;
          const chainedOffers = FC.concat(CC);
          const cannotChain = chainedOffers.findIndex(off => off.ParentDemoOfferCode.toUpperCase() === this.selectedDemoOffer.DemoOfferCode.toUpperCase()) !== -1;
          if (cannotChain) {
            this.digitalLinkError = 'Demo Offer ' + this.selectedDemoOffer.DemoOfferCode + ' has an active Chain offer.Remove the Chain to Link Digital offer';
            this.selectedDemoOffer.DigitalOffer = null;
            this.disableLinking = true;
          }
        }
      }
    }
  }

  // Validates for empty fields
  validateDemoOfferFields() {

    // clicked save directly on blur
    if (this.inProgress) {
      return false;
    }
    // duplicate errors
    if (this.duplicateDemoOfferCode) {
      this.showValidationMessage(this.duplicateDemoOfferCodeMsg);
      return false;
    }

    // empty check
    if (this.validateValue(this.selectedDemoOffer.DemoOfferCode)) {
      this.showValidationMessage('Demo Offer Code cannot be empty');
      return false;
    } else if (this.selectedDemoOffer.DemoOfferCode.trim().length !== 4) {
      this.showValidationMessage(this.constants.MSG_DIG_DEMO_OFFER);
      return false;
    } else if (this.validateValue(this.selectedDemoOffer.SourceType)) {
      this.showValidationMessage('Source Type cannot be empty');
      return false;
    } else if (this.validateValue(this.selectedDemoOffer.RecordType)) {
      this.showValidationMessage('Record Type cannot be empty');
      return false;
    }
   
    else if (this.answerType.toUpperCase() === AnswerTypes.Numeric) {
      if ((this.selectedDemoOffer.MinValue === null) || (this.selectedDemoOffer.MinValue === undefined)) {
        this.showValidationMessage('Minimum Value is required. ');
        return false;
      } else if (Number(this.selectedDemoOffer.MinValue) < 0) {
        this.showValidationMessage('Minimum selection range should be greater than 0. ');
        return false;
      } else if ((this.selectedDemoOffer.MaxValue === null) || (this.selectedDemoOffer.MaxValue === undefined)) {
        this.showValidationMessage('Maximum Value is required. ');
        return false;
      } else if ((Number(this.selectedDemoOffer.MaxValue) < 0) || (Number(this.selectedDemoOffer.MaxValue) <= (Number(this.selectedDemoOffer.MinValue)))) {
        this.showValidationMessage('Maximum selection range should be greater than 0 and should be greater than Minimum Range. ');
        return false;
      } else if ((this.selectedDemoOffer.Interval === null) || (this.selectedDemoOffer.Interval === undefined)) {
        this.showValidationMessage('Slider Interval is required. ');
        return false;
      } else if ((Number(this.selectedDemoOffer.Interval)) <= 0) {
        this.showValidationMessage('Slider Interval cannot be less than or equal to 0. ');
        return false;
      } else if ((Number(this.selectedDemoOffer.Interval)) > (Number(this.selectedDemoOffer.MaxValue))) {
        this.showValidationMessage('Slider Interval cannot be greater than Maximum selection range. ');
        return false;
      }
    }

    if (this.selectedDemoOffer.DigitalOffer != null) {
      var magchannelexists: boolean = true;
      let magazineChannel: any[] = this.questionTabDetails.Magazine;
      if (magazineChannel.length > 0) {
        var magchannelAssociation: any[] = this.questionTabDetails.Magazine.filter(x => x.DemoOfferCode == this.selectedDemoOffer.DemoOfferCode);
        if (magchannelAssociation.length > 0) {
          var magdata: any[] = magchannelAssociation[0].DemoOfferChannel;
          var digitalMagazines: any[] = this.filteredDigitalDemoOffers.filter(x => x.DemoOfferCode == this.selectedDemoOffer.DigitalOffer)[0].MagCode;
          if (magdata != null && magdata.length > 0) {
            magchannelexists = false;
            var mag: any[] = Array.from(new Set(magdata.map(x => x.Mag_Code)));
            for (var i = 0; i < mag.length; i++) {
              magchannelexists = digitalMagazines.includes(mag[i]);
              if (magchannelexists == true)
                break;
            }
          }
          if (magchannelexists == false) {
            this.showValidationMessage('Demo Offer <' + this.selectedDemoOffer.DemoOfferCode + '> is associated with the magazine(s) <' + mag + '> which are not available in Digital Offer <' + this.selectedDemoOffer.DigitalOffer + '>.');
            return false;
          }
        }
      }
    }

    if (!this.isValidSCHdate) {
      this.showValidationMessage('Please enter a valid schedule date');
      return false;
    }
    if (new Date(this.selectedDemoOffer.ScheduleDate).getTime() <= new Date().getTime()) {
      this.showValidationMessage('Schedule date should be greater than current date');
      return false;
    }
    if (!this.scheduleChanged) {
      if (this.ValidateScheduleDate(this.selectedDemoOffer.ScheduleDate)) {
        this.showValidationMessage(this.constants.MSG_DEMOOFFER_SCHEDULE);
        return false;
      }
    }
    // If no Changes
    if (!this.demoOfferChanged && !this.scheduleChanged) {
      this.showValidationMessage(this.constants.MSG_DEMO_OFFER_UNMODIFIED_SAVE);
      return false;
    }
    if (this.answerType.toUpperCase() === AnswerTypes.DateRange) {
      if (!this.isValidMinDate) {
        this.showValidationMessage('Please enter a valid Minimum date');
        return false;
      } else if (!this.isValidMaxDate) {
        this.showValidationMessage('Please enter a valid Maximum date');
        return false;
      }
      if (this.validateMinDateRange()) {
        return false;
      }

      // After all validations , change Date Picker format date to system format date.
      if (!this.isMinDateChanged) {
        this.changeDateFormats('minDate', this.selectedDemoOffer.MinDate);
      }
      if (!this.isMaxDateChanged) {
        this.changeDateFormats('maxDate', this.selectedDemoOffer.MaxDate);
      }
    }

    // Change date format if not changed
    if (!this.scheduleChanged) {
      this.changeDateFormats('schDate', this.selectedDemoOffer.ScheduleDate);
      return true;
    } else {
      return true;
    }

  }

  // Validates schedule date if format is in mydatepicker format
  ValidateScheduleDate(schDate) {
    const changedDate = schDate.year + '/' + schDate.month + '/' + schDate.day;
    let schdleDate = new Date(changedDate);
    let currentDate = new Date();
    if (schdleDate <= currentDate) {
      return true;
    } else {
      return false;
    }
  }

  // Shows Validation Messages
  showValidationMessage(errMsg: string): void {
    this.modalValidate.open();
    this.modalMessage = errMsg;
    setTimeout(() => {
      this.modalValidate.close();
    }, 2500);
  }

  validateValue(value) {
    if (value === null || value.toString().trim() === '') {
      return true;
    }
    return false;
  }

  // Saves DemoOffer
  saveDemoOfferDetails() {
    if (this.validateDemoOfferFields()) {
      this.progressBar.open();
      // this.changeDateFormats('schDate', this.selectedDemoOffer.ScheduleDate);
      const demoOfferRequest = new DemoOfferRequest(this.selectedDemoOffer, this.isAddDemoOffer, this.userDetails.username, this.demoOfferChanged, this.scheduleChanged, this.choicesChanged);
      this._answerService.upsertDemoOfferDetails(demoOfferRequest).subscribe(result => {
        const response = result.Response;
        setTimeout(() => {
          this.progressBar.close();
        });
        if (response.Status) {
          this.modalSaveSuccess.open();
          this.demoOfferDetails = result.DemoOfferDetails;
          this.updatedDemoOffers.emit(this.demoOfferDetails);
          this.updateMagazines.emit(result.MagazineDetails);
          this.modalMessage = response.BusinessMessage;
          this.Magazines = result.MagazineDetails;
          setTimeout(() => {
            this.modalSaveSuccess.close();
            this.modelNonChoiceAnswer.close();
            setTimeout(() => {
              this.setInitialData();
            }, 1000);
          }, 2000);
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        const errorMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
        this.showValidationMessage(errorMsg);
      });
    }
  }

  dismissModalAnswer() {
    if (this.demoOfferChanged || this.scheduleChanged) {
      const subscrip: Subscription = this.unSavedChangesResponse.subscribe((val) => {
        subscrip.unsubscribe();
        if (val) {
          this.modelNonChoiceAnswer.close();
        }
      });
      this.modelUnSavedChanges.open();
    } else if (!this.inProgress) {
      this.modelNonChoiceAnswer.close();
    }
  }

  allowChangesLost() {
    this.modelUnSavedChanges.close();
    this.unSavedChangesResponse.emit(true);
  }

  blockChangesLost() {
    this.modelUnSavedChanges.close();
    this.unSavedChangesResponse.emit(false);
  }

  // Add Demo Offer
  addDemoOffer() {
    this.isAddDemoOffer = true;
    this.duplicateDemoOfferCode = false;
    this.disableLinking = false;
    this.setInitialData();
    this._commonService.GetDigitalDemoFilteredByMagazine().subscribe(res => {
      this.filteredDigitalDemoOffers = res;
    });

    this.modelNonChoiceAnswer.open();
  }

  // Edit Demo Offer
  editDemoOffer(demoOffer: DemoOfferDetails) {
    this.isAddDemoOffer = false;
    this.duplicateDemoOfferCode = false;
    this.scheduleChanged = false;
    this.isMaxDateChanged = false;
    this.isMinDateChanged = false;
    this.demoOfferChanged = false;
    this.disableLinking = false;
    this.selectedScheduleDate = this.formatDate(demoOffer.ScheduleDate);
    this.selectedDemoOffer = JSON.parse(JSON.stringify(demoOffer));
    this.selectedDemoOffer.ScheduleDate = this.selectedScheduleDate;
    this.isValidSCHdate = true;
    if (this.answerType.toUpperCase() === AnswerTypes.DateRange) {
      const minDate = this.formatDate(this.selectedDemoOffer.MinDate);
      const maxDate = this.formatDate(this.selectedDemoOffer.MaxDate);
      this.selectedDemoOffer.MinDate = minDate;
      this.selectedDemoOffer.MaxDate = maxDate;
      this.isValidMinDate = true;
      this.isValidMaxDate = true;
    }
    this.onOfferLinkage(this.selectedDemoOffer.DemoOfferCode);
    this._commonService.GetDigitalDemoFilteredByMagazine().subscribe(res => {
      this.filteredDigitalDemoOffers = res;
    });
    this.modelNonChoiceAnswer.open();
  }

  // Formats date from javascript Date format to myDatePicker format (year:2017,month:01,day:01)
  formatDate(scDate): any {
    var parts = scDate.toString().match(/(\d+)/g);
    let myDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const editDate = { year: myDate.getFullYear(), month: myDate.getMonth() + 1, day: myDate.getDate() };
    return editDate;
  }

  // Formats date from  myDatePicker format (year:2017,month:01,day:01) to javascript Date format
  changeDateFormats(dtType, dateToChange) {
    const changedDate = dateToChange.month + '/' + dateToChange.day + '/' + dateToChange.year;
    if (dtType === 'schDate') {
      this.selectedDemoOffer.ScheduleDate = changedDate;
    } else if (dtType === 'minDate') {
      this.selectedDemoOffer.MinDate = changedDate;
    } else {
      this.selectedDemoOffer.MaxDate = changedDate;
    }
  }

  deleteDemoOfferValidate(demoOffer: string) {
    this.demoOfferCode = demoOffer;
    this.canDelete = this.demoOfferDetails.length === 1 ? false : true;
    if (!this.canDelete) {
      this.deleteMessage = 'Demo Offer ' + demoOffer + ' is the only Demo Offer in DemoCode ' + this.questionTabDetails.DemoCode.Code + '. Are you sure want to delete the Demo Offer ' + demoOffer + ' ?';
    } else {
      this.deleteMessage = 'Are you sure want to delete the Demo Offer ' + demoOffer + ' ?';
    }
    this.modalDeleteDemoOffer.open();
  }

  deleteDemoOffer(demoOffer) {
    this.modalDeleteDemoOffer.close();
    this.progressBar.open();
    this.deleteDemoOfferDetail(demoOffer).
      subscribe(response => {
        setTimeout(() => {
          this.progressBar.close();
        }, 1000);
        if (response.Status) {

          this.modalDeleteSuccess.open();
          this.modalMessage = response.BusinessMessage;
          setTimeout(() => {
            this.modalDeleteSuccess.close();
          }, 3000);
          this.demoOfferDetails = this.demoOfferDetails.filter(m => m.DemoOfferCode !== demoOffer);
          //let MagAssociation = this.questionTabDetails.Magazine;
          //MagAssociation = MagAssociation.filter(ma => ma.DemoOfferCode !== demoOffer);
          this.updatedDemoOffers.emit(this.demoOfferDetails);
          this.removeFromOtherTabs(demoOffer);
          this.modelNonChoiceAnswer.close();
          //  this.updateMagazines.emit(MagAssociation);
          this.loadInitalState();
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
      });

  }

  // Opens Recall Offer Modal
  openRecallDemoOffer(offer) {
    this.recalledDemoOffer = offer;
    if (this.answerType.toUpperCase() === AnswerTypes.DateRange) {
      this.recalledMinDate = this.formatDate(this.recalledDemoOffer.MinDate);
      this.recalledMaxDate = this.formatDate(this.recalledDemoOffer.MaxDate);
    }
    this.previousStatus = this.recalledDemoOffer.PreviousStatus;
    this.Magazines = this.questionTabDetails.Magazine;
    this.modalRecallDemoOffer.open();
  }

  //Recall DC status is in Pending
  checkDCStatus() {
    if (this.questionTabDetails.DemoCode.Status === ApplicationStatus.Pending) {
      this.modalRecallConfirmation.open();
      this.recallConfirm = 'The Demo Code ' + this.questionTabDetails.DemoCode.Code + ' whose Demo Offer ' + this.recalledDemoOffer.DemoOfferCode + ' you are trying to recall is also in Pending status.';
    } else {
      this.modalRecallEdit.open();
    }
  }

  // Proceed to recall
  proceedRecall() {
    this.modalRecallConfirmation.close();
    this.recallAndEdit();
  }

  // Deletes Recalled DemoOffer
  recallAndDelete() {
    this.modalRecallDelete.close();
    this.progressBar.open();
    this.recallDelete(this.recalledDemoOffer, this.Magazines, this.isCDBModel)
      .subscribe((data) => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        if (data.Status) {
          this.demoOfferDetails = this.demoOfferDetails.filter(off => off.DemoOfferCode !== this.recalledDemoOffer.DemoOfferCode);
          this.removeFromOtherTabs(this.recalledDemoOffer.DemoOfferCode);
          this.BusinessMessage = data.BusinessMessage;
          this.afterRecall(this.demoOfferDetails);
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        const errorMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
        this.showValidationMessage(errorMsg);
      });
  }

  // Remove Demo offer from Magazines & Chain offers
  removeFromOtherTabs(demoOfferCode) {
    this.chainOffers.ForcedChainOffers = this.chainOffers.ForcedChainOffers.filter(off => off.ParentDemoOfferCode.toUpperCase() !== demoOfferCode.toUpperCase());
    this.chainOffers.ChoiceChainOffers = this.chainOffers.ChoiceChainOffers.filter(off => off.ParentDemoOfferCode.toUpperCase() !== demoOfferCode.toUpperCase());
    this.Magazines = this.Magazines.filter(of => of.DemoOfferCode.toUpperCase() !== demoOfferCode.toUpperCase());
    this.questionTabDetails.Magazine = this.Magazines;
    this.questionTabDetails.ChainOffers = this.chainOffers;
    this.demoCodeDetails.emit(this.questionTabDetails);
  }

  // Recalls and Moves Demo Offer to Editable (DRAFT/ACTIVE-IN EDIT) status
  recallAndEdit() {
    this.modalRecallEdit.close();
    this.progressBar.open();
    this.recallEdit(this.recalledDemoOffer, this.Magazines, this.isCDBModel)
      .subscribe((data) => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        if (data.Status) {
          if (this.questionTabDetails.DemoCode.Status === ApplicationStatus.Pending) {
            this.updateStatusToDraft();
          } else {
            const index = this.demoOfferDetails.findIndex(off => off.DemoOfferCode === this.recalledDemoOffer.DemoOfferCode);
            switch (this.recalledDemoOffer.PreviousStatus.toUpperCase()) {
              case ApplicationStatus.Draft.toUpperCase():
              case ApplicationStatus.Returned.toUpperCase():
                {
                  this.demoOfferDetails[index].Status = ApplicationStatus.Draft;
                  this.demoOfferDetails[index].StatusId = this.getStatusID(ApplicationStatus.Draft);
                  break;
                }
              case ApplicationStatus.Active.toUpperCase():
              case ApplicationStatus.Active_In_Edit.toUpperCase():
                {
                  this.demoOfferDetails[index].Status = ApplicationStatus.Active_In_Edit;
                  this.demoOfferDetails[index].StatusId = this.getStatusID(ApplicationStatus.Active_In_Edit);
                  break;
                }
              default: {
                break;
              }
            }
          }
          this.BusinessMessage = data.BusinessMessage;
          this.afterRecall(this.demoOfferDetails);
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        const errorMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
        this.showValidationMessage(errorMsg);
      });
  }

  // updates statuses to draft if recalled DC is in pending
  updateStatusToDraft() {
    this.demoOfferDetails.forEach(of => {
      of.Status = ApplicationStatus.Draft;
      of.StatusId = this.getStatusID(ApplicationStatus.Draft);
    });
    this.questionTabDetails.DemoCode.StatusId = this.getStatusID(ApplicationStatus.Draft);
    this.updateDCStatus.emit({ 'StatusId': this.questionTabDetails.DemoCode.StatusId, 'StatusType': ApplicationStatus.Draft });
  }

  // Recalls and undo's all changes made to the demo Offer
  recallAndDiscard() {
    this.modalRecallDiscard.close();
    this.progressBar.open();
    this.recallDiscard(this.recalledDemoOffer, this.Magazines, this.isCDBModel)
      .subscribe((data) => {
        this.modalRecallDemoOffer.close();
        setTimeout(() => { this.progressBar.close(); }, 1000);
        if (data.Status) {
          this.modalMessage = data.BusinessMessage;
          this.modalSaveSuccess.open();
          setTimeout(() => {
            this.modalMessage = 'Updating the details';
            this._questionService.ViewDemoCode(this.recalledDemoOffer.DemoCode, this.userDetails.username, this.userDetails.DisplayName).subscribe(result => {
              this.modalSaveSuccess.close();
              this.demoOfferDetails = result.DemoOffers;
              this.demoCodeDetails.emit(result);
            });
          }, 3000);
        } else {
          const myContainer = <HTMLElement>document.querySelector('#errorMsg');
          myContainer.innerHTML = data.BusinessMessage;
          setTimeout(() => { this.modalDiscardError.open(); }, 1500);
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        const errorMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
        this.showValidationMessage(errorMsg);
      });
  }

  // Common -  after recalling
  afterRecall(offerDet) {
    this.modalRecallDemoOffer.close();
    this.updatedDemoOffers.emit(this.demoOfferDetails);
    this.loadInitalState();
    this.modalRecallSuccess.open();
    setTimeout(() => {
      this.modalRecallSuccess.close();
    }, 2000);
  }

  getEditability(status): boolean {
    const notAllowedStatus = [ApplicationStatus.Pending, ApplicationStatus.Approved, ApplicationStatus.Archived];
    return notAllowedStatus.find(s => s.toUpperCase() === status.toUpperCase()) === undefined;
  }

  // Check if demo offer can be archived.
  checkArchival(offer) {
    const chainOffers = this.questionTabDetails.ChainOffers.ForcedChainOffers.filter(r => r.ParentDemoOfferCode === offer.DemoOfferCode).length + this.questionTabDetails.ChainOffers.ChoiceChainOffers.filter(r => r.ParentDemoOfferCode === offer.DemoOfferCode).length;
    const visibleChannels = (this.questionTabDetails.Magazine.filter(r => r.DemoOfferCode === offer.DemoOfferCode)[0].DemoOfferChannel).filter(c => c.IsVisible === true).length;
    if (chainOffers > 0 || visibleChannels > 0) {
      this.modalMessage = 'Demo Offer "' + offer.DemoOfferCode + '" cannot be archived as there are either active channels or Chain offers associated to it. Please remove the associations first';
      this.modalValidate.open();
      setTimeout(() => {
        this.modalValidate.close();
      }, 2000);
    } else {
      this.archiveoffer = offer;
      this.modalArchive.open();

    }
  }

  archive() {
    this.progressBar.open();
    const obj: any = {};
    obj.DemoOfferCode = this.archiveoffer.DemoOfferCode;
    obj.UserId = this.userDetails.username;
    this.archiveOffer(obj).subscribe(result => {
      setTimeout(() => {
        this.progressBar.close();
      }, 1000);
      if (result.Status) {
        this.modalArchive.close();
        this.modalMessage = result.BusinessMessage;
        this.modalSaveSuccess.open();
        setTimeout(() => {
          this.modalSaveSuccess.close();
        }, 2000);
        const index = this.demoOfferDetails.findIndex(off => off.DemoOfferCode === obj.DemoOfferCode);
        this.demoOfferDetails[index].Status = ApplicationStatus.Archived;
        this.demoOfferDetails[index].StatusId = this.getStatusID(ApplicationStatus.Archived);
        this.updatedDemoOffers.emit(this.demoOfferDetails);
      }
    }, error => {
      setTimeout(() => { this.progressBar.close(); }, 1000);
    });
  }

  getStatusID(status): number {
    let statusID;
    this.Status.forEach(st => {
      if (st.StatusType.toUpperCase() === status.toUpperCase()) {
        statusID = st.StatusId;
      }
    });
    return statusID;
  }

  clearPinnedFilter() {
    this.clearFilter.emit();
  }

  SetPinnedFilter() {
    const filterDemoOffer = this.demoOfferDetails.filter(m => m.DemoOfferCode.toUpperCase() === this.freeTextSearch.toUpperCase());
    if (this.freeTextSearch !== '' && filterDemoOffer.length === 1) {
      sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.freeTextSearch));
      this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    }
    if (this.freeTextSearch === '') {
      sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.freeTextSearch));
      this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    }

  }

  //restrictSpecialCharacters(event) {
  //    var k = event.charCode;
  //    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  //}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

