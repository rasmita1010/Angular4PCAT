import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Constants,AnswerTypes, ForcedChainOffers, ForcedOfferRequest, DeleteChainOfferRequest, ChoiceOfferRequest, 
    ChoiceOffer, DemoOfferDetails, ApplicationStatus, ChoiceChainOffers, ChoiceToOfferChainRequest,
    ChoiceToOfferAssociations } from '../../../_models/index';
import { QuestionService, SharedService } from '../../../_services/index';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-chainoffers',
    templateUrl: './chain-offers.component.html'
})
export class ChainOfferComponent implements OnChanges, OnInit {


    @Input() questionTabDetails;
    @Input() filteredDemoOffer;
    @Output() updateChainOffers = new EventEmitter<any>();
    @Output() updatedDemoOffers = new EventEmitter<any>();
    @Output() clearFilter = new EventEmitter<any>();

    @ViewChild('modalValidate')
    modalValidate: BsModalComponent;
    @ViewChild('modalDeleteChain')
    modalDeleteChain: BsModalComponent;
    @ViewChild('modalDeleteChainSuccess')
    modalDeleteChainSuccess: BsModalComponent;
    @ViewChild('modalChainingSuccess')
    modalChainingSuccess: BsModalComponent;
    @ViewChild('progressBar')
    progressBar: BsModalComponent;

    forcedIndex = -1;
    choiceIndex = -1;
    choiceToOfferIndex = -1;
    routeParam: any;
    resources: any;
    userDetails: any;
    Status: any;
    paramValue: string;
    Mag_code: string;
    Mag_Name: string;
    demoOfferCount: string;
    freeTextSearch: string;
    BusinessMessage: string;
    selectedQuestionText: string;
    constants = Constants;
    selectedDemoOffer = this.constants.LBL_SELECT;
    selectedMagazine = this.constants.LBL_SELECT;
    demoCodeModel: any;
    ParentChoices: any;
    editChoiceOfferObj: any;
    editChoiceToOfferAssociationObj: any;
    demoOfferChannels: any;
    ChainOffers: any;
    allowedDOs = [];
    filteredmagazines = [];
    availableForcedOffers = [];
    availableChoiceChainOffers = [];
    availableChoiceToOfferChains = [];
    possibleForcedChainOffers = [];
    possibleChoiceChainOffers = [];
    possibleChoiceToOfferChains = [];
    demoOfferDetails: DemoOfferDetails[] = [];
    forcedOfferRequest: ForcedOfferRequest;
    choiceOfferRequest: ChoiceOfferRequest;
    choiceToOfferChainRequest: ChoiceToOfferChainRequest;
    deleteChainOfferRequest: DeleteChainOfferRequest;
    choiceCollision: any;
    demoOfferList: Map<string, string[]> = new Map<string, string[]>();

    // Bool Declarations
    isCDBModel = false;
    isSingleOptionType = true;
    allowAddition = true;
    showNewSection = false;
    enableShowOffers = false; // shows the Show Chain Offers button based on Offer and MagCode selection
    showChainOfferSelection = false; // Shows the forced and Choice section
    isForced = true; // Show forced choice selection by default
    isChoice = false;
    isChoiceToOffer = false;
    isAdd = true; // To indicate whether chain offer is add/edit
    editOfferChain = false;
    offerNotAvailable = false;


    // To Unsubscribe Observables
    private unsubscribe: Subject<void> = new Subject<void>();

    constructor(private _router: Router, private _route: ActivatedRoute, private _questionService: QuestionService, private _sharedSVC: SharedService) {
        this._sharedSVC.updateFilteredDemoOffer$.takeUntil(this.unsubscribe).subscribe(demoOffer => {
            this.filteredDemoOffer = demoOffer;
            this.freeTextSearch = this.filteredDemoOffer;
        });
    }

    // To get Updated Input Value
    ngOnChanges(changes: SimpleChanges) {
        for (const inputProps in changes) {
            if (inputProps === 'questionTabDetails') {
                const chng = changes[inputProps];
                this.questionTabDetails = chng.currentValue;
            }
        }
    }

