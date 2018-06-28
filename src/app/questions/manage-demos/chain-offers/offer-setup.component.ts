import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Constants, ForcedChainOffers, DemoOfferChannel, ChoiceChainOffers, ChoiceToOfferAssociations } from '../../../_models/index';
import { QuestionService } from '../../../_services/index';

@Component({
    selector: 'app-chainofferssetup',
    templateUrl: './offer-setup.html'
})
export class ChainOfferSetupComponent implements OnChanges, OnInit {

    @Input() ParentChoices;
    @Input() editForced;
    @Input() editChoiceOffer;
    @Input() editChoiceToOfferAssociation;
    @Input() choiceContradicts;
    @Input() possibleForcedChainOffers;
    @Input() possibleChoiceChainOffers;
    @Input() possibleChoiceToOfferChains;
    @Output() closeOfferSetup = new EventEmitter<string>();
    @Output() selectedForcedChain = new EventEmitter<ForcedChainOffers>();
    @Output() selectedChoiceChain = new EventEmitter<any>();
    @Output() selectedChoiceToOfferChain= new EventEmitter<any>();
    @ViewChild('modalValidate')
    modalValidate: BsModalComponent;
    @ViewChild('progressBar')
    progressBar: BsModalComponent;
    @ViewChild('modalSwitchChain')
    modalSwitchChain: BsModalComponent;

    constants = Constants;
    selectedIndex = -1;
    selectedDemoCode: string;
    selectedDemoOfferCode: string;
    BusinessMessage: string;
    forcedErrorCode: string;
    linkedForced: ForcedChainOffers;
    linkedChoice: ChoiceChainOffers[] = [];
    linkedChoiceObj: ChoiceChainOffers[] = [];
    linkedChoiceToOffers: ChoiceToOfferAssociations[] = [];
    linkedChoiceToOffersObj: ChoiceToOfferAssociations[] = [];
    removeChoices = [];
    tempObj: ChoiceChainOffers[] = [];
    linkedtoParentChoice: number;
    searchForcedQue = '';
    searchChoiceQue = '';
    // Bool Declarations
    isLinked = false;
    isForced = true; // Show forced choice selection by default
    isChoice = false;
    isChoiceToOffer = false;
    canDrop = false; // To Restrict assigning child choices to same parent choice
    hasAlert = false;
    forcedSelected = false;
    choiceSelected = false;
    choiceToOfferSelected = false;

    constructor(private _questionService: QuestionService) { }

    ngOnChanges(changes: SimpleChanges) {
        this.linkedChoiceToOffersObj = this.linkedChoiceToOffers;
        for (let inputProps in changes) {
            if (inputProps === 'possibleChoiceChainOffers') {
                let chng = changes[inputProps];
                this.possibleChoiceChainOffers = chng.currentValue;
                this.loadEdit();
            }
            if (inputProps === 'possibleChoiceToOfferChains') {
                let chng = changes[inputProps];
                this.possibleChoiceToOfferChains = chng.currentValue;
                this.loadEdit();
            }
            if(inputProps == 'ParentChoices'){
                changes.ParentChoices.currentValue.forEach(element => {
                    this.linkedChoiceToOffers.push(new ChoiceToOfferAssociations(element.DemoChoiceCode,
                        element.DemoChoiceText, element.DemoChoiceId,'',false));
                });
            }
        }
    }
    loadEdit() {
        if (this.editChoiceOffer !== undefined) {
            this.isForced = false;
            this.isChoiceToOffer = false;
            this.isChoice = true;
            let idx = this.possibleChoiceChainOffers.findIndex(of => of.DemoCode === this.editChoiceOffer.ChildDemoCode);
            if (idx > -1) {
                this.isLinked = true;
                this.selectedIndex = idx;
                this.selectedDemoCode = this.editChoiceOffer.ChildDemoCode;
                this.linkedChoice = JSON.parse(JSON.stringify(this.editChoiceOffer.ChoiceChainOffers));
                this.linkedChoice = this.linkedChoice.filter(ch => ch.ChildDemoChoiceId !== 0);
                this.linkedChoiceObj = JSON.parse(JSON.stringify(this.editChoiceOffer.ChoiceChainOffers));
            }
        }
        if (this.choiceContradicts !== undefined) {
            this.linkedChoice.forEach((of, idx) => {
                let conflict = this.choiceContradicts.filter(cc => cc.m_Item1.DemoChoiceText.toUpperCase() === of.ChildDemoCHoiceText.toUpperCase());
                if (conflict !== undefined && conflict !== null) {
                    this.linkedChoice[idx].hasPendingSubmission = conflict[0].m_Item2; // array[0] since filtered choices are all the same
                    this.linkedChoiceObj[idx].hasPendingSubmission = conflict[0].m_Item2;
                }
            });
            let idx = this.linkedChoiceObj.findIndex(of => of.hasPendingSubmission === true);
            if (idx > -1) {
                this.hasAlert = true;
            }
        }

        if (this.editForced !== undefined) {
            this.isChoiceToOffer = false;
            this.isChoice = false;
            this.isForced = true;
            this.selectedDemoOfferCode = this.editForced.ChildDemoOfferCode;
        }

        if(this.editChoiceToOfferAssociation !== undefined){
            this.ParentChoices;
            this.isForced = false;
            this.isChoice = false;
            this.isChoiceToOffer = true;
            this.isLinked = true;
            this.linkedChoiceToOffers = JSON.parse(JSON.stringify(this.editChoiceToOfferAssociation.ChoiceToOfferAssociations));
            this.linkedChoiceToOffersObj = JSON.parse(JSON.stringify(this.editChoiceToOfferAssociation.ChoiceToOfferAssociations));
        }
    }

