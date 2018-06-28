import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Rx';
import { Constants, DemoOfferDetails, DemoChoiceDetails, DemoOfferRequest, ApplicationStatus, RecallActionRequest } from '../../../_models/index';
import { AnswerService, CommonService, QuestionService } from '../../../_services/index';

@Component({
  selector: 'app-demo-offer-actions'
})
export class DemoOfferActionsComponent implements OnInit {

  userDetails: any;
  constants = Constants;
  canDelete: boolean;
  @ViewChild('modalDeleteSuccess')
  modalDeleteSuccess: BsModalComponent;
  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;
  @ViewChild('modalDeleteDemoOffer')
  modalDeleteDemoOffer: BsModalComponent;
  modalMessage: string;
  deleteMessage: string;
  demoOfferDetails: any;
  constructor(public _router: Router, public _route: ActivatedRoute, public _commonService: CommonService, public _answerService: AnswerService, public _questionService: QuestionService) { }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem(this.constants.USER_DETAILS));
  }

  // Recall and Delete DemoOffer
  recallDelete(demoOffer, Magazine, isCDBModel): any {
    const recallRequest = this.formRequestObject(demoOffer, Magazine, isCDBModel);
    return this._questionService.deleteRecalledOffer(recallRequest)
      .map(res => {
        return res;
      });
  }

  // Recall and Edit DemoOffer
  recallEdit(demoOffer, Magazine, isCDBModel): any {
    const recallRequest = this.formRequestObject(demoOffer, Magazine, isCDBModel);
    return this._questionService.editRecalledOffer(recallRequest)
      .map(res => {
        return res;
      });
  }


  // Recall and Discard DemoOffer
  recallDiscard(demoOffer, Magazine, isCDBModel) {
    const recallRequest = this.formRequestObject(demoOffer, Magazine, isCDBModel);
    return this._questionService.discard(recallRequest)
      .map(res => {
        return res;
      });
  }

  formRequestObject(offer, magChannel, isCDBModel): RecallActionRequest {
    let Mags;
    magChannel.forEach(demoOffer => {
      if (demoOffer.DemoOfferCode.toUpperCase() === offer.DemoOfferCode.toUpperCase()) {
        Mags = demoOffer.DemoOfferChannel.map(d => d.Mag_Code).filter((elem, index, item) => item.indexOf(elem) === index);
      }
    });
    const request = new RecallActionRequest(offer.DemoCode, offer.DemoOfferCode, this.userDetails.username, this.userDetails.EMailAddress, Mags, !isCDBModel);
    return request;
  }

  // Add Common Functionalities - Delete, Archive etc.,
  deleteDemoOfferDetail(demoOffer): any {
    this.modalDeleteDemoOffer.close();
    return this._answerService.deleteDemoOfferDetails(demoOffer, this.userDetails.username)
      .map(data => {
        return data;
      });
  }

  // Archives the demo Offer
  archiveOffer(demoOffer): any {
    return this._answerService.archive(demoOffer)
      .map(data => { return data });
  }
}
