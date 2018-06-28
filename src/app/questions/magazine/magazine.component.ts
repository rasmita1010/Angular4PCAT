import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Constants, Magazine, MagazineChannel, DemoOfferMagazineChannel, ApplicationStatus, DemoOfferDetails, ChoiceChainOffers, ForcedChainOffers } from '../../_models/index';
import { QuestionService } from '../../_services/questions/question.service';
import { MagazineChannelDelete } from '../../_models/magazinechanneldelete';
import { SharedService } from '../../_services/shared/shared.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { error } from 'selenium-webdriver';


@Component({
  selector: 'app-magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.css']
})
export class MagazineComponent implements OnInit, OnDestroy {
  magazineList: any;
  channelMetadata: any;
  channelList = [];
  @Input() demoCode: any;
  @Output() updateMagazines = new EventEmitter<any>();
  @Output() updateMagazineCount = new EventEmitter<any>();
  @Output() updatedDemoOffers = new EventEmitter<any>();
  @Output() clearFilter = new EventEmitter<any>();
  @Input() filteredDemoOffer;
  // Declarations
  selectedMagazine: string;
  demoOffers = [];
  showMagazine = true;
  showThisMag = false;
  showMagazineButton = true;
  showChannel: boolean;
  showVisible: boolean;
  selectedChannel: string;
  selectedDemoOfferIndex = -1;
  magazineChannel: MagazineChannel[] = [];
  addChannel = true;
  magazine: Magazine[];
  selectedMag: string;
  selectedDO: string;
  checkBoxValue = false;
  selectedDemoOffer: string;
  // selectedmagCode: string;
  sortOrder: number;
  Ispublished = false;
  userName: string;
  constants = Constants;
  datetoday = new Date();
  demoOfferChannel: DemoOfferMagazineChannel[];
  activeDemoOfferChannel: DemoOfferMagazineChannel[];
  demoOffAssociations = [];
  savedMagazineChannels = [];
  demoCodee: string;
  magazineChannelDeleteObj: MagazineChannelDelete;
  selectedDemoCode: string;
  routeParam: any;
  paramValue: any;
  selectedDemoOffers;
  modalMessage: string;
  questionMessage: string;
  mag: any;
  freeTextSearch = '';
  isMagazineDisabled: boolean;
  magazineCount: number;
  magForDemoOffer: string;
  demoOffersList: DemoOfferDetails[] = [];
  Status: any;
  demoOfferCount: string;
  modifiedDemoOffer: string;
  selectedChainOffer: any;
  demoCodeStatus: string;
  modifiedOffer = '';
  selectedIndex = [0];
  isEnabled = true;