    ngOnInit() { }

    // Links Forced chain offer
    LinkForcedChainOffer() {
        this.linkedForced = this.possibleForcedChainOffers.find(offer => offer.DemoOfferCode === this.selectedDemoOfferCode);
        this.selectedForcedChain.emit(this.linkedForced);
    }

    // Links Choice chain offer
    LinkChoiceChainOffer() {
        if (this.selectedDemoCode !== null && this.selectedDemoCode !== undefined) {
            this.isLinked = true;
            this.linkedChoice = [];
            this.linkedChoiceObj = [];
            this.removeChoices = [];
        }
    }

    LinkChoiceToOfferChain(){
        if (this.selectedDemoCode !== null && this.selectedDemoCode !== undefined) {
            this.isLinked = true;
            this.linkedChoiceToOffers = [];
            this.linkedChoiceToOffersObj = [];
            this.removeChoices = [];
        }
    }

    // Save Linked Choice Chain Offer
    SaveChoiceChain(): void {
        const choiceOffer = this.possibleChoiceChainOffers.find(offer => offer.DemoCode === this.selectedDemoCode);
        if ((this.linkedChoiceObj.length === 0) || (this.linkedChoice.length === 0)) {
            this.BusinessMessage = this.constants.MSG_DEMOOFFER_NOT_AVAILABLE;
            this.modalValidate.open();
            setTimeout(() => {
                this.modalValidate.close();
            }, 2000);
        } else {
            this.selectedChoiceChain.emit({ 'ChoiceChainOffer': this.linkedChoiceObj, 'ChoiceObj': choiceOffer });
        }
    }

    SaveChoiceToOfferChain():void{
        let linkCount = this.linkedChoiceToOffersObj.filter(chain => chain.ChildDemoOfferCode != '').length;
        if(linkCount == 0){
            this.BusinessMessage = this.constants.MSG_DEMOOFFER_NOT_AVAILABLE_FOR_CHOICETOOFFER;
            this.modalValidate.open();
            setTimeout(() => {
                this.modalValidate.close();
            }, 2000);
        } else{
        this.selectedChoiceToOfferChain.emit({ 'ChoiceToOfferChain': this.linkedChoiceToOffersObj});
        }
    }


    // Event triggered while dropping a dragged choice
    dropped(event) {
        this.linkedtoParentChoice = event.mouseEvent.srcElement.id;
        if (this.linkedChoice.length > 0) {
            this.canDrop = this.linkedChoice.some(choiceChains => {
                return choiceChains.ParentDemoOfferChoiceId === Number(this.linkedtoParentChoice);
            });
        }
        if (!this.canDrop) {
            const childChoice = event.dragData;
            if (this.linkedChoiceObj.length === 0) {
                this.ParentChoices.forEach(parent => {
                    if (Number(this.linkedtoParentChoice) === parent.DemoOfferChoiceId) {
                        const choiceChain = new ChoiceChainOffers(parent.DemoChoiceCode, parent.DemoChoiceText, parent.DemoOfferChoiceId, childChoice.DemoChoiceCode, childChoice.DemoChoiceText, childChoice.DemoChoiceId, false);
                        this.linkedChoice.push(choiceChain); // To Show in UI
                        this.linkedChoiceObj.push(choiceChain);// To Send to ChainOffer component
                    }
                    else {
                        const choiceChain = new ChoiceChainOffers(parent.DemoChoiceCode, parent.DemoChoiceText, parent.DemoOfferChoiceId, '', '', 0, false);
                        this.linkedChoiceObj.push(choiceChain); // To display unchained parent choice
                    }
                });
            }
            else {
                this.ParentChoices.forEach(parent => {
                    if (Number(this.linkedtoParentChoice) === parent.DemoOfferChoiceId) {
                        const choiceChain = new ChoiceChainOffers(parent.DemoChoiceCode, parent.DemoChoiceText, parent.DemoOfferChoiceId, childChoice.DemoChoiceCode, childChoice.DemoChoiceText, childChoice.DemoChoiceId, false);
                        this.linkedChoice.push(choiceChain); // To Show in UI
                    }
                });
                // Updating that object alone
                const idx = this.linkedChoiceObj.findIndex(ch => ch.ParentDemoOfferChoiceId === Number(this.linkedtoParentChoice));
                this.linkedChoiceObj[idx].ChildDemoChoiceCode = childChoice.DemoChoiceCode;
                this.linkedChoiceObj[idx].ChildDemoChoiceId = childChoice.DemoChoiceId;
                this.linkedChoiceObj[idx].ChildDemoCHoiceText = childChoice.DemoChoiceText;
            }
        }
    }

