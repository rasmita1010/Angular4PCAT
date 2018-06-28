import { Component, OnInit, OnDestroy, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable, Subscription } from 'rxjs/Rx';
import { QuestionService, SharedService, AnswerService } from '../../_services/index';
import { Constants, AnswerTypes, ApplicationStatus, DemoOfferChannel, SubmitDemoRequest, ResetRequest, PrioritizeChoiceRequest, UpdateOfferFieldsRequest, DemoOfferDetails, DemoOfferScheduleDate } from '../../_models/index';
import { QuestionValidators } from '../questions.validators';
import { Subject } from 'rxjs/Subject';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-manage-demos',
  templateUrl: './manage-demos.component.html',
  styleUrls: ['./manage-demos.component.css']
})

export class ManageDemosComponent implements OnInit, OnDestroy {
  routeParam: any;
  paramValue: string;
  constants = Constants;
  answerTypeConst = AnswerTypes;
  demoStatus = ApplicationStatus;
  selectedTab = Constants.QT_QUESTION_ID;
  navTabResponse: EventEmitter<boolean> = new EventEmitter();
  navRouteResponse: EventEmitter<boolean> = new EventEmitter();
  setChannelVisiblityResponse: EventEmitter<boolean> = new EventEmitter();
  status: string = this.demoStatus.Draft;
  questionForm: any;
  answerTypes: any[];
  democodeControl: any;
  questionControl: any;
  answerControl: any;
  answerQuestionControl: any;
  questionIndentifierControl: any;
  numberControl: any;
  booleanControl: any;
  dropdownControl: any;
  modalMessage = '';
  modalErrorMessage = '';
  demoCodeBusinessMsg = '';
  quesIdenBusinessMsg = '';
  datetoday = new Date();
  userDetails;
  demoCodeDetails;
  searchText: string;
  questions: any;
  unSavedChanges = false;
  disableOnEdit = false;
  lockedUser;
  IsUserView: boolean;
  showComments = false;
  demoCodeObj: any;
  selectedOffers = [];
  changeHistory = [];
  //questionTabDetails;
  todayDate = Date.now();
  comments = [];
  currentDate = new Date();
  selectedComments = [];
  additionalComments = '';
  checked: boolean[];
  inProgress = false;
  changedDemoOfferSourceType = '';
  lstDemoChoices: any = [];
  isOrderChanged = false;
  showPrioritizeMessage = false;
  prioritizeMessage = '';
  selectedScheduleDate = new Date();
  filteredDemoOffer: string;
  isChannelVisibleChanged = false;
  tabName: '';
  demoOfferMags: DemoOfferMags[] = [];
  notAllowDelete = true;
  currentView: boolean;
  validateDemoCode: boolean;
  validateQuestionIdentifier: boolean;
  validationMsg: string;
  // Counts
  chainOfferCount = 0;
  answersCount = 0;
  magazineCount = 0;
  demoOfferChannels: DemoOfferChannel[] = [];
  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;
  @ViewChild('modalSaveSuccess')
  modalSaveSuccess: BsModalComponent;
  @ViewChild('modelIsDirty')
  modelIsDirty: BsModalComponent;
  @ViewChild('modelIsDirtyOnRoute')
  modelIsDirtyOnRoute: BsModalComponent;
  @ViewChild('modelSetSourceType')
  modelSetSourceType: BsModalComponent;
  @ViewChild('modalAlertSubmit')
  modalAlertSubmit: BsModalComponent;
  @ViewChild('modalDeleteDemo')
  modalDeleteDemo: BsModalComponent;
  @ViewChild('modalDeleteSuccess')
  modalDeleteSuccess: BsModalComponent;
  @ViewChild('modalDemoLocked')
  modalDemoLocked: BsModalComponent;
  @ViewChild('modalAnswerTypeAlert')
  modalAnswerTypeAlert: BsModalComponent;
  @ViewChild('modelIsExisting')
  modelIsExisting: BsModalComponent;
  @ViewChild('modelPriortizeChoices')
  modelPriortizeChoices: BsModalComponent;
  @ViewChild('modalSetChannelVisibility')
  modalSetChannelVisibility: BsModalComponent;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  @ViewChild('modalSubmitFailure')
  modalSubmitFailure: BsModalComponent;
  @ViewChild('modelIsUserViewDirty')
  modelIsUserViewDirty: BsModalComponent;
  @ViewChild('modelChainOfferIsDirty')
  modelChainOfferIsDirty: BsModalComponent;
  @ViewChild('modelSetScheduleDate')
  modelSetScheduleDate: BsModalComponent;
  errorMessage = '';
  showError = false;
  noneChecked: boolean = false;
  ScheduleDateErrorMessage: string = '';