    ngOnInit() {
        this.loadInitalState();
        this.Status = JSON.parse(localStorage.getItem(this.constants.LS_STATUS_METADATA));
        this.demoOfferCount = JSON.parse(sessionStorage.getItem(this.constants.LS_DEMO_OFFER_COUNT));
        this.freeTextSearch = this.filteredDemoOffer;
    }

    loadInitalState() {
        this.routeParam = this._route.params.subscribe(params => {
            this.paramValue = params['action'];
            switch (this.paramValue.toLowerCase()) {
                case this.constants.MSG_ROUTE_CREATE:
                    this.demoCodeModel = this.questionTabDetails;
                    if (this.demoCodeModel.DemoCode.length > 0) {
                        this.isSingleOptionType = this.demoCodeModel.DemoCode.AnswerType.toUpperCase() === AnswerTypes.SingleOption ? true : false;
                        this.isCDBModel = this.demoCodeModel.DemoCode.IsCDBModel === true ? true : false;
                    }
                    this.demoOfferChannels = this.demoCodeModel.Magazine;
                    this.demoOfferDetails = this.questionTabDetails.DemoOffers;
                    this.offerNotAvailable = this.demoOfferChannels.length === 0 ? true : false;
                    break;
                case this.constants.MSG_ROUTE_EDIT:
                    this.demoCodeModel = this.questionTabDetails;
                    this.demoOfferDetails = this.questionTabDetails.DemoOffers;
                    this.isSingleOptionType = this.demoCodeModel.DemoCode.AnswerType.toUpperCase() === AnswerTypes.SingleOption ? true : false;
                    this.isCDBModel = this.demoCodeModel.DemoCode.IsCDBModel === true ? true : false;
                    this.demoOfferChannels = this.demoCodeModel.Magazine;
                    this.offerNotAvailable = this.demoOfferChannels.length === 0 ? true : false;
                    this.ChainOffers = this.demoCodeModel.ChainOffers;
                    this.availableForcedOffers = this.ChainOffers.ForcedChainOffers;
                    this.availableChoiceChainOffers = this.ChainOffers.ChoiceChainOffers;
                    this.availableChoiceToOfferChains = this.ChainOffers.ChoiceToOfferChains;
                    this.updateParentChoices();
                    break;
                default: break;
            }
        });
        this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
        this.resources = this.userDetails.resources;
        this.populateDropDown();
    }

    isDemoCodePending(): boolean {
        return (this.demoCodeModel.DemoCode.Status === ApplicationStatus.Pending);
    }

    populateDropDown() {
        this.allowedDOs = [];
        const userMagazines = this.resources.map(r => r.ResourceName);
        const availableList = this.availableForcedOffers.concat(this.availableChoiceChainOffers).concat(this.availableChoiceToOfferChains);
        this.demoOfferChannels.forEach(demoOffer => {
            let authMags = [];
            let allowedMags = [];
            let filtered = [];
            let uniqueMags = demoOffer.DemoOfferChannel.map(d => d.Mag_Code).filter((elem, index, item) => item.indexOf(elem) === index);
            userMagazines.forEach(item => {
                authMags.push(uniqueMags.find(si => si.toLowerCase() === item.toLowerCase()));
                allowedMags = authMags.filter(function (element) {
                    return element !== undefined;
                });
            });
            const notAllowedStatus = [ApplicationStatus.Pending, ApplicationStatus.Approved, ApplicationStatus.Archived];
            const demoOffers = this.demoOfferDetails;
            const editAvailable = demoOffers.some(of => {
                if (of.DemoOfferCode === demoOffer.DemoOfferCode) {
                    return notAllowedStatus.find(s => s.toUpperCase() === of.Status.toUpperCase()) === undefined;
                }
            });
            if (editAvailable) {
                this.demoOfferList.set(demoOffer.DemoOfferCode, allowedMags);
            }

        });
        let templist = this.demoOfferList;
        templist.forEach((values, key, maps) => {
            availableList.forEach(av => {
                if (av.ParentDemoOfferCode === key) {
                    values = values.filter(mag => mag !== av.Mag_Code);
                }
            });
            this.demoOfferList.set(key, values);
        });
        this.demoOfferList.forEach((values, key, maps) => {
            if (values.length > 0) {
                this.allowedDOs.push(key);
            }
        });
        this.demoOfferDetails.forEach(of => {
            if (of.DigitalOffer !== null) {
                this.allowedDOs = this.allowedDOs.filter(off => off.toUpperCase() !== of.DemoOfferCode.toUpperCase());
            }
        });
    }