    offerDropped(event){
        const childChoice = event.dragData;
        this.linkedtoParentChoice = event.mouseEvent.srcElement.id;
        this.linkedChoiceToOffers.forEach(parent => {           
            const idx = this.linkedChoiceToOffersObj.findIndex(ch => ch.ParentDemoChoiceId === Number(this.linkedtoParentChoice));
            this.linkedChoiceToOffersObj[idx].ChildDemoOfferCode = childChoice.DemoOfferCode;
            this.linkedChoiceToOffers = this.linkedChoiceToOffersObj; // To Show in UI
        });
    }

    // To Remove/UnChain chained Choice
    removeChainedChoice(parentChoiceID): void {
        const tempLinkedChoice = this.linkedChoice.map(ch => ch);
        this.linkedChoice = this.linkedChoice.filter(of => of.ParentDemoOfferChoiceId !== parentChoiceID);

        const tempLinkedObj = this.linkedChoiceObj.map(li => li);
        tempLinkedObj.forEach((chOffer, index) => {
            if (chOffer.ParentDemoOfferChoiceId === parentChoiceID) {
                this.linkedChoiceObj[index].ChildDemoChoiceCode = '';
                this.linkedChoiceObj[index].ChildDemoChoiceId = 0;
                this.linkedChoiceObj[index].ChildDemoCHoiceText = '';
            }
        });
    }

    removedChainedOffer(parentChoiceID): void{
        const idx = this.linkedChoiceToOffersObj.findIndex(ch => ch.ParentDemoChoiceId === Number(parentChoiceID));
        this.linkedChoiceToOffersObj[idx].ChildDemoOfferCode = '';
        this.linkedChoiceToOffers = this.linkedChoiceToOffersObj; // To Show in UI
    }

    // To close Linkage
    closeLinking() {
        this.isLinked = false;
        this.selectedIndex = -1;
        this.selectedDemoCode = null;
        this.selectedDemoOfferCode = null;
        if(this.isChoiceToOffer){
            this.closeOfferSetup.emit('true');
        }
    }
    switchChainTab(){
        this.isForced = this.forcedSelected;
        this.isChoice = this.choiceSelected;
        this.isChoiceToOffer = this.choiceToOfferSelected;
        if (this.isForced){
            this.isLinked = false;
        }
        this.modalSwitchChain.close();
    }

    // Tab Changed
    changeTabtoForced() {
        if(!this.isForced){
            this.forcedSelected = true;
            this.choiceSelected = false;
            this.choiceToOfferSelected = false;
            var choicetoOffersLinks = this.linkedChoiceToOffersObj.filter(link => link.ChildDemoOfferCode != '');
            if(choicetoOffersLinks.length > 0 || this.linkedChoiceObj.length > 0){
                this.modalSwitchChain.open();
            }
            else{
                this.isForced = true;
                this.isChoice = false;
                this.isChoiceToOffer = false;
                this.selectedIndex = -1; // Restoring index
                this.isLinked = false;
            }
        }
    }

    changeToChoiceChain(){
        if(!this.isChoice){
            this.choiceSelected = true;
            this.forcedSelected = false;
            this.choiceToOfferSelected = false;
            var choicetoOffersLinks = this.linkedChoiceToOffersObj.filter(link => link.ChildDemoOfferCode != '');
            if(choicetoOffersLinks.length > 0 || this.selectedDemoOfferCode){
                this.modalSwitchChain.open();
            }
            else{
            this.isForced = false;
            this.isChoice = true;
            this.isChoiceToOffer = false;
            }
        }
    }

    changeToChoiceToOfferChain(){ 
        this.isLinked = true;
        if(!this.isChoiceToOffer){    
            this.choiceToOfferSelected = true;
            this.choiceSelected = false;
            this.forcedSelected = false;
            if(this.selectedDemoOfferCode || this.linkedChoiceObj.length > 0){
                this.modalSwitchChain.open();
            }
            else{
            this.isForced = false;
            this.isChoice = false;
            this.isChoiceToOffer = true;
            }
        }
    }

    changeSelection(idx) {
        this.selectedIndex = idx;
        this.isLinked = false;
        if (this.editChoiceOffer !== undefined) {
            if (this.selectedDemoCode === this.editChoiceOffer.ChildDemoCode) {
                this.loadEdit();
            } else {
                this.linkedChoice = [];
                this.linkedChoiceObj = [];
                this.hasAlert = false;
            }
        }
        this.removeChoices = [];
    }

    canDrag(choice): boolean {
        let canDrag;
        let idx = this.linkedChoiceObj.findIndex(of => (of.ChildDemoChoiceId === choice.DemoChoiceId) && (of.hasPendingSubmission === true));
        if (idx > -1) {
            canDrag = false;
        } else {
            canDrag = true;
        }
        return canDrag;
    }
}
