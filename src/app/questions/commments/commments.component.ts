import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../_services/index';
import { Constants, DemoCodeComment } from '../../_models/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'app-commments',
    templateUrl: './commments.component.html',
    styleUrls: ['./commments.component.css']
})
export class CommmentsComponent implements OnInit {

    userDetails: any;
    constants = Constants;
    demoCodeComment: DemoCodeComment;
    @Input() comments: any;
    @Input() demoCode: string;
    @Input() showHeader: boolean;
    @Output() updateComments;
    commentText: string;
    todayDate = Date.now();
    modalMessage: string;
    @ViewChild('modalSaveSuccess')
    modalSaveSuccess: BsModalComponent;
    @ViewChild('modelIsDirty')
    modalIsDirty: BsModalComponent;

    constructor(private _router: Router, private _route: ActivatedRoute, private _questionService: QuestionService) {
        this.modalMessage = '';
        this.comments = [];
        this.updateComments = new EventEmitter<any>();
    }

    ngOnInit() {
        sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
        this.intialize();
    }

    intialize() {
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    }

    addComment() {
        if (!(this.commentText === undefined || this.commentText === '')) {
            this.demoCodeComment = new DemoCodeComment(0, this.demoCode, this.commentText, this.userDetails.DisplayName, this.userDetails.username, new Date());
            this._questionService.SaveDemoCodeComment(this.demoCodeComment)
                .subscribe(response => {
                    this.comments = response;
                    this.commentText = '';
                    sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
                    this.updateComments.emit(this.comments);
                });
        }
    }

    deleteComment(commentId): void {

        const subscriptionOnClose: Subscription = this.modalIsDirty.onClose
            .subscribe(() => {
                subscriptionOnClose.unsubscribe();
                this._questionService.DeleteDemoCodeComment(commentId)
                    .subscribe(response => {
                        this.comments = response;
                        this.updateComments.emit(this.comments);
                        this.modalMessage = this.constants.CMNT_RESULT_SAVE;
                        this.modalSaveSuccess.open();
                        setTimeout(() => {
                            this.modalSaveSuccess.close();
                        }, 3000);
                    });
        });
        this.modalIsDirty.open();
    }

    allowNavigation(event) {
        if (event.target.value !== '' || event.target.value !== undefined || event.target.value !== null) {
            sessionStorage.setItem(this.constants.LS_ISALLOW, 'N');
        } else {
            sessionStorage.setItem(this.constants.LS_ISALLOW, 'Y');
        }
    }
}