  @ViewChild('modalSaveSuccess')
  modalSaveSuccess: BsModalComponent;
  @ViewChild('modalDeleteSuccess')
  modalDeleteSuccess: BsModalComponent;
  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;
  @ViewChild('modalDeleteMagazine')
  modalDeleteMagazine: BsModalComponent;
  @ViewChild('modalDeleteChannel')
  modalDeleteChannel: BsModalComponent;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  @ViewChild('modelIsDirty')
  modelIsDirty: BsModalComponent;
  // To Unsubscribe Observables
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private _service: QuestionService, private _route: ActivatedRoute, private _router: Router, private _sharedSVC: SharedService) {
    this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(demoOffer => {
      this.filteredDemoOffer = demoOffer;
      this.freeTextSearch = this.filteredDemoOffer;
    });
  }

  ngOnInit() {
    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
    this.modifiedOffer = '';
    this.loadInitialState();
  }

  loadInitialState() { // Fetch the required local storage values and initialize
    this.demoOfferChannel = [];
    this.userName = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS)).username;
    this.channelMetadata = JSON.parse(localStorage.getItem(this.constants.LS_CHANNEL_METADATA));
    this.Status = JSON.parse(localStorage.getItem(this.constants.LS_STATUS_METADATA));
    this.demoOfferCount = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_OFFER_COUNT));
    this.magazineList = JSON.parse(localStorage.getItem('userDetails')).resources;
    this.demoCodeStatus = this.demoCode.DemoCode.Status;
    this.isMagazineDisabled = this.demoCode.DemoCode.IsCDBModel === true ? true : false;
    this.selectedDemoCode = this.demoCode.DemoCode.Code;
    this.demoOffersList = this.demoCode.DemoOffers;
    this.freeTextSearch = this.filteredDemoOffer;
    this.selectedChainOffer = this.demoCode.ChainOffers;
    this.routeParam = this._route.params.subscribe(params => {
      this.paramValue = params['action'];
      switch (this.paramValue.toLowerCase()) {
        case this.constants.MSG_ROUTE_CREATE:
          this.demoOffAssociations = JSON.parse(JSON.stringify(this.demoCode.Magazine));
          break;
        case this.constants.MSG_ROUTE_EDIT:
          this.demoOffAssociations = JSON.parse(JSON.stringify(this.demoCode.Magazine));
          break;
        default: break;
      }
    });
    // converting server side response structure to required client side entity object structure
    this.demoOffAssociations.forEach((item, index) => {
      const magNames = item.DemoOfferChannel.map(d => d.MagazineName);
      const magList = [];
      const uniqueMagazines = magNames.filter((v, i, a) => a.indexOf(v) === i); // Getting unique magazines
      uniqueMagazines.forEach(code => { // Assigning channel list for each magazine
        magList.push(new Magazine(code, item.DemoOfferChannel.filter(c => c.MagazineName === code), this.isPublished(item.DemoOfferChannel.filter(c => c.MagazineName === code))));
      });
      const availableItems = this.magazineList.filter(m => uniqueMagazines.indexOf(m.Description) === -1);
      this.demoOfferChannel.push(new DemoOfferMagazineChannel(item.DemoOfferCode, magList, availableItems)); // Assigning magazine list for each demoOffer
    });
    this.magazineCount = this.getMagazineCount(this.demoOffAssociations);
    this.updateMagazineCount.emit(this.magazineCount);
    this.activeDemoOfferChannel = JSON.parse(JSON.stringify(this.demoOfferChannel));
  }

  allowDemoOfferChanges(demoOffer: string) {
    if (this.modifiedOffer === '' || this.modifiedOffer === demoOffer) {
      return true;
    } else {
      this.modelIsDirty.open();
      this.modalMessage = 'Changes made to demoOffer ' + this.modifiedOffer + ' will be lost. Do you want to cancel the changes?';
    }
  }

  allowNavigation() {
    this.ngOnInit();
    this.modelIsDirty.close();
  }

  // onMagazineSelection - After magazine selected from dropdown
  onMagazineSelection(magDet: any, num: number, demoOffer: string) {
    if (this.allowDemoOfferChanges(demoOffer)) {
      this.showMagazine = true;
      this.showThisMag = false;
      // this.selectedmagCode = magDet.ResourceName;
      this.magForDemoOffer = demoOffer;
      this.showMagazineButton = true;
      this.selectedMagazine = magDet;
      this.selectedDemoOfferIndex = num;
      this.magazineChannel = [];
      const magObject = new Magazine(magDet, this.magazineChannel, false, true);
      this.demoOfferChannel[num].magazineList.push(magObject); // Associating selected magazine to the demoOffer
      this.filterMagazines(num); // Remove selected magazine from  dropdown
      const ind = this.selectedIndex.indexOf(num, 0);
      if (ind === -1) {
        this.selectedIndex.push(num);
      }
    }
  }

  // onChannelSelection - After Channel selected from channel List
  onChannelselction(channel: any, index: number, demoOffer: string, magDetails: any) {
    if (this.allowDemoOfferChanges(demoOffer)) {
      const isallow = 'N';
      sessionStorage.setItem(this.constants.LS_ISALLOW, isallow);
      this.modifiedOffer = demoOffer;
      this.showVisible = true;
      this.selectedChannel = channel.ChannelName;
      this.selectedMag = '';
      this.selectedDO = '';
      const magCode = this.magazineList.filter(m => m.Description === magDetails.MagazineName)[0].ResourceName;
      const magazineObject = new MagazineChannel(demoOffer, magCode, magDetails.MagazineName, channel.ChannelId, this.checkBoxValue, index + 1, this.Ispublished, this.userName, this.datetoday, this.selectedChannel, 0, 'add', this.selectedDemoCode, channel.ChannelCode);
      const magAssociations = this.demoOfferChannel.filter(d => d.demoOffer === demoOffer)[0].magazineList;
      const mag = magAssociations.filter(m => m.MagazineName === magDetails.MagazineName)[0];
      mag.channelList.push(magazineObject); // Associating  selected channels to the magazine
    }
  }

  // Deletes selected Magazines
  deleteDemoOfferMagazine(demoOffer: string, details: Magazine, index) {
    if (this.allowDemoOfferChanges(demoOffer)) {
      if (details.added) {
        this.deleteUnsavedMagazine(demoOffer, details.MagazineName, index);
      }
      else {
        // validating whether magazine linked to chain offers before deleting
        let choiceChainOffers: ChoiceChainOffers[];
        let forcedChainOffers: ForcedChainOffers[];
        let choiceChainOffersConflict = 0;
        let forcedChainOffersConflict = 0;
        forcedChainOffers = this.selectedChainOffer.ForcedChainOffers;
        choiceChainOffers = this.selectedChainOffer.ChoiceChainOffers;
        if (forcedChainOffers.length > 0) {
          forcedChainOffersConflict = this.validateMagazineChainOffer(forcedChainOffers, details.MagazineName, demoOffer);
        }
        if (forcedChainOffersConflict === 0 && choiceChainOffers.length > 0) {
          choiceChainOffersConflict = this.validateMagazineChainOffer(choiceChainOffers, details.MagazineName, demoOffer);
        }
        if (choiceChainOffersConflict === 0 && forcedChainOffersConflict === 0) {
          this.magazineChannelDeleteObj = new MagazineChannelDelete(demoOffer, details.MagazineName, 0, this.selectedDemoCode, this.userName);
          this.modalDeleteMagazine.open();
          this.questionMessage = ' Do you want to delete ' + details.MagazineName + ' of demoOffer ' + demoOffer + '?';
        }
      }
    }
  }

  deleteMagazine() { // Server call for deleting selected Magazine and fetching response
    //this.modifiedOffer = this.magazineChannelDeleteObj.DemoOffer;
    //const isallow = 'N';
    //localStorage.setItem(this.constants.LS_ISALLOW, isallow);
    this.modalDeleteMagazine.close();
    this.progressBar.open();
    this._service.deleteDemoOfferMagazine(this.magazineChannelDeleteObj).subscribe((response) => {
      setTimeout(() => {
        this.progressBar.close();
      }, 1000);
      if (response) {
        this.modalMessage = response.Response.BusinessMessage;
        this.modalDeleteSuccess.open();
        setTimeout(() => {
          this.modalDeleteSuccess.close();
          this.demoOffAssociations = response.magazineAssociations;
          this.updateMagazines.emit(this.demoOffAssociations);
          this.updateSaveDemoOffers(this.magazineChannelDeleteObj.DemoOffer);
          this.loadInitialState();
        }, 3000);
      } else {
        alert('Error in Deleting records');
      }
    }, error => {
      setTimeout(() => { this.progressBar.close(); }, 1000);
    });
  }

  // Deletes selected demoOffer Magzine channels
  deleteDemOfferChannel(demoOffer: string, item: any, magDetails: MagazineChannel) {
    if (this.allowDemoOfferChanges(demoOffer)) {
      if (magDetails.DemoOfferChannelId === 0) {
        this.deleteUnsavedChannel(item, magDetails);
      }
      else {
        this.magazineChannelDeleteObj = new MagazineChannelDelete(demoOffer, magDetails.MagazineName, magDetails.ChannelId, this.selectedDemoCode, this.userName);
        this.modalDeleteChannel.open();
        this.questionMessage = 'Do you want to delete ' + magDetails.ChannelName + ' of Magazine ' + magDetails.MagazineName + '?';
      }
    }
  }
  // Server call for deleting selected channels and fetching response
  deleteChannel() {
    //this.modifiedOffer = this.magazineChannelDeleteObj.DemoOffer;
    //const isallow = 'N';
    //localStorage.setItem(this.constants.LS_ISALLOW, isallow);
    this.modalDeleteChannel.close();
    this.progressBar.open();
    this._service.deleteDemoOfferMagazine(this.magazineChannelDeleteObj).subscribe((response) => {
      setTimeout(() => {
        this.progressBar.close();
      }, 1000);
      if (response) {
        this.modalMessage = response.Response.BusinessMessage;
        this.modalDeleteSuccess.open();
        setTimeout(() => {
          this.modalDeleteSuccess.close();
          this.demoOffAssociations = response.magazineAssociations;
          this.updateMagazines.emit(this.demoOffAssociations);
          this.updateSaveDemoOffers(this.magazineChannelDeleteObj.DemoOffer);
          this.loadInitialState();
        }, 2000);
      } else {
        alert('Error in Deleting records');
      }
    }, error => {
      setTimeout(() => { this.progressBar.close(); }, 1000);
    });
  }

  // Updates any changes to channels and validates for existing magazine channel combination
  CheckExistingMagazineCombination(checked: boolean, channelName: string, magazineName: string, demoOffer: string, magDetails: any, channelId: number) {
    if (this.modifiedOffer === '' || this.modifiedOffer === demoOffer) {
      if (checked === true) {
        const channels = [];
        let count = 0;
        const magList = this.activeDemoOfferChannel.map(m => m.magazineList);
        // Fetching the list of all channelList from each demoOffer
        magList.forEach(item => {
          item.forEach(m => {
            const channel = m.channelList;
            channels.push(channel);
          });
        });
        channels.forEach(m => {
          let existing = m.filter(item => item.MagazineName === magazineName && item.ChannelName === channelName && item.IsVisible === true && item.DemoOfferCode !== demoOffer);
          if (existing[0] !== undefined) {
            count++;
          }
        });
        if (count > 0) {
          this.modalValidate.open();
          this.modalMessage = 'The combination of Magazine ' + magazineName + ' and Channel ' + channelName + ' is already set to visible on another offer ';
          setTimeout(() => {
            let index = this.getIndex(demoOffer, magDetails.MagazineName, channelId);
            this.mag.channelList[index].IsVisible = false;
            sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
            this.modalValidate.close();
          }, 3000);
        } else {
          this.modifiedOffer = demoOffer;
          const index = this.getIndex(demoOffer, magDetails.MagazineName, channelId);
          this.updateVisiblity(index);
          const isallow = 'N';
          sessionStorage.setItem(this.constants.LS_ISALLOW, isallow);
        }
      } else {
        this.modifiedOffer = demoOffer;
        const index = this.getIndex(demoOffer, magDetails.MagazineName, channelId);
        this.updateVisiblity(index);
        const isallow = 'N';
        sessionStorage.setItem(this.constants.LS_ISALLOW, isallow);
      }
    } else {
      setTimeout(() => {
        let index = this.getIndex(demoOffer, magDetails.MagazineName, channelId);
        this.mag.channelList[index].IsVisible = !this.mag.channelList[index].IsVisible;
      }, 1500)
      this.modelIsDirty.open();
      this.modalMessage = 'Changes made to demoOffer ' + this.modifiedOffer + ' will be lost. Do you want to cancel the changes?';

    }
  }

  // Saves the created or updated magazines and channels
  OnSave(demoOffer: string) {
    if (this.allowDemoOfferChanges(demoOffer)) {
      const selectedDemoOffer = this.demoOfferChannel.find(item => item.demoOffer === demoOffer);
      const selectedChannels = selectedDemoOffer.magazineList.map(r => r.channelList);
      const demoOffChannels = [];
      selectedChannels.forEach(item => {
        item.forEach(magChannel => {
          demoOffChannels.push(magChannel);
        });
      });
      const finalList = demoOffChannels.filter(item => item.ChangeType != null);
      if (finalList.length !== 0) {
        this.progressBar.open();
        // Validate the linked Digital Demo for magazine association
        // Demo Offer <AAA> is linked to a Digital Offer <DDD> which is not associated with magazine <XX>.
        this._service.validateDigitalLink(finalList).subscribe(
          response => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
            if (!response.Status) {
              this.modalValidate.open();
              this.modalMessage = response.BusinessMessage;
              setTimeout(() => {
                this.modalValidate.close();
              }, 2000);
            }
            else {
              this._service.saveDemoOfferChannel(finalList).subscribe(
                response => {
                  setTimeout(() => { this.progressBar.close(); }, 1000);
                  if (response != null) {
                    this.modalSaveSuccess.open();
                    this.modalMessage = response.Response.BusinessMessage;
                    setTimeout(() => {
                      this.modalSaveSuccess.close();
                      this.modifiedOffer = '';
                      sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
                      this.demoOffAssociations = response.magazineAssociations;
                      this.updateMagazines.emit(this.demoOffAssociations);
                      this.updateSaveDemoOffers(selectedDemoOffer.demoOffer);
                      this.loadInitialState();
                    }, 2000);
                  }
                }, error => {
                  setTimeout(() => { this.progressBar.close(); }, 1000);
                });
            }
          }, error => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
          });
      }
    }
    else {
      this.modalValidate.open();
      this.modalMessage = this.constants.MSG_MAGAZINE_UNMODIFIED_SAVE;
      setTimeout(() => {
        this.modalValidate.close();
      }, 2000);
    }
  }

  // Validates and remove selected channels
  setChannels(demoOffer, item) {
    if (this.allowDemoOfferChanges(demoOffer)) {
      const associatedChannels = item.channelList.map(m => m.ChannelName);
      this.selectedMag = item.MagazineName;
      this.selectedDO = demoOffer;
      this.channelList = this.channelMetadata.filter(m => associatedChannels.indexOf(m.ChannelName) === -1);
    }
  }

  // To get the index of the channel from the channel list
  getIndex(demoOffer: string, magazineName: string, channelId: number): number {
    const magAssociations = this.demoOfferChannel.filter(d => d.demoOffer === demoOffer)[0].magazineList;
    this.mag = magAssociations.filter(m => m.MagazineName === magazineName)[0];
    const index = this.mag.channelList.findIndex(m => m.ChannelId === channelId);
    return index;
  }

  // Add change type to the channel List
  updateVisiblity(index: number) {
    if (this.mag.channelList[index].DemoOfferChannelId === 0) {
      this.mag.channelList[index].ChangeType = 'add';
    } else {
      this.mag.channelList[index].ChangeType = 'edit';
    }
    this.mag.channelList[index].DemoCode = this.selectedDemoCode;
  }

  // get the unique magazine count
  getMagazineCount(magazineDet) {
    const magCodes = [];
    const magazines = magazineDet.map(m => m.DemoOfferChannel);
    magazines.forEach(m => {
      m.forEach(item => {
        let mag = item.Mag_Code;
        magCodes.push(mag);
      });
    });
    let uniqueMagCodes = magCodes.filter((v, i, a) => a.indexOf(v) === i);
    const magCount = uniqueMagCodes.length;
    return magCount;
  }

  // To check whether magazine has  been already published
  isPublished(details) {
    let isPublished: boolean;
    let count = 0;
    details.forEach(item => {
      if (item.IsPublished === true) {
        count++;
      }
    });
    return isPublished = count > 0 ? true : false;
  }

  // Deletes the magazine from client side which is yet to be saved in database
  deleteUnsavedMagazine(demoOffer: string, magazineName: string, idx: number) {
    const magAssociations = this.demoOfferChannel.filter(d => d.demoOffer === demoOffer)[0].magazineList;
    const index = magAssociations.findIndex(m => m.MagazineName === magazineName);
    magAssociations.splice(index, 1);
    this.filterMagazines(idx); // Adding the deleted magazine to dropdown list
  }

  // Deletes the channels from client side which is yet to be saved in database
  deleteUnsavedChannel(item: any, magDetails) {
    const index = this.getIndex(magDetails.DemoOfferCode, magDetails.MagazineName, magDetails.ChannelId);
    this.mag.channelList.splice(index, 1);
    const associatedChannels = item.channelList.map(m => m.ChannelName);
    this.channelList = this.channelMetadata.filter(m => associatedChannels.indexOf(m.ChannelName) === -1);
  }

  // To hide and show magzine drop down
  setMagazine(demooffer: string) {
    this.showThisMag = true;
    this.magForDemoOffer = demooffer;
  }

  // Add or Removes the magazine from dropdown list after selecting or deleting
  filterMagazines(index) {
    const mags = [];
    const SelectedMagazines = this.demoOfferChannel[index].magazineList;
    SelectedMagazines.forEach(item => {
      const magazines = item.MagazineName;
      mags.push(magazines);
    });
    const uniqueMags = mags.filter((v, i, a) => a.indexOf(v) === i);
    const availableItems = this.magazineList.filter(m => uniqueMags.indexOf(m.Description) === -1);
    this.demoOfferChannel[index].availableMagazines = availableItems;
  }

  // To disallow editing when demoOffer is in status - Pending, Archived, Approved
  getEditability(offerCode): boolean {
    const notAllowedStatus = [ApplicationStatus.Pending, ApplicationStatus.Approved, ApplicationStatus.Archived];
    const demoOffers = this.demoCode.DemoOffers;
    const canEdit = demoOffers.some(of => {
      if (of.DemoOfferCode === offerCode) {
        return notAllowedStatus.find(s => s.toUpperCase() === of.Status.toUpperCase()) === undefined;
      }
    });

    const canEditDemoCode = this.demoCodeStatus !== ApplicationStatus.Pending;

    return canEdit && canEditDemoCode;
  }
  // To allow editing based on user's magazine access
  getMagEditability(offer, magName) {
    let canEdit = this.getEditability(offer);
    const userMagazines = this.magazineList.map(r => r.Description);
    let isAuthMag = userMagazines.find(mg => mg.toUpperCase() === magName.toUpperCase()) !== undefined;
    return canEdit && isAuthMag;
  }

  // To change the status of demoOffer when it is edited
  updateSaveDemoOffers(demoOffer) {
    const index = this.demoOffersList.findIndex(m => m.DemoOfferCode === demoOffer);
    switch (this.demoOffersList[index].Status.toUpperCase()) {
      case ApplicationStatus.Draft.toUpperCase():
        this.demoOffersList[index].StatusId = this.getStatusID(ApplicationStatus.Draft);
        this.demoOffersList[index].Status = ApplicationStatus.Draft;
        break;
      case ApplicationStatus.Active.toUpperCase():
      case ApplicationStatus.Active_In_Edit.toUpperCase():
        this.demoOffersList[index].StatusId = this.getStatusID(ApplicationStatus.Active_In_Edit);
        this.demoOffersList[index].Status = ApplicationStatus.Active_In_Edit;
        break;
      default:
        break;
    }
    this.updatedDemoOffers.emit(this.demoOffersList);
  }

  // To get status id from status name
  getStatusID(status): number {
    let statusID;
    this.Status.forEach(st => {
      if (st.StatusType.toUpperCase() === status.toUpperCase()) {
        statusID = st.StatusId;
      }
    });
    return statusID;
  }

  // To remove the pinned demo Offer filter
  clearPinnedFilter() {
    this.clearFilter.emit();
  }

  // Validates whether magazine has been linked with chain offers before deleting
  validateMagazineChainOffer(chainOffer, magazineName, demoOffer): number {
    const magazineList = [];
    let count = 0;
    chainOffer.forEach(item => {
      if (item.MagazineName === magazineName && item.ParentDemoOfferCode === demoOffer) {
        count++;
      }
    });
    if (count > 0) {
      this.modalValidate.open();
      this.modalMessage = 'Magazine ' + magazineName + ' of demo Offer ' + demoOffer + ' cannot be deleted as it is linked to chainOffer ';
      setTimeout(() => {
        this.modalValidate.close();
      }, 3000);
    }
    return count;
  }

  // show selected demo offer history details
  showDetails(index: number): void {
    //if (this.selectedIndex === index && this.isEnabled) {
    //    this.isEnabled = false;
    //} else {;
    //    this.isEnabled = true;

    //    this.selectedIndex = index;
    //}
    const ind = this.selectedIndex.indexOf(index, 0);
    if (ind > -1) {
      this.selectedIndex.splice(ind, 1);
    } else {
      this.selectedIndex.push(index);
    }
  }

  SetPinnedFilter() {
    const filterDemoOffer = this.demoOfferChannel.filter(m => m.demoOffer.toUpperCase() === this.freeTextSearch.toUpperCase());
    if (this.freeTextSearch !== '' && filterDemoOffer.length === 1) {
      sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.freeTextSearch));
      this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    }
    if (this.freeTextSearch === '') {
      sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(this.freeTextSearch));
      this._sharedSVC.updateFilteredDemoOffer(this.freeTextSearch);
    }
  }

  // To unsubscribe Observables
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
