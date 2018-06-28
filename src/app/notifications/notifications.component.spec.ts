import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, SharedService, CommonService, AnswerService, QuestionService } from '../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { DataTableModule } from 'angular2-datatable';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService, MockAnswerService, MockMarketingLocalStorage } from '../_mocks/index.mock';
import { HighlightPipe, FormatDateMonthPipe, FormatDateTimePipe } from '../_pipes/custom.pipes';

import { QuestionSearchComponent } from '../question-search/question-search.component';
import { NotificationsComponent } from './notifications.component';
import { CommmentsComponent } from '../questions/commments/commments.component';

describe('Notifications Component - For Admin/TCS Role', () => {
    let component: NotificationsComponent;
    let fixture: ComponentFixture<NotificationsComponent>;
    const window: any = {};
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule],
            declarations: [NotificationsComponent, MockModal, QuestionSearchComponent, HighlightPipe, FormatDateMonthPipe, FormatDateTimePipe, CommmentsComponent],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: CommonService, useClass: MockCommonService },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: AnswerService, useClass: MockAnswerService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(NotificationsComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
                    { provide: CommonService, useClass: MockCommonService },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
                    { provide: QuestionService, useClass: MockQuestionService },
                    { provide: SharedService, useClass: MockSharedService },
                    { provide: BsModalComponent, useClass: MockModal }
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

        const fixture = TestBed.createComponent(NotificationsComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, SharedService, AnswerService], (router: Router, sharedSvc: SharedService, answerSvc: AnswerService) => {
        expect(component).toBeDefined();
    }));

    it('Should display the total count of notifications (Pending + Returned) ', inject([Router, SharedService, AnswerService, CommonService], (router: Router, sharedSvc: SharedService, answerSvc: AnswerService, commonSvc: CommonService) => {
        commonSvc.GetNotifications(null).subscribe(data => {
            const pendingNotifications = data.PendingNotifications;
            const returnedNotifications = data.ReturnedNotifications;
            const total = component.pendingNotifications.length + component.returnedNotifications.length;
            expect(total).toBe(pendingNotifications.length + returnedNotifications.length);
        });
    }));

    it('Should display the Approve and Return actions for users who belong to Admin/TCS Roles ', inject([Router, SharedService, AnswerService, CommonService], (router: Router, sharedSvc: SharedService, answerSvc: AnswerService, commonSvc: CommonService) => {
        const items = fixture.nativeElement.getElementsByClassName('btnc');
        const btns = [];
        for (let i = 0; i < items.length; i++) {
            btns.push(items[i].textContent.trim().toUpperCase());
        }
        expect(btns.indexOf('APPROVE')).toBeGreaterThan(-1);
        expect(btns.indexOf('RETURN')).toBeGreaterThan(-1);
    }));
});

describe('Notifications Component - For Marketing Role', () => {
    let component: NotificationsComponent;
    let fixture: ComponentFixture<NotificationsComponent>;
    const window: any = {};
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule],
            declarations: [NotificationsComponent, MockModal, QuestionSearchComponent, HighlightPipe, FormatDateMonthPipe, FormatDateTimePipe, CommmentsComponent],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockMarketingLocalStorage },
                { provide: CommonService, useClass: MockCommonService },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: AnswerService, useClass: MockAnswerService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(NotificationsComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockMarketingLocalStorage },
                    { provide: CommonService, useClass: MockCommonService },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
                    { provide: QuestionService, useClass: MockQuestionService },
                    { provide: SharedService, useClass: MockSharedService },
                    { provide: BsModalComponent, useClass: MockModal }
                ]
            }
        });
        const mock = (function () {
            let store = {};
            return {
                getItem: function (key) {
                    return JSON.stringify(new MockMarketingLocalStorage().getItem(key));
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
            return JSON.stringify(new MockMarketingLocalStorage().getItem(key));
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

        const fixture = TestBed.createComponent(NotificationsComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationsComponent);
        component = fixture.componentInstance;
        let val = fixture.nativeElement.querySelector('.panel-title');
        val = val.className = '.panel-title clickable';
        fixture.detectChanges();
    });

    
    it('Should not display the Approve and Return actions for users who belong to Marketing Roles ', inject([Router, SharedService, AnswerService, CommonService], (router: Router, sharedSvc: SharedService, answerSvc: AnswerService, commonSvc: CommonService) => {
        const items = fixture.nativeElement.getElementsByClassName('btnc');
        let count = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i].children.length > 0) {
                count++;
            }
        }
        expect(count).toBe(0);
    }));
});

