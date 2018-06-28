import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService, CommonService, QuestionService } from '../_services/index';
import { Constants, DigitalDemos, Roles, DigitalDemoRequest } from '../_models/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-admin-tables',
  templateUrl: './admin-tables.component.html',
  styleUrls: ['./admin-tables.component.css']
})
export class AdminTablesComponent implements OnInit {

  // modals
  //@ViewChild('modelDemoCode')
  //modelDemoCode: BsModalComponent;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  //@ViewChild('modalSaveSuccess')
  //modalSaveSuccess: BsModalComponent;
  //@ViewChild('modelIsDirty')
  //modelIsDirty: BsModalComponent;
  // Declarations
  constants = Constants;
  //digitalDataType = this.constants.KEY_DEMOCODE;
  data: any = [];
  //currentDigitalDemo: DigitalDemos;
  //selectedDigitalDemo: DigitalDemos;
  //showError = false;
  //errorMessage = '';
  //demoofferCode = '';
  //modalMessage = '';
  //isAdd = false;
  //selectedIndex = -1;
  role: any;
  isDisabled = true;
  sortBy = this.constants.AT_SUMMARY_SORTBY;
  sortOrder = this.constants.AT_SUMMARY_SORTORDER;
  rowsOnPage = this.constants.AT_SUMMARY_ROWSPERPAGE;
  freeTextSearch = '';
  selectedIndex = [0];
  //modified = false;
  //modifiedDemoCode = false;
  //modifiedDescription = false;

  constructor(private _sharedSVC: SharedService, private _commonSvc: CommonService, private _questionService: QuestionService) {
    this._sharedSVC.setActiveTab(this.constants.PCA_DIGITAL);
  }

  ngAfterViewInit() { this.progressBar.open(); }

