import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRangeSliderComponent } from 'ng2-ion-range-slider';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { QuestionService, SharedService } from '../../_services/index';
import { Constants, DemoCode, Roles, Status, AnswerTypes } from '../../_models/index';


@Component({
  selector: 'app-view-demos',
  templateUrl: './view-demos.component.html',
  styleUrls: ['./view-demos.component.css']
})
export class ViewDemosComponent implements OnInit, OnDestroy {

  // Declarations
  constants = Constants;
  selectedTab: string;
  demoCode: string;
  DBType: string;
  DemoCodeModel: DemoCode;
  ForcedChainOffer = [];
  ChoiceChainOffer = [];
  ChoiceToOfferChain = [];
  selectedForcedChain = -1;
  selectedChoiceChain = -1;
  choiceToOfferIndex = -1;
  searchDemoOffer = '';
  IsUserView: boolean;
  DemoOffers = [];
  associatedMagList: any;
  private unsubscribe: Subject<void> = new Subject<void>();
  demoOfferChannel: any[];
  userDetails;
  lockedUserId: string;
  lockedUser: string;
  isLocked = false;
  UserViewMessage = '';
  UserViewHasErrors = false;
  DemoCodeObj: any;
  Comments = [];
  freeTextSearch = '';
  isEditable = false;
  userRoles: any;
  isMktManager = false;
  isAdmin = false;
  answerType = AnswerTypes;
  //  isMagDisabled: boolean;
  // Count Variables
  demoOfferCount = 0;
  magazineCount = 0;
  chainOffersCount = 0;
  lstDemoChoices: any = [];
  filteredDemoOffer: string;
  demoCodeDetails: any;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;

  @ViewChild('modelPriortizeChoices')
  modelPriortizeChoices: BsModalComponent;

  constructor(private _router: Router, private _sharedSVC: SharedService, private _questionSVC: QuestionService) {
    this._sharedSVC.setActiveTab(this.constants.PCA_QUESTIONS);
    this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(searchText => {
      this.filteredDemoOffer = searchText;
      this.freeTextSearch = searchText;
    });
  }

  ngAfterViewInit() { this.progressBar.open(); }

  ngOnInit() {
    this.selectedTab = this.constants.QT_QUESTION_ID;
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userRoles = this.userDetails.roles;
    this.isMktManager = this.userRoles.indexOf(Roles.Marketers) > -1 ? true : false;
    this.isAdmin = this.userRoles.indexOf(Roles.Admin) > -1 ? true : false;
    this.demoCode = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_CODE));
    this.filteredDemoOffer = JSON.parse(sessionStorage.getItem(this.constants.LS_FILTRED_DEMO_OFFER));
    this._questionSVC.ViewDemoCode(this.demoCode, this.userDetails.username, this.userDetails.DisplayName)
      .takeUntil(this.unsubscribe)
      .subscribe(demoCodeDet => {
        if (demoCodeDet !== null) {
          this.demoCodeDetails = demoCodeDet;
          this.DemoCodeObj = demoCodeDet;
          this.DemoCodeModel = demoCodeDet.DemoCode;
          this.DemoOffers = demoCodeDet.DemoOffers;
          this.demoOfferChannel = demoCodeDet.Magazine;
          this.demoOfferCount = this.DemoOffers.length;
          const chainOffers = demoCodeDet.ChainOffers;
          this.ForcedChainOffer = chainOffers.ForcedChainOffers == null ? [] : chainOffers.ForcedChainOffers;
          this.ChoiceChainOffer = chainOffers.ChoiceChainOffers == null ? [] : chainOffers.ChoiceChainOffers;
          this.ChoiceToOfferChain = chainOffers.ChoiceToOfferChains == null ? [] : chainOffers.ChoiceToOfferChains;
          this.chainOffersCount = this.ForcedChainOffer.length + this.ChoiceChainOffer.length + this.ChoiceToOfferChain.length;
          this.magazineCount = this.getMagazineCount(this.demoOfferChannel);
          // TODO: replace picking up demo offers from the demo offers tab rather than magazines list
          this.DBType = this.DemoCodeModel.IsCDBModel === true ? this.constants.LBL_DATABASE_CBD : this.constants.LBL_DATABASE_CP;
          this.DBType === this.constants.LBL_DATABASE_CBD ? true : false;
          // localStorage.setItem(this.constants.LS_DEMO_CODE_MODEL, JSON.stringify(demoCodeDet));
          this.lockedUser = demoCodeDet.LockedUserName;
          this.lockedUserId = demoCodeDet.LockedUserID;
          if (demoCodeDet.IsLocked) {
            this.isLocked = true;
          } else {
            this.isLocked = false;
          }
          const editableStatus = [Status.Draft, Status.Returned, Status.Active, Status.Pending];
          const allowEditByStatus = editableStatus.indexOf(this.DemoCodeModel.Status) > -1 ? true : false;
          if (this.DemoCodeObj.Comments.length > 0) { this.Comments = this.DemoCodeObj.Comments; }
          this.isEditable = (this.isMktManager || this.isAdmin) && !this.isLocked && allowEditByStatus;
          sessionStorage.setItem(this.constants.LS_DEMO_OFFER_COUNT, JSON.stringify(this.demoOfferCount));
          setTimeout(() => {
            this.progressBar.close();
          });
        }
        // Sets User view as default view.
        this.IsUserView = true;
        this.freeTextSearch = this.filteredDemoOffer;
        //this.searchDemoOffer = this.filteredDemoOffer;
      }, error => { this.progressBar.close(); });
  }


  // Shows selected tab
  questionsTabSelection(tabName): void {
    this.selectedTab = tabName;
  }

  // Closes View and goes back to summary
  closeView(): void {
    this._router.navigate(['./dashboard/questions']);
  }

  // Edit DemoCode
  EditDemoCode(): void {
    this._router.navigate(['./dashboard/questions', 'edit']);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onclick() {
    //   this._questionSVC.getDemoOfferChannel('FMV').subscribe((data) => this.demoOffer = data)
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

  prioritizeDemoChoices() {
    this.lstDemoChoices = [];

    this._questionSVC.getPriortizeDemoChoices(this.DemoCodeObj.DemoCode.Code).subscribe((response) => {
      this.lstDemoChoices = response['DemoChoices'];
      this.modelPriortizeChoices.open();
    });
  }

  clearPinnedFilter() {
    this.freeTextSearch = '';
    this.filteredDemoOffer = '';
    this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.filteredDemoOffer));
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