    getEditibility(chainDetail) {
        const notAllowedStatus = [ApplicationStatus.Pending, ApplicationStatus.Approved, ApplicationStatus.Archived];
        const demoOffers = this.demoOfferDetails;
        const availableDO = demoOffers.some(of => {
            if (of.DemoOfferCode === chainDetail.ParentDemoOfferCode) {
                return notAllowedStatus.find(s => s.toUpperCase() === of.Status.toUpperCase()) === undefined;
            }
        });
        const userMagazines = this.resources.map(r => r.ResourceName);
        const availableMag = userMagazines.some(mag => {
            return mag.toUpperCase() === chainDetail.Mag_Code.toUpperCase() ? true : false;
        });
        return availableDO && availableMag;
    }

    // Add new row to enable creation of new Chain Offer
    addNewRow() {
        if (this.allowedDOs.length === 0) {
            this.modalValidate.open();
            this.BusinessMessage = this.constants.MSG_CO_DOs_CHAINED;
            setTimeout(() => {
                this.modalValidate.close();
            }, 3500);
        } else {
            this.isAdd = true;
            this.allowAddition = false;
            this.showNewSection = true;
            this.closeSetup(false);
            this.clearFields();
        }
    }

    // On Offer Selection - Gets list of magazines associated to Offer and display only those that user has access to
    filterMagazines() {
        this.filteredmagazines = [];
        this.enableShowOffers = false;
        this.showChainOfferSelection = false;
        this.selectedMagazine = this.constants.LBL_SELECT;
        this.selectedQuestionText = this.demoCodeModel.DemoCode.QuestionText;
        this.demoOfferList.forEach((values, key, maps) => {
            if (key.toUpperCase() === this.selectedDemoOffer.toUpperCase()) {
                this.filteredmagazines = values;
            }
        });
    }

    // On Magazine Selection
    selectMagazine() {
        this.enableShowOffers = true;
        this.showChainOfferSelection = false;
    }