  // Date Picker Configuration
  myDate = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
  selectedDate: any = { year: this.myDate.getFullYear(), month: this.myDate.getMonth() - 1, day: this.myDate.getDate() };
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showTodayBtn: true,
    minYear: 2000,
    maxYear: 3000,
    width: '70%',
    disableUntil: { year: this.myDate.getFullYear(), month: this.myDate.getMonth() + 1, day: this.myDate.getDate() - 1 }
  };

  scheduleDatedemoOfferDetails: DemoOfferDetails[] = [];
  selectedDemoOfferDetails: DemoOfferDetails[] = [];
  demoOfferSchedule: DemoOfferScheduleDate[] = [];
  checkInValidDemoOffers: DemoOfferDetails[] = [];
  sDateDemoOfferDetails = [];
  sDateOriginalDemoOfferDetails = [];
  NewscheduleDate: any;
  isValidSCHdate = true;
  SetScheduleDateVisibility: boolean = false;

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private _router: Router, private _route: ActivatedRoute, private fb: FormBuilder, private _questionService: QuestionService, private _sharedSVC: SharedService, private _answerService: AnswerService) {
    this._sharedSVC.setActiveTab(this.constants.PCA_QUESTIONS);
    this.checked = [];
    this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(searchText => {
      this.filteredDemoOffer = searchText;
    });
  }

  ngAfterViewInit() { this.progressBar.open(); }

  ngOnInit() {
    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
    this.filteredDemoOffer = JSON.parse(sessionStorage.getItem(this.constants.LS_FILTRED_DEMO_OFFER));
    this.loadInitalState();
    this.selectedScheduleDate.setDate(new Date().getDate() + 1);
    this.noneChecked = false;
    this.isValidSCHdate = true;
  }

  ngOnDestroy() {
    // Releases lock when user is in edit and moves away from edit page
    if (this.paramValue !== null && this.paramValue !== undefined) {
      if ((this.paramValue.toLowerCase() === this.constants.MSG_ROUTE_EDIT)) {
        if (this.userDetails.username === this.lockedUser) {
          this._questionService.resetDemoCodeLock(this.demoCodeDetails.Code)
            .subscribe();
        }
      }
    }
  }

  // listen whenever browser close or reload
  @HostListener('window:beforeunload', ['$event'])
  callBrowserClose() {
    if (this.demoCodeObj.DemoCode.Code !== undefined || this.demoCodeObj.DemoCode.Code !== null) {
      sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(this.demoCodeObj.DemoCode.Code));
    }
    return true;
  }

  allowUserView(event) {
    this.currentView = event;
    if (this.currentView) {
      const isDirty = sessionStorage.getItem(this.constants.LS_ISALLOW);
      if (this.questionForm.dirty || (isDirty !== null && isDirty.toUpperCase() === 'N')) {
        this.modelIsUserViewDirty.open();
      } else {
        this.IsUserView = event;
      }
    } else {
      if (this.selectedOffers.length > 0) {
        this.modelIsUserViewDirty.open();
      } else {
        this.IsUserView = event;
      }
    }
  }

  allowUserViewNavigation() {
    this.IsUserView = this.currentView;
    this.modelIsUserViewDirty.close();
    this.questionForm.markAsPristine();
    this.setQuestioFormData();
    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
  }

  blockUserViewNavigation() {
    this.modelIsUserViewDirty.close();
    setTimeout(() => {
      this.IsUserView = !this.currentView;
    }, 1000);
  }

  public canDeactivate(): Promise<boolean> | boolean {
    const isDirty = sessionStorage.getItem(this.constants.LS_ISALLOW);
    return new Promise<boolean>((resolve, reject) => {
      if (this.questionForm.dirty || (isDirty !== null && isDirty.toUpperCase() === 'N')) {
        const subscrip: Subscription = this.navRouteResponse.subscribe((val) => {
          subscrip.unsubscribe();
          resolve(val);
        });
        this.modelIsDirtyOnRoute.open();
      } else {
        resolve(true);
      }
    });
  }

  questionsTabSelection(tabId) {
    this.tabName = tabId;
    if (this.selectedTab !== this.constants.QT_QUESTION_ID) {
      const isDirty = sessionStorage.getItem(this.constants.LS_ISALLOW);
      if (isDirty !== null && isDirty.toUpperCase() === 'N') {
        this.modelIsDirty.open();
      } else {
        this.selectedTab = tabId;
      }
    } else {
      if (this.questionForm.dirty && tabId !== this.constants.QT_QUESTION_ID) {
        const subscription: Subscription = this.navTabResponse.subscribe((val) => {
          subscription.unsubscribe();
          if (val) {
            if (this.demoCodeObj.DemoCode.Code === undefined || this.demoCodeObj.DemoCode.Code === null) {
              this.showValidationMessage(this.constants.MSG_USRVW_NODEMOCODE);
            } else {
              this.questionForm.markAsPristine();
              this.setQuestioFormData();
              this.selectedTab = tabId;
            }
          }
        });
        this.modelIsDirty.open();
      } else if ((this.demoCodeObj.DemoCode.Code === undefined || this.demoCodeObj.DemoCode.Code === null) && tabId !== this.constants.QT_QUESTION_ID) {
        this.showValidationMessage(this.constants.MSG_USRVW_NODEMOCODE);
      } else {
        if (tabId == "answers") {
          var demooffersFilterByStatus = JSON.parse(JSON.stringify(this.demoCodeObj.DemoOffers)).filter(x => x.StatusId == 1 || x.StatusId == 5 || x.StatusId == 7);
          this.SetScheduleDateVisibility = demooffersFilterByStatus.length > 0
        }
        this.selectedTab = tabId;
      }
    }
  }

  allowNavigation() {
    this.modelIsDirty.close();
    if (this.selectedTab !== this.constants.QT_QUESTION_ID) {
      this.selectedTab = this.tabName;
    }
    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
    this.navTabResponse.emit(true);
  }

  blockNavigation() {
    this.modelIsDirty.close();
    this.navTabResponse.emit(false);
  }

  allowRouteNavigation() {
    this.modelIsDirtyOnRoute.close();
    if (this.selectedTab !== this.constants.QT_QUESTION_ID) {
      this.selectedTab = this.tabName;
    }
    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
    this.navRouteResponse.emit(true);
  }

  blockRouteNavigation() {
    this.modelIsDirtyOnRoute.close();
    this.navRouteResponse.emit(false);
  }

  callClose(): void {
    if (this.paramValue.toLowerCase() === this.constants.MSG_ROUTE_EDIT) {
      this._router.navigate(['/dashboard/questions/view']);
    } else {
      this._router.navigate(['/dashboard/questions']);
    }
  }

  loadInitalState() {
    this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
    // this.demoCodeObj = JSON.parse(localStorage.getItem(this.constants.LS_DEMO_CODE_MODEL));
    this.questions = null;
    this.searchText = null;

    this._questionService.getAnswerTypes().subscribe(res => {
      this.answerTypes = res;
    });

    this.routeParam = this._route.params.subscribe(params => {
      this.paramValue = params['action'];
      switch (this.paramValue.toLowerCase()) {
        case this.constants.MSG_ROUTE_CREATE:
          // if (this.demoCodeObj === null || this.demoCodeObj === undefined) {
          this.demoCodeObj = {};
          this.demoCodeObj.DemoCode = {};
          this.demoCodeObj.DemoOffers = [];
          this.demoCodeObj.Comments = [];
          this.demoCodeObj.Magazine = [];
          this.demoCodeObj.ChainOffers = [];
          this.setInitialFormData();
          setTimeout(() => { this.progressBar.close(); }, 1000);
          break;
        case this.constants.MSG_ROUTE_EDIT:
          this.notAllowDelete = false;
          if (this.questionForm === null || this.questionForm === undefined) {
            this.setInitialFormData();
          }
          const demoCode = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_CODE));
          this._questionService.ViewDemoCode(demoCode, this.userDetails.username, this.userDetails.DisplayName)
            .subscribe(demoCodeDet => {
              this.demoCodeObj = demoCodeDet;
              this.demoCodeDetails = this.demoCodeObj.DemoCode;
              if (this.demoCodeDetails !== null) {
                this._questionService.createDemoCodeLock(this.demoCodeDetails.Code, this.userDetails.username, this.userDetails.DisplayName).subscribe(user => {
                  this.lockedUser = user.m_Item1;
                });
                this.setQuestioFormData();
                this.comments = this.demoCodeObj.Comments;
                const chainOffer = this.demoCodeObj.ChainOffers;
                this.answersCount = this.demoCodeObj.DemoOffers.length;
                this.chainOfferCount = (chainOffer.ForcedChainOffers.concat(chainOffer.ChoiceChainOffers).concat(chainOffer.ChoiceToOfferChains)).length;
                const magazine = this.demoCodeObj.Magazine;
                this.magazineCount = this.getMagazineCount(magazine);
                setTimeout(() => { this.progressBar.close(); }, 1000);
              }
            }, error => {
              setTimeout(() => { this.progressBar.close(); }, 1000);
            });
          break;
        default: break;
      }
    });
  }

  setInitialFormData() {
    this.democodeControl = this.fb.control('', QuestionValidators.FieldsEmptyCheck);
    this.questionControl = this.fb.control('', QuestionValidators.FieldsEmptyCheck);
    this.answerControl = this.fb.control('', QuestionValidators.FieldsEmptyCheck);
    this.answerQuestionControl = this.fb.control('', QuestionValidators.FieldsEmptyCheck);
    this.questionIndentifierControl = this.fb.control('', QuestionValidators.FieldsEmptyCheck);
    this.numberControl = this.fb.control(1);
    this.booleanControl = this.fb.control(false);
    this.dropdownControl = this.fb.control(0, QuestionValidators.FieldsSelectedCheck);

    this.questionForm = this.fb.group({
      QuestionText: this.questionControl,
      Code: this.democodeControl,
      AnswerId: this.dropdownControl,
      AnswerType: this.answerControl,
      AnsweredQuestionText: this.answerQuestionControl,
      IsCDBModel: this.booleanControl,
      RecentAnswerCount: this.numberControl,
      QuestionIdentifier: this.questionIndentifierControl,
      StatusId: [1],
      Status: [this.demoStatus.Draft],
      CreatedBy: [this.userDetails.username],
      CreatedDate: [this.datetoday],
      UpdatedBy: [],
      UpdatedDate: []
    });
    this.democodeControl.enable();
    this.enableFormControls();
  }

  setQuestioFormData() {
    this.demoCodeDetails = this.demoCodeObj.DemoCode;
    if (this.demoCodeDetails !== null) {
      this.status = this.demoCodeDetails.Status;
      if (this.status === this.demoStatus.Draft || this.status === this.demoStatus.Active || this.status === this.demoStatus.Active_In_Edit || this.status === this.demoStatus.Returned || this.status === this.demoStatus.Pending) {
        this.questionForm.patchValue({ QuestionText: this.demoCodeDetails.QuestionText });
        this.questionForm.patchValue({ Code: this.demoCodeDetails.Code });
        this.questionForm.patchValue({ AnswerId: this.demoCodeDetails.AnswerId });
        this.questionForm.patchValue({ AnswerType: this.demoCodeDetails.AnswerType });
        this.questionForm.patchValue({ AnsweredQuestionText: this.demoCodeDetails.AnsweredQuestionText });
        this.questionForm.patchValue({ RecentAnswerCount: this.demoCodeDetails.RecentAnswerCount });
        this.questionForm.patchValue({ QuestionIdentifier: this.demoCodeDetails.QuestionIdentifier });
        this.questionForm.patchValue({ StatusId: this.demoCodeDetails.StatusId });
        this.questionForm.patchValue({ Status: this.demoCodeDetails.Status });
        this.questionForm.patchValue({ CreatedBy: this.demoCodeDetails.CreatedBy });
        this.questionForm.patchValue({ CreatedDate: this.demoCodeDetails.CreatedDate });
        this.questionForm.patchValue({ UpdatedBy: this.userDetails.username });
        this.questionForm.patchValue({ UpdatedDate: this.datetoday });
        setTimeout(() => { this.questionForm.patchValue({ IsCDBModel: this.demoCodeDetails.IsCDBModel }) }, 1000);
        this.democodeControl.disable();
        if (this.status !== this.demoStatus.Draft) {
          this.disableFormControls();
        } else {
          this.enableFormControls();
        }
        this.questionForm.markAsPristine();
      }
    }
  }

  enableFormControls() {
    this.questionControl.enable();
    this.answerControl.enable();
    this.answerQuestionControl.enable();
    this.questionIndentifierControl.enable();
    this.numberControl.enable();
    this.booleanControl.enable();
    this.dropdownControl.enable();
  }

  disableFormControls() {
    this.questionControl.disable();
    this.answerControl.disable();
    this.answerQuestionControl.disable();
    this.questionIndentifierControl.disable();
    this.numberControl.disable();
    this.booleanControl.disable();
    this.dropdownControl.disable();
  }

  // getters -- Question form
  get questionText() {
    return this.questionForm.get('QuestionText');
  }

  get code() {
    return this.questionForm.get('Code');
  }

  get answerId() {
    return this.questionForm.get('AnswerId');
  }

  get answerValue() {
    return this.questionForm.get('AnswerType');
  }

  get answeredQuestionText() {
    return this.questionForm.get('AnsweredQuestionText');
  }

  get questionIdentifier() {
    return this.questionForm.get('QuestionIdentifier');
  }

  get dbType() {
    return this.questionForm.get('IsCDBModel');
  }

  get recentAnswersCount() {
    return this.questionForm.get('RecentAnswerCount');
  }

  onDemoCodeChange() {
    if (!(this.code.errors && this.code.errors.isEmpty)) {
      this.inProgress = true;
      this.validationMsg = 'Validating DemoCode....';
      this.validateDemoCode = true;
      this.progressBar.open();
      this._questionService.checkCodeIsUnique(this.code.value, 'DemoCode')
        .subscribe(res => {
          this.validateDemoCode = false;
          if (!res.Status) {
            this.demoCodeBusinessMsg = res.BusinessMessage;
            this.code.setErrors({
              duplicateCode: true
            });
          }
          this.inProgress = false;
          setTimeout(() => { this.progressBar.close(); }, 1000);
        }, error => {
          setTimeout(() => { this.validateDemoCode = false; this.progressBar.close(); }, 1000);
        });
    } else {
      this.validateDemoCode = false;
      this.demoCodeBusinessMsg = this.constants.MSG_CODE_EMPTY;
    }
  }

  onQuestionIdentifierChange() {
    if (!(this.questionIdentifier.errors && this.questionIdentifier.errors.isEmpty)) {
      this.inProgress = true;
      this.validateQuestionIdentifier = true;
      this.progressBar.open();
      this._questionService.checkCodeIsUniqueInDemoCode(this.questionIdentifier.value, this.code.value, this.paramValue.toLowerCase(), 'QuestionIdentifierCode')
        .subscribe(res => {
          this.validateQuestionIdentifier = false;
          if (!res.Status) {
            this.quesIdenBusinessMsg = res.BusinessMessage;
            this.questionIdentifier.setErrors({
              duplicateCode: true
            });
          }
          this.inProgress = false;
          setTimeout(() => { this.progressBar.close(); }, 1000);
        }, error => {
          setTimeout(() => { this.validateQuestionIdentifier = false; this.progressBar.close(); }, 1000);
        });
    } else {
      this.validateQuestionIdentifier = true;
      this.quesIdenBusinessMsg = this.constants.MSG_QUES_IDEN_EMPTY;
    }
  }

  changeAnswerType(event: any) {
    const answerType = this.answerTypes.filter((item) => item.AnswerId == (event.target.value))[0].AnswerType;
    this.questionForm.patchValue({ AnswerType: answerType });
    if (this.demoCodeObj.DemoOffers.length > 0 || this.magazineCount > 0 || this.demoCodeObj.ChainOffers.length > 0) {
      if (this.paramValue.toLowerCase() == this.constants.MSG_ROUTE_EDIT && this.demoCodeObj.DemoCode.AnswerType !== answerType) {
        this.modalAnswerTypeAlert.open();
      }
    }
  }

  resetAnswerType() {
    this.modalAnswerTypeAlert.close();
    this.progressBar.open();
    const resetRequest = new ResetRequest(this.demoCodeObj.DemoCode.Code, this.answerValue.value, this.userDetails.username);
    this._questionService.resetAnswertype(resetRequest).subscribe(response => {
      setTimeout(() => {
        this.progressBar.close();
      }, 1000)

      if (response.Status) {
        this.modalMessage = response.BusinessMessage;
        this.modalSaveSuccess.open();
        setTimeout(() => {
          this.modalSaveSuccess.close();
          this.demoCodeObj.DemoCode.AnswerType = this.answerValue.value;
          this.demoCodeObj.DemoCode.AnswerId = this.answerId.value;
          this.demoCodeObj.DemoOffers = [];
          this.answersCount = 0;
          this.demoCodeObj.Magazine = [];
          this.magazineCount = 0;
          let chainOffers = this.demoCodeObj.ChainOffers;
          chainOffers.ForcedChainOffers = [];
          chainOffers.ChoiceChainOffers = [];
          this.chainOfferCount = 0;
          this.setQuestioFormData();
        }, 3000);

      }
    }, error => {
      setTimeout(() => { this.progressBar.close(); }, 1000);
    })

  }

  modalAnswerTypeAlertClose() {
    this.modalAnswerTypeAlert.close();
    this.questionForm.patchValue({ AnswerType: this.demoCodeObj.DemoCode.AnswerType });
    this.questionForm.patchValue({ AnswerId: this.demoCodeObj.DemoCode.AnswerId });
  }

  changeDBType(event: any) {
    this.isChannelVisibleChanged = false;
    if (this.chainOfferCount > 0 && this.dbType.value) {
      this.showValidationMessage(this.constants.MSG_DB_CHANGE_WITH_CHAIN);
      setTimeout(() => {
        this.questionForm.patchValue({ IsCDBModel: !this.dbType.value });
      }, 2000);
      this.booleanControl.markAsPristine();
    } else if (this.demoCodeObj.DemoOffers.length > 0) {
      if (this.dbType.value) {
        if (this.magazineCount > 0) {
          this.modalSetChannelVisibility.open();
          const channelSubscrip: Subscription = this.setChannelVisiblityResponse.subscribe((val) => {
            channelSubscrip.unsubscribe();
            if (val) {
              this.changedDemoOfferSourceType = 'D';
              this.isChannelVisibleChanged = true;
            } else {
              this.questionForm.patchValue({ IsCDBModel: !this.dbType.value });
            }
          });
        } else {
          this.changedDemoOfferSourceType = 'D';
        }
      } else {
        this.modelSetSourceType.open();
      }
    }
  }

  allowSetChannelVisibility() {
    this.modalSetChannelVisibility.close();
    this.setChannelVisiblityResponse.emit(true);
  }

  blockSetChannelVisibility() {
    this.modalSetChannelVisibility.close();
    this.setChannelVisiblityResponse.emit(false);
  }

  updateDemoOfferSourceType(source) {
    this.modelSetSourceType.close();
    this.changedDemoOfferSourceType = source;
  }

  checkQuestionAlreadyExists(demoCodeInfo: any) {
    const resVal = this._questionService.checkQuestionAlreadyExists(demoCodeInfo)
      .subscribe(res => {
      });
    return resVal;
  }

  changeRecentAnswersCount(val) {
    const num = parseInt(this.recentAnswersCount.value, 10);
    if (val !== -1 || num !== 0) {
      this.questionForm.patchValue({ RecentAnswerCount: num + val });
      this.numberControl.markAsDirty();
    }
  }

  searchEvent(event: any) {
    if (event.target.value !== '') {
      this.searchText = event.target.value.trim().toLowerCase();
      if (event.keyCode === this.constants.KEY_CODE_ENTER || event.keyCode === this.constants.KEY_CODE_SPACE) {
        this.searchKeywords();
      }
    } else {
      this.questions = null;
      this.searchText = null;
    }
  }

  // used in question searchcomponent also.. can move to common place
  searchKeywords() {
    if (!(this.searchText === '' || this.searchText === undefined)) {
      let searchArray: any;
      searchArray = this.searchText.split(' ');
      //searchArray = searchArray.filter(item => !this.constants.EXCLUDE_LIST.includes(item));
      searchArray = searchArray.splice(this.constants.EXCLUDE_LIST);
      if (searchArray.length > 0) {
        this._questionService.getQuestionsOnSearch(searchArray).subscribe((data) => this.questions = data);
      }
    }
  }

  onSubmit(val) {
    const validate = this.questionFormValidation();

    if (validate) {
      this.progressBar.open();
      if (this.paramValue.toLowerCase() === this.constants.MSG_ROUTE_CREATE) {
        this._questionService.saveDemoCode(val)
          .subscribe(res => {
            if (res.Status) {
              this.notAllowDelete = false;
              //setTimeout(() => {
              this.progressBar.close();
              setTimeout(() => { this.showSuccessMessage(res.BusinessMessage); }, 1000);
              //}, 1000);
            } else {
              //setTimeout(() => {
              this.progressBar.close();
              setTimeout(() => { this.showValidationMessage(res.BusinessMessage); }, 1000);
              //}, 1000);
            }
            // TODO: review this 
            this.demoCodeObj.DemoCode = val;
            this.questionForm.markAsPristine();
            this.questions = null;
            sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(this.demoCodeObj.DemoCode.Code));
            sessionStorage.setItem(this.constants.LS_DEMO_OFFER_COUNT, '0');
            this._router.navigate(['./dashboard/questions', 'edit']);
          }, error => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
          });
      } else if (this.paramValue.toLowerCase() === this.constants.MSG_ROUTE_EDIT) {
        this._questionService.updateDemoCode(this.questionForm.getRawValue())
          .subscribe(res => {
            if (res.Status) {
              this.demoCodeObj.DemoCode = this.questionForm.getRawValue();
              // update answer source type
              if (this.demoCodeObj.DemoOffers.length > 0 && this.changedDemoOfferSourceType.trim() !== '') {
                this.updateDemoOfferFields(res.BusinessMessage);
              } else {
                setTimeout(() => { this.progressBar.close(); }, 1000);
                this.showSuccessMessage(res.BusinessMessage);
              }

            } else {
              setTimeout(() => { this.progressBar.close(); }, 1000);
              this.showValidationMessage(res.BusinessMessage);
            }
            this.questionForm.markAsPristine();
            this.questions = null;
          }, error => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
          });
      }
    }
  }

  updateDemoOfferFields(msg: string) {
    const demoOffers = JSON.parse(JSON.stringify(this.demoCodeObj.DemoOffers));
    demoOffers.forEach(item => {
      item.SourceType = this.changedDemoOfferSourceType;
      item.UpdatedBy = this.userDetails.username;
    });
    const request = new UpdateOfferFieldsRequest(demoOffers, this.isChannelVisibleChanged);
    this._answerService.updateDemoOfferFields(request)
      .subscribe(response => {
        if (response.Status) {
          // update demo offer source type
          this.demoCodeObj.DemoOffers.forEach(item => {
            item.SourceType = this.changedDemoOfferSourceType;
            item.UpdatedBy = this.userDetails.username;
          });
          // update channel visiblity
          this.demoCodeObj.Magazine.forEach(item => {
            item.DemoOfferChannel.forEach(value => {
              value.IsVisible = false;
            });
          });
          setTimeout(() => { this.progressBar.close(); }, 1000);
          this.showSuccessMessage(msg);
        }
      }, error => {
        setTimeout(() => { this.progressBar.close(); }, 1000);
      });
  }

  questionFormValidation(): boolean {
    if (this.inProgress) {
      return false;
    }
    if (this.questionText.errors && this.questionText.errors.isEmpty) {
      this.showValidationMessage(this.constants.MSG_QUES_TXT_EMPTY);
      return false;
    } else if (this.code.errors && this.code.errors.isEmpty) {
      this.showValidationMessage(this.constants.MSG_CODE_EMPTY);
      return false;
    } else if (this.code.value.trim().length !== 3) {
      this.showValidationMessage(this.constants.MSG_DIG_DEMO_CODE);
      return false;
    } else if (this.answerId.errors && this.answerId.errors.unSelected) {
      this.showValidationMessage(this.constants.MSG_ANS_TYPE_EMPTY);
      return false;
    } else if (this.questionIdentifier.errors && this.questionIdentifier.errors.isEmpty) {
      this.showValidationMessage(this.constants.MSG_QUES_IDEN_EMPTY);
      return false;
    } else if (this.answeredQuestionText.errors && this.answeredQuestionText.errors.isEmpty) {
      this.showValidationMessage(this.constants.MSG_ANS_QUES_TXT_EMPTY);
      return false;
    } else if (!(Number(this.recentAnswersCount.value) >= 0)) {
      this.showValidationMessage(this.constants.MSG_RECENT_ANS_CHECK);
      return false;
    } else if (this.code.errors && this.code.errors.duplicateCode) {
      this.showValidationMessage(this.demoCodeBusinessMsg);
      return false;
    } else if (this.questionIdentifier.errors && this.questionIdentifier.errors.duplicateCode) {
      this.showValidationMessage(this.quesIdenBusinessMsg);
      return false;
    }
    return true;
  }

  showSuccessMessage(errMsg: string): void {
    this.modalSaveSuccess.open();
    this.modalMessage = errMsg;
    setTimeout(() => {
      this.modalSaveSuccess.close();
    }, 2000);
  }

  showValidationMessage(errMsg: string): void {
    this.modalValidate.open();
    this.modalMessage = errMsg;
    setTimeout(() => {
      this.modalValidate.close();
    }, 2000);
  }

  // Updates Chain Offer
  updateChainOffers(chainOffers) {
    this.chainOfferCount = (chainOffers.ForcedChainOffers
      .concat(chainOffers.ChoiceChainOffers)
      .concat(chainOffers.ChoiceToOfferChains)).length;
    this.demoCodeObj.ChainOffers = chainOffers;
  }

  updateDemoOffers(demoOffers) {
    this.answersCount = demoOffers.length;
    this.demoCodeObj.DemoOffers = demoOffers;
  }

  updateComments(updatedComments: any) {
    this.comments = updatedComments;
    this.demoCodeObj.Comments = updatedComments;
  }

  updateMagazines(updatedMagazines: any) {
    this.demoCodeObj.Magazine = updatedMagazines;
  }

  // Update the selected comments for processing
  UpdateCheckBoxValue(element, index) {
    const idx = this.selectedComments.indexOf(element);
    if (idx === -1) {
      this.selectedComments.push(element);
      this.checked[index] = true;
    } else {
      this.selectedComments.splice(idx, 1);
      this.checked[index] = false;
    }
  }

  // Submit the demo offers along with comments for processing
  submitChanges() {
    this.modalAlertSubmit.dismiss();
    const combinedComments = this.selectedComments.join('\n') + '\n' + this.additionalComments;
    let associatedMags = [];
    this.demoOfferMags = [];
    const mags = this.demoCodeObj.Magazine.filter(m => this.selectedOffers.indexOf(m.DemoOfferCode) !== -1);
    mags.forEach(item => {
      item.DemoOfferChannel.map(m => m.Mag_Code).forEach(assn => {
        this.demoOfferMags.push({ DemoOffer: item.DemoOfferCode, MagCode: assn });
      });
    });
    this.progressBar.open();
    const req = new SubmitDemoRequest(this.demoCodeObj.DemoCode.Code, this.selectedOffers, this.demoOfferMags, this.userDetails.username, combinedComments, this.userDetails.DisplayName);
    this._questionService.SubmitChanges(req)
      .subscribe(response => {
        setTimeout(() => {
          this.progressBar.close();
        }, 1000);
        this.modalMessage = response.BusinessMessage;
        if (response.Status) {
          this.modalSaveSuccess.open();
          setTimeout(() => {
            this.modalSaveSuccess.close();
            this._router.navigate(['./dashboard/questions']);
          }, 2000);
        } else {
          this.modalValidate.open();
          setTimeout(() => {
            this.modalValidate.close();
          }, 2000);
        }
      });
  }

  updateSelectedOffers(selectedDemoOffers) {
    this.selectedOffers = selectedDemoOffers;
  }

  updateMagazineCount(count) {
    this.magazineCount = count;
  }

  showAdditionalComments() {
    this._answerService.checkPendingSubmissions(this.selectedOffers.join(','))
      .subscribe(result => {
        if (result['ErrorStatus']) {
          this.modalSubmitFailure.open();
          this.modalErrorMessage = result['ErrorMessage'];

        } else {
          this._questionService.GetChangeHistory(this.selectedOffers.join(','))
            .subscribe(response => {
              this.changeHistory = response;
              this.selectedComments = [];
              this.changeHistory.forEach(item => {
                this.checked.push(true);
                this.selectedComments.push(item);
              });
            });
          this.showComments = true;
        }
      });



  }


  getMagazineCount(magazineDet) {
    let magCodes = [];
    let magazines = magazineDet.map(m => m.DemoOfferChannel);
    magazines.forEach(m => {
      m.forEach(item => {
        let mag = item.Mag_Code
        magCodes.push(mag);
      })
    })
    let uniqueMagCodes = magCodes.filter((v, i, a) => a.indexOf(v) === i);
    const magCount = uniqueMagCodes.length;
    return magCount;
  }

  showNextTab(selectedTab) {

    switch (selectedTab) {
      case
        this.constants.QT_QUESTION_ID: {
          if (this.questionForm.dirty) {
            const subscription: Subscription = this.navTabResponse.subscribe((val) => {
              subscription.unsubscribe();
              if (val) {
                if (this.demoCodeObj.DemoCode.Code === undefined || this.demoCodeObj.DemoCode.Code === null) {
                  this.showValidationMessage(this.constants.MSG_USRVW_NODEMOCODE);
                } else {
                  this.questionForm.markAsPristine();
                  this.setQuestioFormData();
                  this.selectedTab = this.constants.QT_ANSWERS_ID;
                }
              }
            });
            this.modelIsDirty.open();
          } else if (this.demoCodeObj.DemoCode.Code === undefined || this.demoCodeObj.DemoCode.Code === null) {
            this.showValidationMessage(this.constants.MSG_USRVW_NODEMOCODE);
          } else {
            this.selectedTab = this.constants.QT_ANSWERS_ID;
          }
          break;
        }
      case this.constants.QT_ANSWERS_ID: {
        this.questionsTabSelection(this.constants.QT_MAGAZINE_ID);
        //    this.selectedTab = this.constants.QT_MAGAZINE_ID;
        break;
      }
      case this.constants.QT_MAGAZINE_ID: {
        this.questionsTabSelection(this.constants.QT_COMMENTS_ID);
        //   this.selectedTab = this.constants.QT_COMMENTS_ID;
        break;
      }
      case this.constants.QT_COMMENTS_ID: {
        this.questionsTabSelection(this.constants.QT_CHAIN_OFFER_ID);
        //  this.selectedTab = this.constants.QT_CHAIN_OFFER_ID;
        break;
      }
      case this.constants.QT_CHAIN_OFFER_ID: {
        const isDirty = sessionStorage.getItem(this.constants.LS_ISALLOW);
        if (isDirty !== null && isDirty.toUpperCase() === 'N') {
          this.modelChainOfferIsDirty.open();
        } else {
          this.IsUserView = true;
          this.showComments = false;
        }

        break;
      }
      default: {
        this.selectedTab = this.constants.QT_QUESTION_ID;
        break;
      }
    }

  }

  allowChainOfferToUserview() {
    this.modelChainOfferIsDirty.close();
    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
    this.IsUserView = true;
    this.showComments = false;
  }

  prioritizeDemoChoices() {
    this.lstDemoChoices = [];
    this.showPrioritizeMessage = false;
    this.prioritizeMessage = '';
    this._questionService.getPriortizeDemoChoices(this.demoCodeObj.DemoCode.Code).subscribe((response) => {
      this.lstDemoChoices = response['DemoChoices'];
      this.showPrioritizeMessage = response['Status'].Status;
      this.prioritizeMessage = response['Status'].BusinessMessage;
      this.modelPriortizeChoices.open();
    });
  }

  setScheduleDate() {
    this.selectedDate = '';
    this.sDateDemoOfferDetails = [];
    this.sDateDemoOfferDetails = JSON.parse(JSON.stringify(this.demoCodeObj.DemoOffers));
    this.scheduleDatedemoOfferDetails = [];
    this.selectedDemoOfferDetails = [];
    if (this.sDateDemoOfferDetails && this.sDateDemoOfferDetails.length > 0) {
      this.scheduleDatedemoOfferDetails = this.sDateDemoOfferDetails.filter(x => x.StatusId == 1 || x.StatusId == 5 || x.StatusId == 7);
      this.scheduleDatedemoOfferDetails.forEach(demooffer => {
        if (new Date(demooffer.ScheduleDate) <= new Date()) {
          demooffer["Checked"] = true;
        }
        else
          demooffer["Checked"] = false;
      });
    }
    if (this.scheduleDatedemoOfferDetails.length != 0)
      this.modelSetScheduleDate.open();
  }

  UpdateScheduleDate() {
    this.noneChecked = false;
    if (typeof (this.NewscheduleDate) != "undefined") {
      this.selectedDemoOfferDetails = [];
      //Map // mdn - explore it
      for (let i = 0; i < this.scheduleDatedemoOfferDetails.length; i++) {
        if (this.scheduleDatedemoOfferDetails[i]["Checked"]) {
          let itemIndex = this.sDateDemoOfferDetails.findIndex(item => item.DemoCode == this.scheduleDatedemoOfferDetails[i].DemoCode && item.DemoOfferCode == this.scheduleDatedemoOfferDetails[i].DemoOfferCode);
          this.sDateDemoOfferDetails[itemIndex].ScheduleDate = this.formatDate(this.NewscheduleDate);
          this.scheduleDatedemoOfferDetails[i].ScheduleDate = this.formatDate(this.NewscheduleDate);
          this.selectedDemoOfferDetails.push(this.scheduleDatedemoOfferDetails[i]);
        }
      }
      if (this.selectedDemoOfferDetails.length == 0 || this.selectedDemoOfferDetails.length == null) {
        this.showErrorMessage("Select atleast one Demo offer code ");
      }
    }
    else {
      this.showErrorMessage("Select Schedule date!");
    }
  }

  SaveScheduleDates() {
    this.demoOfferSchedule = this.selectedDemoOfferDetails.map(item => new DemoOfferScheduleDate(item.DemoCode, item.DemoOfferCode, this.NewscheduleDate, item.StatusId, item.CreatedBy));
    this._answerService.UpdateDemoOfferScheduleDate(this.demoOfferSchedule).subscribe((response) => {
      this.modalMessage = response.BusinessMessage;
      this.modalSaveSuccess.open();
      if (response.Status) {
        setTimeout(() => {
          this.modalSaveSuccess.close();

          this.demoCodeObj.DemoOffers.forEach(value => {
            if (this.demoOfferSchedule.find(item => item.DemoOfferCode == value.DemoOfferCode))
              value.ScheduleDate = this.formatDate(this.NewscheduleDate);
          });

          this.isOrderChanged = false;
        }, 2000);
      }
    });
    this.modelSetScheduleDate.close();
  }

  onCheckboxChange(demoOfferCode: string) {
    let iIndex = this.scheduleDatedemoOfferDetails.findIndex(x => x.DemoOfferCode == demoOfferCode);
    this.scheduleDatedemoOfferDetails[iIndex].ScheduleDate = JSON.parse(JSON.stringify(this.demoCodeObj.DemoOffers)).find(item => item.DemoOfferCode == demoOfferCode).ScheduleDate;
  }

  CancelScheduleDatePopUp() {
    this.demoOfferSchedule = [];
    this.selectedDemoOfferDetails = [];
    this.demoCodeObj.DemoOffers = this.sDateDemoOfferDetails;
    this.modelSetScheduleDate.close();
  }

  publishPriortizeChoices() {
    if (!this.isOrderChanged) {
      this.showValidationMessage(this.constants.MSG_NO_SORTING);
      return;
    }
    if (this.showPrioritizeMessage) {
      this.modelIsExisting.open();
      const subscripOnClose: Subscription = this.modelIsExisting.onClose.subscribe(() => {
        subscripOnClose.unsubscribe();
        this.publishPriortizeChoicesService();
      });
    } else {
      this.publishPriortizeChoicesService();
    };
  }

  publishPriortizeChoicesService() {
    let order = 1;
    this.lstDemoChoices.forEach((item) => {
      item.SortOrder = order;
      order++;
    });
    const request = new PrioritizeChoiceRequest(this.selectedScheduleDate, this.lstDemoChoices);
    this._questionService.updatePrioritizeDemoChoices(request).subscribe((response) => {
      if (response.Status) {
        this.modelPriortizeChoices.close();
        this.modalMessage = response.BusinessMessage;
        this.modalSaveSuccess.open();
        setTimeout(() => {
          this.modalSaveSuccess.close();
          this.isOrderChanged = false;
        }, 2000);
        // sort demo choices in demo offers in democodeobj
        this.demoCodeObj.DemoOffers.forEach(value => {
          value.DemoOffer_Choice.forEach(item => {
            const choiceDetails = this.lstDemoChoices.filter(choice => choice.DemoChoiceCode === item.DemoChoiceCode);
            if (choiceDetails.length > 0) {
              item.SortOrder = choiceDetails[0].SortOrder;
            }
          });
          value.DemoOffer_Choice.sort(function (a, b) {
            return parseFloat(a.SortOrder) - parseFloat(b.SortOrder);
          });
        });
      }
    });
  }

  dropSuccess() {
    this.isOrderChanged = true;
  }

  deleteDemoCode() {
    this.modalDeleteDemo.open();
    this.constants.ALERT_QT_SUMMARY_DELETE;

  }

  demoValidate() {
    this.modalDeleteDemo.close();
    this._questionService.deleteDemoCodeDetails(this.demoCodeObj.DemoCode.Code, this.userDetails.username, this.userDetails.DisplayName).subscribe((data) => {
      if (data.Status) {
        this.modalDeleteSuccess.open();
        this.modalMessage = data.BusinessMessage;
        setTimeout(() => {
          this.modalDeleteSuccess.close();
          this._router.navigate(['./dashboard/questions']);
        }, 2000);
      } else {
        this.modalDemoLocked.open();
        this.modalMessage = data.BusinessMessage;
        setTimeout(() => {
          this.modalDemoLocked.close();
        }, 2000);
      }

    });
  }

  // Updates Status after recall - if D.C is in Pending
  updateStatus(dcStatus) {
    this.status = dcStatus.StatusType;
    this.demoCodeDetails.Status = dcStatus.StatusType;
    this.demoCodeDetails.StatusId = dcStatus.StatusId;
    this.enableFormControls();
  }

  updatePostRecall(demoCode) {
    this.demoCodeObj = demoCode;
    const chainOffer = this.demoCodeObj.ChainOffers;
    this.answersCount = this.demoCodeObj.DemoOffers.length;
    this.chainOfferCount = (chainOffer.ForcedChainOffers.concat(chainOffer.ChoiceChainOffers)).length;
    const magazine = this.demoCodeObj.Magazine;
    this.magazineCount = this.getMagazineCount(magazine);
  }

  clearPinnedFilter() {
    this.filteredDemoOffer = '';
    this._sharedSVC.updateFilteredDemoOffer(this.filteredDemoOffer);
    sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.filteredDemoOffer));
  }

  restrictSpecialCharacters(event, validateAlphaNumerics) {
    var k = event.charCode;
    if (validateAlphaNumerics) {
      return (k >= 48 && k <= 57);
    } else {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
  }

  onDemoCodeSelect(demoCode: string) {
    this._router.navigate(['./dashboard/questions/view']);
    setTimeout(() => {
      sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(demoCode));
    }, 100);
  }

  // show and hide warning message
  showErrorMessage(errorMsg) {
    this.errorMessage = errorMsg;
    this.showError = true;
    setTimeout(() => {
      this.errorMessage = '';
      this.showError = false;
    }, 2500);
  }

  onScheduleDateChange(event) {
    if (event.value.trim() !== '') {
      this.isValidSCHdate = event.valid;
      if (this.isValidSCHdate) {
        this.NewscheduleDate = event.value;
        this.selectedDate = event.value;
      } else {
        this.isValidSCHdate = false;
      }
    }
  }
  // Formats date from javascript Date format to myDatePicker format (year:2017,month:01,day:01)
  formatDate(scDate): any {
    var d = new Date(scDate);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    const editdate: any = curr_year + "-" + curr_month + "-" + curr_date + "T00:00:00Z";
    return editdate;
  }
  // Formats date from  myDatePicker format (year:2017,month:01,day:01) to javascript Date format
  changeDateFormats(dateToChange) {
    const changedDate = dateToChange.month + '/' + dateToChange.day + '/' + dateToChange.year;
    this.selectedDate = changedDate;
  }
  onDateChanged(event) {
    let d: Date = event.value;
    d.setDate(d.getDate());
    let copy: IMyDpOptions;
    copy.disableUntil = { year: 2018, month: 1, day: 23 };
  }
}

export interface DemoOfferMags {
  DemoOffer: string;
  MagCode: string;
}
