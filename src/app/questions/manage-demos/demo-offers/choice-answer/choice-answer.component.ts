import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Rx';
import { Constants, DemoOfferDetails, DemoChoiceDetails, DemoOfferRequest, ApplicationStatus, AnswerTypes } from '../../../../_models/index';
import { AnswerService, CommonService, QuestionService, SharedService } from '../../../../_services/index';
import { DemoOfferActionsComponent } from '../demo-offer-actions.component';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-choice-answer',
  templateUrl: './choice-answer.component.html',
  styleUrls: ['./choice-answer.component.css']
})
export class ChoiceAnswerComponent extends DemoOfferActionsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() questionTabDetails;
  @Input() filteredDemoOffer;
  @Output() updatedDemoOffers = new EventEmitter<any>();
  @Output() updateMagazines = new EventEmitter<any>();
  @Output() updateDCStatus = new EventEmitter<any>();
  @Output() demoCodeDetails = new EventEmitter<any>();

  @Output() clearFilter = new EventEmitter<any>();
  paramValue;
  constants = Constants;
  applicationStatus = ApplicationStatus;
  answerTypeConst = AnswerTypes;
  userDetails;
  isAddDemoOffer = false;
  demoOfferDetails: DemoOfferDetails[] = [];
  selectedDemoOffer: DemoOfferDetails;
  recalledDemoOffer: DemoOfferDetails;
  digitalOffers: any = [];
  lstDemoChoices: DemoChoiceDetails[] = [];
  filteredDemoChoices: any = [];
  premiumTypes = this.constants.PREMIUM_TYPES;
  controlTypes = this.constants.CONTROL_TYPES;
  sourceTypes: any = [];
  recordTypes: any = [];
  selectedSourceType = '';
  freeTextSearch = '';
  demoOfferCode: string;
  selectedPremiumOffer = 'Select';
  selectedDigitalOffer = 'Select';
  demoOfferStatus: string;
  selectedDemoOfferCode: string;
  selectedControlType: string;
  selectedScheduleDate = new Date();
  answerType: string;
  answerHeader: string;
  exisitingDemoChoiceMsg: string;
  response: boolean;
  BusinessMessage: string;
  Magazines: any;
  chainOffers: any;
  previousStatus: string;
  Status: any;
  disableLinking = false;
  forcedChainDetails: any = [];
  choiceChainDetails: any = [];
  choiceToOfferChainDetails: any = [];
  currentChoice: any;
  deleteForcedLinkChoiceMsg = '';
  deleteAlertMsgForChoiceToOfferLink = '';
  isCDBModel: boolean;
  // track changes
  scheduleChanged = false;
  choicesChanged = false;
  demoOfferChanged = false;
  choiceTextChanged: any = [];
  answerTypeErrorMsg = '';
  answerTypeError = false;
  demoChoiceErrors: ChoiceErrorList[] = [];
  demoChoiceError: ChoiceErrorList;
  modalMessage = '';
  hideElements: any = {};
  inProgress = false;
  canDelete: boolean;
  deleteMessage: string;
  archiveoffer: any;
  demoOfferCount: string;
  recallConfirm: string;
  demoCodeStatus: string;
  digitalLinkError: string;
  unSavedChangesResponse: EventEmitter<boolean> = new EventEmitter();
  validateDemoOfferCode: boolean;
  validationMsg: string;
  // Date Picker Configuration
  isValidDate = true;
  myDate = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
  selectedDate: any = { year: this.myDate.getFullYear(), month: this.myDate.getMonth() + 1, day: this.myDate.getDate() };
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showTodayBtn: false,
    minYear: 2000,
    maxYear: 3000
  };
  // modals
  @ViewChild('modelEditAnswer')
  modelEditAnswer: BsModalComponent;
  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;
  @ViewChild('modalSaveSuccess')
  modalSaveSuccess: BsModalComponent;
  @ViewChild('modelIsDirty')
  modelIsDirty: BsModalComponent;
  @ViewChild('modalRecallConfirmation')
  modalRecallConfirmation: BsModalComponent;
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
  @ViewChild('modalDeleteDemoOffer')
  modalDeleteDemoOffer: BsModalComponent;
  @ViewChild('modalDeleteSuccess')
  modalDeleteSuccess: BsModalComponent;
  @ViewChild('modalArchive')
  modalArchive: BsModalComponent;
  @ViewChild('modelForcedChainDetails')
  modelForcedChainDetails: BsModalComponent;
  @ViewChild('modelChoiceChainDetails')
  modelChoiceChainDetails: BsModalComponent;
  @ViewChild('modalDiscardError')
  modalDiscardError: BsModalComponent;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  @ViewChild('modelUnSavedChanges')
  modelUnSavedChanges: BsModalComponent;
  private unsubscribe: Subject<void> = new Subject<void>();


  filteredDigitalDemoOffers: any[];
  selectedMagazine: string = "";
  selectedDigitalDemoOfferCode: string;


  constructor(public _router: Router, public _route: ActivatedRoute, public _commonService: CommonService, public _answerService: AnswerService, public _questionService: QuestionService, public _sharedSVC: SharedService) {
    // Super is used to extend base class constructor properties
    super(_router, _route, _commonService, _answerService, _questionService);

    this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(demoOffer => {
      this.filteredDemoOffer = demoOffer;
      this.freeTextSearch = this.filteredDemoOffer;
    });
  }

  ngOnInit() {
    this.loadInitalState();
    this.selectedDemoOffer = new DemoOfferDetails(this.questionTabDetails.DemoCode.Code, null, this.selectedScheduleDate, null, null, 1, this.applicationStatus.Draft, null,
      null, null, null, null, null, null, null, this.selectedSourceType, '', this.userDetails.username, null, new Date(), null, 1, null, null, null);

  }

  ngOnChanges(changes: SimpleChanges) {
    const questionTabDetails: SimpleChange = changes.questionTabDetails;
    this.loadInitalState();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // To get the initial data for the answer tab screen
  loadInitalState() {
    this.selectedScheduleDate = this.selectedDate;
    this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
    this.Status = JSON.parse(localStorage.getItem(this.constants.LS_STATUS_METADATA));
    this.isCDBModel = this.questionTabDetails.DemoCode.IsCDBModel;
    this.selectedDemoOffer = JSON.parse(sessionStorage.getItem(this.constants.LS_FILTRED_DEMO_OFFER));
    this.demoOfferCount = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_OFFER_COUNT));
    this.freeTextSearch = this.filteredDemoOffer;
    this._route.params.subscribe(params => {
      this.paramValue = params['action'];

      if (this.paramValue.toLowerCase() === this.constants.MSG_ROUTE_EDIT) {
        this.demoOfferDetails = this.questionTabDetails.DemoOffers;
        this.Magazines = this.questionTabDetails.Magazine;
        this.chainOffers = this.questionTabDetails.ChainOffers;
        this.demoCodeStatus = this.questionTabDetails.DemoCode.Status;
      } else {
        this.demoOfferDetails = this.questionTabDetails.DemoOffers.length === 0 ? [] : this.questionTabDetails.DemoOffers;
        this.Magazines = this.questionTabDetails.Magazine.length === 0 ? [] : this.questionTabDetails.Magazine;
        this.chainOffers = this.questionTabDetails.ChainOffers.length === 0 ? [] : this.questionTabDetails.ChainOffers;
      }
    });

    this._questionService.getDemoChoices(this.questionTabDetails.DemoCode.Code).subscribe(res => {
      this.lstDemoChoices = res;
      this.setInitialData();
    });
    this.answerType = this.questionTabDetails.DemoCode.AnswerType;
    if (this.answerType.toUpperCase() === AnswerTypes.SingleOption) {
      this.answerHeader = this.constants.SINGLE_OPTION;
    } else if (this.answerType.toUpperCase() === AnswerTypes.MultipleOption) {
      this.answerHeader = this.constants.MULTIPLE_OPTION;
    } else if (this.answerType.toUpperCase() === AnswerTypes.Optin_OptOut) {
      this.answerHeader = this.constants.OPT_IN_OUT;
    }
    this.setSourceRecordTypes();
  }

  // To set the initial demo offer and demo choice object
  setInitialData() {
    this.scheduleChanged = false;
    this.choicesChanged = false;
    this.demoOfferChanged = false;
    this.isValidDate = true;
    let demoChoices: DemoChoiceDetails[] = [];
    let demoChoiceObj;
    if (this.answerType.toUpperCase() === AnswerTypes.Optin_OptOut) {
      if (this.lstDemoChoices.length > 0) {
        demoChoices = JSON.parse(JSON.stringify(this.lstDemoChoices));
      } else {
        demoChoiceObj = new DemoChoiceDetails(0, this.questionTabDetails.DemoCode.Code, 'Y', 'Yes', 0);
        demoChoices.push(demoChoiceObj);
        demoChoiceObj = new DemoChoiceDetails(0, this.questionTabDetails.DemoCode.Code, 'N', 'No', 0);
        demoChoices.push(demoChoiceObj);
      }
    } else {
      demoChoiceObj = new DemoChoiceDetails(0, this.questionTabDetails.DemoCode.Code, '', '', 0);
      demoChoices.push(demoChoiceObj);
    }
    this.selectedScheduleDate = this.selectedDate;
    this.selectedDemoOffer = new DemoOfferDetails(this.questionTabDetails.DemoCode.Code, null, this.selectedScheduleDate, null, null, 1, this.applicationStatus.Draft, null,
      null, null, null, null, null, null, null, this.selectedSourceType, '', this.userDetails.username, null, new Date(), null, 1, null, null, demoChoices);
  }

  // To set the Source type and Record type values
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

  // To add new demo offer
  addDemoOffer() {
    this.isAddDemoOffer = true;
    this.setInitialData();
    this.answerTypeError = false;
    this.disableLinking = false;
    this.demoChoiceErrors = [];
    this.choiceTextChanged = [];
    this.filteredDemoChoices = [];

    this._commonService.GetDigitalDemoFilteredByMagazine().subscribe(res => {
      this.filteredDigitalDemoOffers = res;
    });

    this.modelEditAnswer.open();
  }

  // To edit existing demo offer
  editDemoOffer(demoOffer: DemoOfferDetails) {
    this.isAddDemoOffer = false;
    this.scheduleChanged = false;
    this.choicesChanged = false;
    this.demoOfferChanged = false;
    this.answerTypeError = false;
    this.disableLinking = false;
    this.demoChoiceErrors = [];
    this.choiceTextChanged = [];
    this.filteredDemoChoices = [];
    this.selectedScheduleDate = this.formatDate(demoOffer.ScheduleDate);
    this.selectedDemoOffer = JSON.parse(JSON.stringify(demoOffer));
    this.selectedDemoOffer.ScheduleDate = this.selectedScheduleDate;
    this.isValidDate = true;
    this.onOfferLinkage(this.selectedDemoOffer.DemoOfferCode);

    this._commonService.GetDigitalDemoFilteredByMagazine().subscribe(res => {
      this.filteredDigitalDemoOffers = res;
    });

    this.modelEditAnswer.open();
  }

  // Formats date from javascript Date format to myDatePicker format (year:2017,month:01,day:01)
  formatDate(scDate): any {
    var parts = scDate.toString().match(/(\d+)/g);
    let myDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const editDate = { year: myDate.getFullYear(), month: myDate.getMonth() + 1, day: myDate.getDate() };
    return editDate;
  }

  // Formats date from  myDatePicker format (year:2017,month:01,day:01) to javascript Date format
  changeDateFormats(dateToChange) {
    const changedDate = dateToChange.month + '/' + dateToChange.day + '/' + dateToChange.year;
    this.selectedDemoOffer.ScheduleDate = changedDate;
  }

  // To display confirmation message on demo offer delete
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

  // To delete demo offer after user confirmation
  deleteDemoOffer(demoOffer) {
    this.modalDeleteDemoOffer.close();
    this.progressBar.open();
    this.deleteDemoOfferDetail(demoOffer).
      subscribe(response => {
        if (response.Status) {
          setTimeout(() => {
            this.progressBar.close();
          }, 1000);
          this.modalDeleteSuccess.open();
          this.modalMessage = response.BusinessMessage;
          setTimeout(() => {
            this.modalDeleteSuccess.close();
          }, 3000);
          this.demoOfferDetails = this.demoOfferDetails.filter(m => m.DemoOfferCode !== demoOffer);
          //   let MagAssociation = this.questionTabDetails.Magazine;
          // MagAssociation = MagAssociation.filter(ma => ma.DemoOfferCode !== demoOffer);
          this.updatedDemoOffers.emit(this.demoOfferDetails);
          // this.updateMagazines.emit(MagAssociation);
          this.removeFromOtherTabs(demoOffer);
          this.modelEditAnswer.close();

          this.loadInitalState();
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
      });

  }

  // To add new demo choice to demo offer
  addNewDemoChoice() {
    if (this.selectedDemoOffer.DemoOffer_Choice.length === 1 &&
      this.selectedDemoOffer.DemoOffer_Choice[0].DemoChoiceId > 0 && !this.isAddDemoOffer &&
      (this.questionTabDetails.DemoCode.AnswerType.toUpperCase() == AnswerTypes.SingleOption ||
        this.questionTabDetails.DemoCode.AnswerType.toUpperCase() == AnswerTypes.MultipleOption)) {
      this.progressBar.open();
      this._answerService.validateDemoChoiceDelete(this.selectedDemoOffer.DemoOffer_Choice[0].DemoChoiceId,
        this.selectedDemoOffer.DemoOfferCode).subscribe((response) => {
          this.forcedChainDetails = response.ForcedLinkOffers;
          this.choiceToOfferChainDetails = response.ChoiceToOfferLinks;
          setTimeout(() => { this.progressBar.close(); }, 1000);
          if (this.forcedChainDetails.length > 0 || this.choiceToOfferChainDetails.length > 0) {
            if (this.forcedChainDetails.length > 0) {
              this.deleteForcedLinkChoiceMsg = this.constants.MSG_ADD_DEMO_CHOICE_WARNING;
            }
            if (this.choiceToOfferChainDetails.length > 0) {
              this.deleteAlertMsgForChoiceToOfferLink = this.constants.MSG_ADD_DEMO_CHOICE_CHOICETOOFFER_WARNING;
            }
            setTimeout(() => { this.modelForcedChainDetails.open(); }, 1500);
          } else {
            this.addNewDemoChoiceData();
          }
        }, error => {
          setTimeout(() => { this.progressBar.close(); }, 1000);
          const errorMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
          this.showValidationMessage(errorMsg);
        });
    } else {
      this.addNewDemoChoiceData();
    }
  }

  // add demo choice initial data to selected demo offer
  addNewDemoChoiceData() {
    this.choicesChanged = true;
    const demoChoiceObj = new DemoChoiceDetails(0, this.questionTabDetails.DemoCode.Code, '', '', 0);
    this.selectedDemoOffer.DemoOffer_Choice.push(demoChoiceObj);
    Object.keys(this.selectedDemoOffer.DemoOffer_Choice).forEach((h, i) => {
      if (i === this.selectedDemoOffer.DemoOffer_Choice.length - 1) {
        this.hideElements[i] = true;
      }
    });
  }

  // To delete demo choice from demo offer
  deleteDemoChoice(choice: DemoChoiceDetails, ind: number) {
    this.currentChoice = choice;
    const duplicateChoiceCode = Object.assign([], this.selectedDemoOffer.DemoOffer_Choice).filter(item => item.DemoChoiceCode.toUpperCase() === choice.DemoChoiceCode.toUpperCase());
    if (choice.DemoChoiceId > 0 && duplicateChoiceCode.length <= 1) {
      this._answerService.validateDemoChoiceDelete(choice.DemoChoiceId, this.selectedDemoOffer.DemoOfferCode).subscribe((response) => {
        this.forcedChainDetails = response.ForcedLinkOffers;
        this.choiceChainDetails = response.ChoiceLinkOffers;
        this.choiceToOfferChainDetails = response.ChoiceToOfferLinks;
        if (this.forcedChainDetails.length > 0 || this.choiceToOfferChainDetails.length > 0) {
          if (this.forcedChainDetails.length > 0) {
            this.deleteForcedLinkChoiceMsg = this.constants.MSG_DELETE_DEMO_CHOICE_WARNING;
          }
          if (this.choiceToOfferChainDetails.length > 0) {
            this.deleteAlertMsgForChoiceToOfferLink = this.constants.MSG_DELETE_DEMO_CHOICE_CHOICETOOFFER_WARNING
          }
          this.modelForcedChainDetails.open();
        } else if (this.choiceChainDetails.length > 0) {
          this.modelChoiceChainDetails.open();
          // setTimeout(() => { this.modelChoiceChainDetails.close(); this.modelEditAnswer.visible = true; }, 2000);
        } else {
          const index = this.selectedDemoOffer.DemoOffer_Choice.indexOf(choice, 0);
          if (index > -1) {
            this.selectedDemoOffer.DemoOffer_Choice.splice(index, 1);
            this.choicesChanged = true;
          }
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
        const errorMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
        this.showValidationMessage(errorMsg);
      });
    } else {
      const index = this.selectedDemoOffer.DemoOffer_Choice.indexOf(choice, 0);
      if (index > -1) {
        this.selectedDemoOffer.DemoOffer_Choice.splice(index, 1);
        this.choicesChanged = true;
      }
    }
    this.removeFromErrorList(ind, true);
  }

  // To show the list of demo choices in selected demo code when user starts type
  showDemoChoiceContents(choice: DemoChoiceDetails, index: number, event: any) {
    Object.keys(this.selectedDemoOffer.DemoOffer_Choice).forEach((h, i) => {
      this.hideElements[i] = true;
    });

    this.hideElements[index] = false;
    if (!event.target.value) {
      this.filteredDemoChoices = [];
    } else {
      this.filteredDemoChoices = Object.assign([], this.lstDemoChoices).filter(item => item.DemoChoiceText.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
    }
  }

  // To load the demo choice after user selects from the result list
  loadSelectedDemoChoice(choice: DemoChoiceDetails, index: number) {
    this.selectedDemoOffer.DemoOffer_Choice[index] = JSON.parse(JSON.stringify(choice));
    Object.keys(this.selectedDemoOffer.DemoOffer_Choice).forEach((h, i) => {
      this.hideElements[i] = true;
    });
    this.filteredDemoChoices = [];
    this.removeFromErrorList(index, false);
    this.choiceTextChanged[index] = false;
  }

  // On schedule date change - event triggered by myDatePicker which contains properties (valid,value and format)
  validateDate(ev) {
    this.isValidDate = ev.valid;
    if (this.isValidDate) {
      this.selectedScheduleDate = ev.value;
      this.selectedDemoOffer.ScheduleDate = ev.value;
      this.scheduleChanged = true;
    } else {
      this.isValidDate = false;
    }
  }

  // On other fields change
  onOtherFieldsChange(event) {
    this.demoOfferChanged = true;

    if (this.selectedDemoOffer.PremiumOffer === 'null') {
      this.selectedDemoOffer.PremiumOffer = null;
    }
    if (this.selectedDemoOffer.DigitalOffer === 'null') {
      this.selectedDemoOffer.DigitalOffer = null;
    }
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
            this.digitalLinkError = 'Demo Offer ' + this.selectedDemoOffer.DemoOfferCode + ' has an active Chain offer.Remove the Chain to Link Digital offer.';
            this.selectedDemoOffer.DigitalOffer = null;

            this.disableLinking = true;
          }
        }
      }
    }
  }

  // To validate demo offer code unique on demo offer code change
  onDemoOfferCodeChange(event) {
    if (event !== null) {
      if (event.trim() !== '') {
        this.inProgress = true;
        this.demoOfferChanged = true;
        this.answerTypeError = false;
        this.validateDemoOfferCode = true;
        this.validationMsg = 'Validating DemoOfferCode....'
        this.progressBar.open();
        this._questionService.checkCodeIsUnique(event, 'DemoOfferCode')
          .subscribe(res => {
            this.validateDemoOfferCode = false;
            setTimeout(() => {
              this.progressBar.close();
            }, 1000);
            if (!res.Status) {
              this.answerTypeErrorMsg = res.BusinessMessage;
              this.answerTypeError = true;
            }
            this.inProgress = false;
          }, error => {
            setTimeout(() => { this.validateDemoOfferCode = false; this.progressBar.close(); }, 1000);
          });
      }
    }
  }

  // To validate demo choices unique within this selected demo code on change and 
  onDemoChoicesChange(choice: DemoChoiceDetails, ind: number) {
    if (choice.DemoChoiceCode.trim() !== '') {
      this.validationMsg = 'Validating DemoChoice....';
      this.validateDemoOfferCode = true;
      this.progressBar.open();
      this.inProgress = true;
      this.choicesChanged = true;
      this.removeFromErrorList(ind, false);
      const action = choice.DemoChoiceId > 0 ? 'edit' : 'create';
      this._questionService.checkCodeIsUniqueInDemoCode(choice.DemoChoiceCode, this.questionTabDetails.DemoCode.Code, action, 'DemoChoiceCode')
        .subscribe(res => {
          this.validateDemoOfferCode = false;
          setTimeout(() => {
            this.progressBar.close();
          }, 1000);
          if (!res.Status) {
            this.demoChoiceError = {
              index: ind, choiceCode: choice.DemoChoiceCode, errorDescription: res.BusinessMessage
            };
            this.demoChoiceErrors.push(this.demoChoiceError); // Add to error list if it has error
          }
          this.inProgress = false;
        }, error => {
          setTimeout(() => { this.validateDemoOfferCode = false; this.progressBar.close(); }, 1000);
        });
    }
  }

  // To remove from error list
  removeFromErrorList(ind: number, onDelete: boolean) {
    const isExistChoice = this.demoChoiceErrors.filter(val => val.index === ind);
    if (isExistChoice.length > 0) {
      const index = this.demoChoiceErrors.indexOf(isExistChoice[0], 0);
      if (index > -1) {
        this.demoChoiceErrors.splice(index, 1);
      }
    }
    if (onDelete) {
      //for (let i = ind; i < this.demoChoiceErrors.length; i++){
      //    this.demoChoiceErrors[i].index = this.demoChoiceErrors[i].index - 1;
      //}
      this.demoChoiceErrors.forEach(value => {
        if (value.index >= ind) {
          value.index = value.index - 1;
        }
      });
    }
  }

  // To identify the demo choice text is changed
  onDemoChoiceTextChange(index: number) {
    this.choicesChanged = true;
    this.choiceTextChanged[index] = true;
  }

  // On change of demo choice text
  onDemoChoiceTextBlur(index: number, event: any, choice: DemoChoiceDetails) {
    this.inProgress = true;
    const choiceCode = choice.DemoChoiceCode;
    if (this.filteredDemoChoices.length === 1 && this.filteredDemoChoices[0].DemoChoiceText.toLowerCase() === event.target.value.toLowerCase()) {
      this.loadSelectedDemoChoice(this.filteredDemoChoices[0], index);
    }
    if (choice.DemoChoiceId > 0 && this.choiceTextChanged[index]) {
      this.choiceTextChanged[index] = false;
      this.modelIsDirty.open();
      this.exisitingDemoChoiceMsg = 'The DemoChoice \'' + choiceCode + '\' may be used across Demo Offers within this Demo Code. Changes to the choice will affect all the Demo Offers. Do you want to proceed';
      const subscriptionOnClose: Subscription = this.modelIsDirty.onClose.subscribe(() => {
        const isExistChoice = this.lstDemoChoices.filter(val => val.DemoChoiceCode.toUpperCase() === choice.DemoChoiceCode.toUpperCase());
        if (isExistChoice.length > 0) {
          this.selectedDemoOffer.DemoOffer_Choice[index].DemoChoiceText = isExistChoice[0].DemoChoiceText;
        }
        subscriptionOnClose.unsubscribe();
      });
    }
    setTimeout(() => {
      this.inProgress = false;
    }, 500);
  }

  // To validate all the demo offer fields
  validateDemoOfferFields() {
    let result = true;
    // clicked save directly on blur
    if (this.inProgress) {
      return false;
    }

    // duplicate errors
    if (this.answerTypeError) {
      this.showValidationMessage(this.answerTypeErrorMsg);
      return false;
    } else if (this.demoChoiceErrors.length > 0) {
      this.showValidationMessage(this.demoChoiceErrors[0].errorDescription);
      return false;
    }
    if (!this.isValidDate) {
      this.showValidationMessage(this.constants.MSG_VALID_DATE);
      return false;
    }
    // empty check
    if (this.validateValue(this.selectedDemoOffer.DemoOfferCode)) {
      this.showValidationMessage(this.constants.MSG_DEMOOFFER_CODE_EMPTY);
      return false;
    } else if (this.selectedDemoOffer.DemoOfferCode.trim().length !== 4) {
      this.showValidationMessage(this.constants.MSG_DIG_DEMO_OFFER);
      return false;
    } else if (this.validateValue(this.selectedDemoOffer.SourceType)) {
      this.showValidationMessage(this.constants.MSG_DEMOOFFER_SOURCE_EMPTY);
      return false;
    } else if (this.validateValue(this.selectedDemoOffer.RecordType)) {
      this.showValidationMessage(this.constants.MSG_DEMOOFFER_RECORD_EMPTY);
      return false;
    } else if (new Date(this.selectedDemoOffer.ScheduleDate).getTime() <= new Date().getTime()) {
      this.showValidationMessage(this.constants.MSG_DEMOOFFER_SCHEDULE);
      return false;
    } else if (this.selectedDemoOffer.ControlType === null && this.answerType.toUpperCase() === AnswerTypes.SingleOption) {
      this.showValidationMessage(this.constants.MSG_DEMOOFFER_CONTROL_EMPTY);
      return false;
    }

    else if (this.answerType.toUpperCase() === AnswerTypes.MultipleOption) { // mutliple option
      if (Number(this.selectedDemoOffer.MinValue) > Number(this.selectedDemoOffer.MaxValue)) {
        this.showValidationMessage(this.constants.MSG_MIN_MAX_COMPARE);
        return false;
      } else if (!(Number(this.selectedDemoOffer.MinValue) > 0 && Number(this.selectedDemoOffer.MinValue) <= this.selectedDemoOffer.DemoOffer_Choice.length)) {
        this.showValidationMessage(this.constants.MSG_DEMOOFFER_MIN_EMPTY);
        return false;
      } else if (!(Number(this.selectedDemoOffer.MaxValue) > 0 && Number(this.selectedDemoOffer.MaxValue) <= this.selectedDemoOffer.DemoOffer_Choice.length)) {
        this.showValidationMessage(this.constants.MSG_DEMOOFFER_MAX_EMPTY);
        return false;
      }
    }

    //// Added for Digital Demo Offer Code and magazine validation - CME-7077 - Priya

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

    if (this.selectedDemoOffer.DemoOffer_Choice.length > 0) {
      // validate demo choices
      for (let i = 0; i < this.selectedDemoOffer.DemoOffer_Choice.length; i++) {
        const value = this.selectedDemoOffer.DemoOffer_Choice[i];
        if (this.validateValue(value.DemoChoiceCode)) {
          this.showValidationMessage('Option ' + (i + 1) + ' - Demo Choice Code cannot be empty');
          result = false;
          break;
        } else if (this.validateValue(value.DemoChoiceText)) {
          this.showValidationMessage('Option ' + (i + 1) + ' - Demo Choice text cannot be empty');
          result = false;
          break;
        }

        const duplicateChoiceCode = Object.assign([], this.selectedDemoOffer.DemoOffer_Choice).filter(item => item.DemoChoiceCode.toUpperCase() === value.DemoChoiceCode.toUpperCase());
        const duplicateChoiceText = Object.assign([], this.selectedDemoOffer.DemoOffer_Choice).filter(item => item.DemoChoiceText.trim() === value.DemoChoiceText.trim());
        if (duplicateChoiceCode.length > 1 || duplicateChoiceText.length > 1) {
          this.showValidationMessage('Option ' + (i + 1) + ' - Duplicate Demo Choices exists');
          result = false;
          break;
        }
      }
    } else {
      this.showValidationMessage(this.constants.MSG_DEMOOFFER_CHOICE_EMPTY);
      return false;
    }

    // if no changes
    if (!this.demoOfferChanged && !this.choicesChanged && !this.scheduleChanged) {
      this.showValidationMessage(this.constants.MSG_DEMO_OFFER_UNMODIFIED_SAVE);
      return false;
    }

    if (!this.scheduleChanged) {
      if (this.ValidateScheduleDate(this.selectedDemoOffer.ScheduleDate)) {
        this.showValidationMessage(this.constants.MSG_DEMOOFFER_SCHEDULE);
        return false;
      }
      else {
        if (result) {
          this.changeDateFormats(this.selectedDemoOffer.ScheduleDate);
        }
      }
    }

    return result;
  }

  // To check the value is empty or null
  validateValue(value) {
    if (value === null || value === undefined || value.toString().trim() === '') {
      return true;
    }
    return false;
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

  // to show the validation message and close
  showValidationMessage(errMsg: string): void {
    this.modalValidate.open();
    this.modalMessage = errMsg;
    setTimeout(() => {
      this.modalValidate.close();
    }, 3000);
  }

  // on save of demo offer
  saveDemoOfferDetails(event: any) {
    if (this.validateDemoOfferFields()) {
      this.progressBar.open();
      const demoOfferRequest = new DemoOfferRequest(this.selectedDemoOffer, this.isAddDemoOffer, this.userDetails.username, this.demoOfferChanged, this.scheduleChanged, this.choicesChanged);
      this._answerService.upsertDemoOfferDetails(demoOfferRequest).subscribe(res => {
        setTimeout(() => {
          this.progressBar.close();
        }, 1000)
        if (res.Response.Status) {
          this.modalSaveSuccess.open();
          this.modalMessage = res.Response.BusinessMessage;
          setTimeout(() => {
            this.modalSaveSuccess.close();
            this.modelEditAnswer.close();
            this._questionService.getDemoChoices(this.questionTabDetails.DemoCode.Code).subscribe(value => {
              this.lstDemoChoices = value;
              this.setInitialData();
            });
            this.demoOfferDetails = res.DemoOfferDetails;
            this.updatedDemoOffers.emit(res.DemoOfferDetails);
            this.updateMagazines.emit(res.MagazineDetails);
            this.Magazines = res.MagazineDetails;
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
    if (this.demoOfferChanged || this.choicesChanged || this.scheduleChanged) {
      const subscrip: Subscription = this.unSavedChangesResponse.subscribe((val) => {
        subscrip.unsubscribe();
        if (val) {
          this.selectedMagazine = "";
          this.modelEditAnswer.close();
        }
      });
      this.modelUnSavedChanges.open();
    } else if (!this.inProgress) {
      this.selectedMagazine = "";
      this.modelEditAnswer.close();
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

  // Opens Recall Offer Modal
  openRecallDemoOffer(offer) {
    this.recalledDemoOffer = offer;
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
          // TOD: make a new server request and get latest details
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

  // updates statuses to draft if recalled DC is in pending
  updateStatusToDraft() {
    this.demoOfferDetails.forEach(of => {
      of.Status = ApplicationStatus.Draft;
      of.StatusId = this.getStatusID(ApplicationStatus.Draft);
    });
    this.questionTabDetails.DemoCode.StatusId = this.getStatusID(ApplicationStatus.Draft);
    this.updateDCStatus.emit({ 'StatusId': this.questionTabDetails.DemoCode.StatusId, 'StatusType': ApplicationStatus.Draft });
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

  // to check the edit based on demo offer status
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

  // To archive the active demo offer
  archive() {
    this.progressBar.open();
    let obj: any = {};
    obj.DemoOfferCode = this.archiveoffer.DemoOfferCode;
    obj.UserId = this.userDetails.username;
    this.archiveOffer(obj).subscribe(result => {
      setTimeout(() => {
        this.progressBar.close();
      });
      if (result.Status) {
        setTimeout(() => {
          this.modalArchive.close();
        }, 1000);

        this.modalMessage = result.BusinessMessage;
        this.modalSaveSuccess.open();
        setTimeout(() => {
          this.modalSaveSuccess.close();
        }, 1000);
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

  //onMagazineSelection(event: any) {
  //  this._commonService.GetDigitalDemoFilteredByMagazine().subscribe(res => {
  //    this.filteredDigitalDemoOffers = res;
  //  });
  //}

  //restrictSpecialCharacters(event) {
  //    var k = event.charCode;
  //    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  //}



}

interface ChoiceErrorList {
  index: number;
  choiceCode: string;
  errorDescription: string;
}