    // Shows the Chain offers section with Forced and choice, Forced set to default
    showChainOfferCandidates(demoOffer, MagCode) {
        this.progressBar.open();
        const isallow = 'N';
        sessionStorage.setItem(this.constants.LS_ISALLOW, isallow);
        this.enableShowOffers = false;
        this.selectedDemoOffer = demoOffer;
        this.selectedMagazine = MagCode;
        this._questionService.GetChainOfferCandidates(demoOffer, MagCode)
            .subscribe(result => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
                this.choiceCollision = result.Conflicts;
                this.possibleForcedChainOffers = result.ForcedOfferOptions;
                this.possibleChoiceChainOffers = result.ChoiceOfferOptions;
                this.possibleChoiceToOfferChains = result.ForcedOfferOptions;
            }, error => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
            });
        const offers = this.demoCodeModel.DemoOffers;
        offers.forEach(offer => {
            if (offer.DemoOfferCode === this.selectedDemoOffer) {
                this.ParentChoices = offer.DemoOffer_Choice;
            }
        });
    }

    updateParentChoices() {
        const choiceChainOffers = this.availableChoiceChainOffers || [];
        const offers = this.demoCodeModel.DemoOffers;
        choiceChainOffers.forEach(chOf => {
            let idx = offers.findIndex(of => of.DemoOfferCode === chOf.ParentDemoOfferCode);
            if (idx > - 1) {
                let choices = chOf.ChoiceChainOffers;
                let demoOfferChoice = offers[idx].DemoOffer_Choice;
                // If Choice is added / renamed
                demoOfferChoice.forEach(offCh => {
                    let chIdx = choices.findIndex(ch => ch.ParentDemoChoiceCode === offCh.DemoChoiceCode);
                    if (chIdx > -1) {
                        choices[chIdx].ParentDemoChoiceText = offCh.DemoChoiceText;
                    } else {
                        let newParentChoice = new ChoiceChainOffers(offCh.DemoChoiceCode, offCh.DemoChoiceText, offCh.DemoChoiceId, '', '', 0, false);
                        choices.push(newParentChoice);
                    }
                });
                // If Choice is deleted
                choices.forEach((chOff, index) => {
                    let chIdx = demoOfferChoice.findIndex(off => off.DemoChoiceCode === chOff.ParentDemoChoiceCode);
                    if (chIdx === -1) {
                        choices.splice(index, 1);
                    }
                });
            }
        });
    }

    // Link Chain offer
    LinkChainOffer(forcedOfferObj): void {
        this.progressBar.open();
        this.getMagName(this.selectedMagazine);
        this.forcedOfferRequest = new ForcedOfferRequest(this.selectedDemoOffer, forcedOfferObj.DemoOfferCode, this.selectedMagazine, this.Mag_Name, this.isAdd, this.userDetails.username);
        this._questionService.UpdateForcedChainOffer(this.forcedOfferRequest)
            .subscribe(response => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
                let forcedChain = new ForcedChainOffers(forcedOfferObj.DemoOfferCode, forcedOfferObj.QuestionText, this.selectedMagazine, this.Mag_Name, this.selectedDemoOffer, this.selectedQuestionText);
                this.afterChaining(forcedChain, this.constants.FORCED, response);
                this.updateParent(this.selectedDemoOffer);
            }, error => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
            });
    }

    // Link Choice Chain Offer
    LinkChoiceChainOffer(choiceOfferObj): void {
        this.getMagName(this.selectedMagazine);
        let choiceOffers = [];
        if (choiceOfferObj.ChoiceChainOffer.length !== 0) {
            choiceOfferObj.ChoiceChainOffer.forEach(of => {
                if (of.ChildDemoChoiceId !== 0) {
                    choiceOffers.push(of);
                }
            });
        } else {
            choiceOffers = [];
        }
        this.progressBar.open();
        let choice = choiceOfferObj.ChoiceObj;
        this.choiceOfferRequest = new ChoiceOfferRequest(this.selectedDemoOffer, this.selectedMagazine, this.Mag_Name, this.isAdd, this.userDetails.username, choiceOffers, choice.DemoCode);
        this._questionService.UpdateChoiceChainOffer(this.choiceOfferRequest)
            .subscribe(response => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
                let choiceChain = new ChoiceOffer(choice.DemoCode, choice.QuestionText, choiceOfferObj.ChoiceChainOffer, this.selectedMagazine, this.Mag_Name, this.selectedDemoOffer, this.selectedQuestionText);
                this.afterChaining(choiceChain, this.constants.CHOICE, response);
                this.updateParent(this.selectedDemoOffer);
            }, error => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
            });
    }

    LinkChoiceToOffer(choiceOfferObj): void{
        this.getMagName(this.selectedMagazine);
        this.progressBar.open();
        // this.choiceToOfferChainRequest = new ChoiceToOfferChainRequest(this.editChoiceToOfferAssociationObj.ParentDemoOfferCode, 
        // this.editChoiceToOfferAssociationObj.Mag_Code,this.editChoiceToOfferAssociationObj.MagazineName,  this.isAdd, 
        // this.userDetails.username, choiceOfferObj.ChoiceToOfferChain, "Test");

        let linkedChildOffers = '';
        choiceOfferObj.ChoiceToOfferChain.forEach(element => {
            linkedChildOffers += linkedChildOffers.length > 0 && element.ChildDemoOfferCode.length > 0 ? 
            ', ' + element.ChildDemoOfferCode: element.ChildDemoOfferCode;
        });
        let linkings = choiceOfferObj.ChoiceToOfferChain.filter(chain => chain.ChildDemoOfferCode != '');
        this.choiceToOfferChainRequest = new ChoiceToOfferChainRequest(
            this.selectedDemoOffer, this.selectedMagazine, this.Mag_Name,  this.isAdd, 
            this.userDetails.username, linkings, linkedChildOffers);
        this._questionService.UpdateChoiceToOfferChain(this.choiceToOfferChainRequest)
            .subscribe(response => {
                setTimeout(() => {
                    this.progressBar.close();
                }, 1000);
                let choiceChain = new ChoiceToOfferChainRequest(
                    this.selectedDemoOffer, this.selectedMagazine, this.Mag_Name,  this.isAdd, 
                    this.userDetails.username, choiceOfferObj.ChoiceToOfferChain, linkedChildOffers);
                this.afterChaining(choiceChain, this.constants.CHOICETOOFFER, response);
                this.updateParent(this.selectedDemoOffer);
            }, error => {
                setTimeout(() => {
                    this.progressBar.close();
                }, 1000);
            })
        
    }

    // Common
    afterChaining(data, chainType, result): void {
        this.BusinessMessage = result.BusinessMessage;
        sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
        if (data !== null && data !== undefined) {
            this.modalChainingSuccess.open();
            // Get existing chain offers (values from DB)
            const forcedChain = this.ChainOffers.ForcedChainOffers;
            const choiceChain = this.ChainOffers.ChoiceChainOffers;
            const choiceToOfferChain = this.ChainOffers.ChoiceToOfferChains;

            if (chainType.toUpperCase() === this.constants.FORCED.toUpperCase()) {
                // For a newly added chain
                if (this.isAdd) {
                    this.ChainOffers.ForcedChainOffers.push(data);
                } else { // For updated chaining, Remove existing chaining for the Demo Offer & Magazine combination & add new
                    const idxFO = forcedChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOfferCode) && (of.Mag_Code === this.selectedMagazine));
                    // If it's a new Forced chaining, add to array of ForcedChainOffers otherwise update ForcedChainOffers array
                    if (idxFO === -1) {
                        const idxCO = choiceChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOfferCode) && (of.Mag_Code === this.selectedMagazine));
                        const idxCOFC = choiceToOfferChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOfferCode) && (of.Mag_Code === this.selectedMagazine));
                        
                        if (idxCO > -1) {
                            this.ChainOffers.ChoiceChainOffers.splice(idxCO, 1);
                        }
                        if(idxCOFC > -1){
                            this.ChainOffers.ChoiceToOfferChains.splice(idxCOFC, 1);                            
                        }
                        this.ChainOffers.ForcedChainOffers.push(data);                        
                    } else {
                        this.ChainOffers.ForcedChainOffers[idxFO] = data;
                    }
                }
            } else if(chainType.toUpperCase() === this.constants.CHOICE.toUpperCase()) {
                if (this.isAdd) {
                    this.ChainOffers.ChoiceChainOffers.push(data);
                } else {
                    const idxCO = choiceChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOfferCode) && (of.Mag_Code === this.selectedMagazine));
                    if (idxCO === -1) {
                        const idxFO = forcedChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOfferCode) && (of.Mag_Code === this.selectedMagazine));
                        const idxCOFC = choiceToOfferChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOfferCode) && (of.Mag_Code === this.selectedMagazine));
                         
                        if (idxFO > -1) {
                            this.ChainOffers.ForcedChainOffers.splice(idxFO, 1);
                        }
                        if (idxCOFC > -1) {
                            this.ChainOffers.ChoiceToOfferChains.splice(idxCOFC, 1);
                        }
                        this.ChainOffers.ChoiceChainOffers.push(data);                        
                    } else {
                        this.ChainOffers.ChoiceChainOffers[idxCO] = data;
                    }
                }
            } else if(chainType.toUpperCase() === this.constants.CHOICETOOFFER.toUpperCase()) {
                let choiceOffer : any = {};
                choiceOffer.ParentDemoOfferCode = data.ParentDemoOffer;
                choiceOffer.QuestionText = this.selectedQuestionText;
                choiceOffer.Mag_Code = data.Mag_Code;
                choiceOffer.MagazineName = data.MagazineName;
                choiceOffer.ChoiceToOfferAssociations = data.ChoiceToOfferChains;
                if (this.isAdd) {
                    this.ChainOffers.ChoiceToOfferChains.push(choiceOffer);
                } else {                    
                    const idxCOFC = choiceToOfferChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOffer) && (of.Mag_Code === this.selectedMagazine));
                    if (idxCOFC === -1) {
                        const idxFO = forcedChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOffer) && (of.Mag_Code === this.selectedMagazine));
                        const idxCO = choiceChain.findIndex(of => (of.ParentDemoOfferCode === data.ParentDemoOffer) && (of.Mag_Code === this.selectedMagazine));                        
                        if (idxFO > -1) {
                            this.ChainOffers.ForcedChainOffers.splice(idxFO, 1);
                            this.ChainOffers.ChoiceToOfferChains.push(choiceOffer); 
                        }
                        if(idxCO > -1){
                            this.ChainOffers.ChoiceChainOffers.splice(idxFO, 1);     
                            this.ChainOffers.ChoiceToOfferChains.push(choiceOffer);                        
                        }
                                               
                    } else {
                        this.ChainOffers.ChoiceToOfferChains[idxCOFC] = choiceOffer;
                    }
                }
            }
        }
        this.updateChainOffers.emit(this.ChainOffers);
        setTimeout(() => {
            this.modalChainingSuccess.close();
        }, 2000);
        this.allowAddition = true;
        this.showNewSection = false;
        this.showChainOfferSelection = false;
        this.closeSetup(false);
        this.loadInitalState();
    }

    // Edits Chain Offer
    editChainOffer(chainOffer): void {
        this.editChoiceOfferObj = chainOffer;
        this.editChoiceToOfferAssociationObj = chainOffer
        this.selectedQuestionText = this.demoCodeModel.DemoCode.QuestionText;
        this.showChainOfferCandidates(chainOffer.ParentDemoOfferCode, chainOffer.Mag_Code);
        this.editOfferChain = true;
        this.isAdd = false;
        // Hides Add-offer view and Shows add button if user tries to edit a particular offer
        this.allowAddition = true;
        this.showNewSection = false;
        this.showChainOfferSelection = false;
    }

    // Opens Modal to Delete associated Chain Offer
    deleteChainOffer(chainOffer, offerType): void {
        this.getMagCode(chainOffer.MagazineName);
        this.deleteChainOfferRequest = new DeleteChainOfferRequest(chainOffer.ParentDemoOfferCode, this.Mag_code, offerType, this.userDetails.username);
        this.modalDeleteChain.open();
    }

    // Deletes Chain Offer
    deleteChain() {
        this.modalDeleteChain.close();
        this.progressBar.open();
        this._questionService.deleteChainOffer(this.deleteChainOfferRequest)
            .subscribe(deleted => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
                if (deleted.Status) {
                    this.removeFromList(this.deleteChainOfferRequest);
                    this.BusinessMessage = deleted.BusinessMessage;
                    this.modalDeleteChainSuccess.open();
                    setTimeout(() => {
                        this.modalDeleteChainSuccess.close();
                    }, 2000);
                }
            }, error => {
                setTimeout(() => { this.progressBar.close(); }, 1000);
            });
        this.allowAddition = true;
        this.showNewSection = false;
        this.showChainOfferSelection = false;
    }

    // Remove from Available chained offer List
    removeFromList(deletedOffer): void {
        this.forcedIndex = -1;
        this.choiceIndex = -1;
        this.choiceToOfferIndex = -1;
        if (deletedOffer.OfferType.toUpperCase() === this.constants.FORCED.toUpperCase()) {
            const forced = this.availableForcedOffers.map(r => r);
            forced.forEach((offer, index) => {
                if ((offer.ParentDemoOfferCode.toUpperCase() === deletedOffer.DemoOfferCode.toUpperCase()) && (offer.Mag_Code.toUpperCase() === deletedOffer.Mag_Code.toUpperCase())) {
                    this.availableForcedOffers.splice(index, 1);
                }
            });
            this.ChainOffers.ForcedChainOffers = this.availableForcedOffers;
        } else if (deletedOffer.OfferType.toUpperCase() === this.constants.CHOICE.toUpperCase()){
            const choice = this.availableChoiceChainOffers.map(r => r);
            choice.forEach((offer, index) => {
                if ((offer.ParentDemoOfferCode.toUpperCase() === deletedOffer.DemoOfferCode.toUpperCase()) && (offer.Mag_Code.toUpperCase() === deletedOffer.Mag_Code.toUpperCase())) {
                    this.availableChoiceChainOffers.splice(index, 1);
                }
            });
            this.ChainOffers.ChoiceChainOffers = this.availableChoiceChainOffers;
        } else if (deletedOffer.OfferType.toUpperCase() === this.constants.CHOICETOOFFER.toUpperCase()){
            const choice = this.availableChoiceToOfferChains.map(r => r);
            choice.forEach((offer, index) => {
                if ((offer.ParentDemoOfferCode.toUpperCase() === deletedOffer.DemoOfferCode.toUpperCase()) && (offer.Mag_Code.toUpperCase() === deletedOffer.Mag_Code.toUpperCase())) {
                    this.availableChoiceToOfferChains.splice(index, 1);
                }
            });
            this.ChainOffers.ChoiceToOfferChains = this.availableChoiceToOfferChains;
        }
        this.updateParent(deletedOffer.DemoOfferCode);
        this.updateChainOffers.emit(this.ChainOffers);
        this.loadInitalState();
    }

    // Closes offer Setup
    closeSetup(isClose) {
        this.forcedIndex = -1;
        this.choiceIndex = -1;
        this.choiceToOfferIndex = -1;
        sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
        if (isClose && this.showNewSection) {
            this.clearFields();
            this.allowAddition = true;
            this.showNewSection = false;
            this.showChainOfferSelection = false;
        } else {
            this.editOfferChain = false;
            this.showChainOfferSelection = false;
        }
    }

    // gets MagName for Magcode
    getMagName(magCode): void {
        this.resources.forEach(mag => {
            if (mag.ResourceName.toUpperCase() === this.selectedMagazine.toUpperCase()) {
                this.Mag_Name = mag.Description;
            }
        });
    }

    // gets Magcode for MagName
    getMagCode(magName): void {
        this.resources.forEach(mag => {
            if (mag.Description.toUpperCase() === magName.toUpperCase()) {
                this.Mag_code = mag.ResourceName;
            }
        });
    }

    // Clears 'Selected' Fields after close or when Add new offer is clicked
    clearFields() {
        this.selectedQuestionText = '';
        this.filteredmagazines = [];
        this.selectedDemoOffer = this.constants.LBL_SELECT;
        this.selectedMagazine = this.constants.LBL_SELECT;
        this.enableShowOffers = false;
        this.showChainOfferSelection = false;
    }

    // Updates Answer Tab - (Active - ActiveInEdit / Returned - Draft)
    updateParent(selectedDemoOffer) {
        const index = this.demoOfferDetails.findIndex(off => off.DemoOfferCode === selectedDemoOffer);
        switch (this.demoOfferDetails[index].Status.toUpperCase()) {
            case ApplicationStatus.Draft.toUpperCase():
                {
                    this.demoOfferDetails[index].StatusId = this.getStatusID(ApplicationStatus.Draft);
                    this.demoOfferDetails[index].Status = ApplicationStatus.Draft;
                    break;
                }
            case ApplicationStatus.Active.toUpperCase():
            case ApplicationStatus.Active_In_Edit.toUpperCase():
                {
                    this.demoOfferDetails[index].StatusId = this.getStatusID(ApplicationStatus.Active_In_Edit);
                    this.demoOfferDetails[index].Status = ApplicationStatus.Active_In_Edit;
                    break;
                }
            default:
                {
                    break;
                }
        }
        this.updatedDemoOffers.emit(this.demoOfferDetails);
    }

    // gets status ID for Status type
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

    // To unsubscribe Observables
    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
