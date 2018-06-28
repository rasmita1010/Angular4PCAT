import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, SharedService, QuestionService, CommonService,AnswerService } from '../../../../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { DataTableModule } from 'angular2-datatable';
import { PopoverModule } from 'ng2-popover';
import { MyDatePickerModule } from 'mydatepicker';
import { Observable } from 'rxjs/Rx';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService, MockAnswerService, MockActivatedRoute } from '../../../../_mocks/index.mock';
import { FormatDateMonthPipe, FormatDateTimePipe, DemoOfferSearchPipe, SourceRecordName, FormatDatePipe } from '../../../../_pipes/custom.pipes';
import { ChoiceAnswerComponent } from './choice-answer.component';


describe('Choice Answers Component', () => {
    let component: ChoiceAnswerComponent;
    let fixture: ComponentFixture<ChoiceAnswerComponent>;
    const window: any = {};
    let store = {};
    let route: MockActivatedRoute;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule, PopoverModule, MyDatePickerModule],
            declarations: [ChoiceAnswerComponent, MockModal, FormatDateMonthPipe, FormatDateTimePipe, DemoOfferSearchPipe, SourceRecordName, FormatDatePipe],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: ActivatedRoute, useValue: { params: Observable.of({ type: 'create' }) } },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: AnswerService, useClass: MockAnswerService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: CommonService, useClass: MockCommonService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(ChoiceAnswerComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
                    { provide: QuestionService, useClass: MockQuestionService },
                    { provide: SharedService, useClass: MockSharedService },
                    { provide: AnswerService, useClass: MockAnswerService },
                    { provide: CommonService, useClass: MockCommonService },
                    { provide: BsModalComponent, useClass: MockModal },
                    { provide: ActivatedRoute, useValue: route }
                ]
            }
        });
        const mock = (function () {
            let store = {};
            return {
                getItem: function (key) {
                    return JSON.stringify(new MockLocalStorage().getItem(key));
                },
                setItem: function (key, value) {
                    store[key] = value.toString();
                },
                clear: function () {
                    store = {};
                }
            };
        })();
        Object.defineProperty(window, 'sessionStorage', { value: mock, configurable: true, enumerable: true, writable: true });
        spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
            return JSON.stringify(new MockLocalStorage().getItem(key));
        });
        spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
            delete store[key];
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return store[key] = <string>value;
        });
        spyOn(localStorage, 'clear').and.callFake(() => {
            store = {};
        });

        const fixture = TestBed.createComponent(ChoiceAnswerComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChoiceAnswerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, QuestionService, CommonService, AnswerService, SharedService, ActivatedRoute], (router: Router, questionSvc: QuestionService, answerSvc: AnswerService, sharedSvc: SharedService, cmmnSvc: CommonService, _route: ActivatedRoute) => {
        expect(component).toBeDefined();
    }));
});