  ngOnInit() {
    this._commonSvc.getDigitalData().subscribe(result => {
      this.data = result;
      setTimeout(() => {
        this.progressBar.close();
      }, 1000);     
    }, error => {
      setTimeout(() => { this.progressBar.close(); }, 1000);
    });
    //this.selectedDigitalDemo = new DigitalDemos('', '', []);
    this.role = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).roles;
    if (this.role.indexOf(Roles.TCS) > -1 || this.role.indexOf(Roles.Admin) > -1) {
      this.isDisabled = false;
    }
  }

  // CME-7077 - Commented this method - Priya
  //// Add new digital demo code
  //addNewDigitalDemo() {
  //    this.selectedDigitalDemo = new DigitalDemos('', '', []);
  //    this.modelDemoCode.open();
  //    this.isAdd = true;
  //    this.selectedIndex = -1;
  //    this.demoofferCode = '';
  //}

  // Edit existing digital demo code
  //editDigitalDemo(demo: DigitalDemos, index: number) {
  //    this.selectedDigitalDemo = JSON.parse(JSON.stringify(demo));
  //    this.currentDigitalDemo = demo;
  //    this.modelDemoCode.open();
  //    this.isAdd = false;
  //    this.selectedIndex = index;
  //    this.demoofferCode = '';
  //}
  // CME-7077 - Commented this method - Priya
  //// Add new demo offer code to digital demo code
  //addNewDemoOffer() {
  //    if (this.demoofferCode.trim().length !== 4) {
  //        this.showErrorMessage(this.constants.MSG_DIG_DEMO_OFFER);
  //    } else {
  //        this.progressBar.open();
  //        this._questionService.checkCodeIsUnique(this.demoofferCode, 'DemoOfferCode')
  //            .subscribe(res => {
  //                if (!res.Status) {
  //                    this.showErrorMessage(res.BusinessMessage);
  //                } else {
  //                    this.selectedDigitalDemo.DemoOfferCodes.push(this.demoofferCode.trim());
  //                    this.modified = true;
  //                    this.demoofferCode = '';
  //                }
  //                setTimeout(() => {
  //                    this.progressBar.close();
  //                }, 1000);
  //            }, error => {
  //                setTimeout(() => { this.progressBar.close(); }, 1000);
  //            });
  //    }
  //}

  //// Delete demo offer code from digital demo code
  //deleteDemoOffer(offer, index) {
  //    this.selectedDigitalDemo.DemoOfferCodes.splice(index,1);
  //}

  // Validate demo code and demo offer code before save
  //validateChanges() {
  //    if (this.selectedDigitalDemo.DemoCode.trim().length !== 3) {
  //        this.showErrorMessage(this.constants.MSG_DIG_DEMO_CODE);
  //        return false;
  //    } else if (this.selectedDigitalDemo.DemoCode.trim() === '') {
  //        this.showErrorMessage(this.constants.MSG_DIG_DESC);
  //        return false;
  //    } else if (this.selectedDigitalDemo.DemoOfferCodes.length === 0) {
  //        this.showErrorMessage(this.constants.MSG_DIG_DEMO_OFFER_VAL);
  //        return false;
  //    } else {
  //        for (let i = 0; i < this.selectedDigitalDemo.DemoOfferCodes.length; i++) {
  //            const duplicateOffers = Object.assign([], this.selectedDigitalDemo.DemoOfferCodes).filter(item => item.toUpperCase() === this.selectedDigitalDemo.DemoOfferCodes[i].toUpperCase());
  //            if (duplicateOffers.length > 1) {
  //                let msg = 'Demo Offer Code ' + duplicateOffers.join(',') + ' already exists in the system';
  //                this.showErrorMessage(msg);
  //                return false;
  //            }
  //        }
  //    }
  //    return true;
  //}

  // Save digital demo code details
  //saveDigitalDemos() {
  //    if (this.validateChanges()) {
  //        this.progressBar.open();
  //        if (this.isAdd) {
  //            this._questionService.checkCodeIsUnique(this.selectedDigitalDemo.DemoCode.trim(), 'DemoCode')
  //                .subscribe(res => {
  //                    if (!res.Status) {
  //                        this.showErrorMessage(res.BusinessMessage);
  //                        setTimeout(() => {
  //                            this.progressBar.close();
  //                        }, 1000);
  //                    } else {
  //                        this.upsertDigitalData();
  //                    }
  //                });
  //        } else {
  //            this.upsertDigitalData();
  //        }
  //    }
  //}

  //upsertDigitalData() {
  //    var requestData = new DigitalDemoRequest(this.selectedDigitalDemo, this.isAdd);
  //    this._commonSvc.upsertDigitalData(requestData).subscribe(response => {
  //        setTimeout(() => {
  //            this.progressBar.close();
  //        }, 1000);
  //        this.modified = false;
  //        if (response.Status) {
  //            this.modelDemoCode.close();
  //            this.modalMessage = response.BusinessMessage;
  //            this.modalSaveSuccess.open();
  //            setTimeout(() => {
  //                this.modalSaveSuccess.close();
  //            }, 2000);

  //            // update result
  //            if (this.isAdd) {
  //                this.data.push(this.selectedDigitalDemo);
  //            } else {
  //                const index = this.data.findIndex(val => val.DemoCode === this.selectedDigitalDemo.DemoCode);
  //                if (index > -1) {
  //                    this.data.splice(index, 1, this.selectedDigitalDemo);
  //                }
  //            }
  //        } else {
  //            this.showErrorMessage(response.BusinessMessage);
  //            setTimeout(() => {
  //                this.selectedDigitalDemo = JSON.parse(JSON.stringify(this.currentDigitalDemo));
  //                this.showErrorMessage('Changes Reverted');
  //            }, 2000);
  //        }
  //    }, error => {
  //        const errMsg = error.status ? (error.statusText + ' - ' + (error.json().ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
  //        this.showErrorMessage(errMsg);
  //        setTimeout(() => { this.progressBar.close(); }, 1000);
  //    });
  //}

  //// show and hide warning message
  //showErrorMessage(errorMsg) {
  //    this.errorMessage = errorMsg;
  //    this.showError = true;
  //    setTimeout(() => {
  //        this.errorMessage = '';
  //        this.showError = false;
  //    },2500);
  //}

  //trackByDemoCode(index: number, data: any): string {
  //    return data.DemoCode;
  //}

  //onDemoCodeChange(event) {
  //    this.modified = true;
  //}

  //onDescriptionChange(event) {
  //    this.modified = true;
  //}
  //allowExit() {
  //    if (this.modified || this.modifiedDemoCode || this.modifiedDescription) {
  //        this.modelIsDirty.open();
  //    } else {
  //        this.modelDemoCode.close();
  //        }        
  //}

  // show selected demo offer history details

  showDetails(index: number): void {
    const ind = this.selectedIndex.indexOf(index, 0);
    if (ind > -1) {
      this.selectedIndex.splice(ind, 1);
    } else {
      this.selectedIndex.push(index);
    }
  }

}
