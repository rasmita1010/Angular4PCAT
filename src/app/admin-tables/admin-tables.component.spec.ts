import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Http, Headers, HttpModule } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { DigitalDemoSearchPipe } from '../_pipes/custom.pipes';
import { RouteGuardService, SharedService, CommonService, QuestionService } from '../_services/index';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockSharedService, MockCommonService, MockQuestionService, MockModal, MockMarketingLocalStorage } from '../_mocks/index.mock';

import { AdminTablesComponent } from './admin-tables.component';


describe('Admin Tables Component - Users (Marketing)', () => {
    let component: AdminTablesComponent;
    let fixture: ComponentFixture<AdminTablesComponent>;
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule],
            declarations: [AdminTablesComponent, DigitalDemoSearchPipe, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: CommonService, useClass: MockCommonService },
                { provide: LocalStorageService, useClass: MockMarketingLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(AdminTablesComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: CommonService, useClass: MockCommonService },
                    { provide: QuestionService, useClass: MockQuestionService },
                    { provide: LocalStorageService, useClass: MockMarketingLocalStorage },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
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

        const fixture = TestBed.createComponent(AdminTablesComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminTablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should not allow user to Edit Demo Code if User is a Marketer', inject([Router, SharedService, CommonService, QuestionService], (router: Router, sharedSvc: SharedService, commSvc: CommonService, questionSvc: QuestionService) => {
        const el = fixture.nativeElement.getElementsByClassName('fa fa-pencil');
        expect(el.length).toBe(0);
    }));
    it('Should not allow user to add new Demo Code if User is a Marketer', inject([Router, SharedService, CommonService, QuestionService], (router: Router, sharedSvc: SharedService, commSvc: CommonService, questionSvc: QuestionService) => {
        const el = fixture.nativeElement.getElementsByClassName('fa fa-plus-circle fa-2x');
        expect(el.length).toBe(0);
    }));
});
describe('Admin Tables Component - Users (Admin/TCS)', () => {
    let component: AdminTablesComponent;
    let fixture: ComponentFixture<AdminTablesComponent>;
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule],
            declarations: [AdminTablesComponent, DigitalDemoSearchPipe, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: CommonService, useClass: MockCommonService },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(AdminTablesComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: CommonService, useClass: MockCommonService },
                    { provide: QuestionService, useClass: MockQuestionService },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
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

        const fixture = TestBed.createComponent(AdminTablesComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminTablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, SharedService, CommonService, QuestionService], (router: Router, sharedSvc: SharedService, commSvc: CommonService, questionSvc: QuestionService) => {
        expect(component).toBeDefined();
    }));

    //it('Should Validate Demo OFfer Code that exceeds  length ', inject([Router, SharedService, CommonService, QuestionService], (router: Router, sharedSvc: SharedService, commSvc: CommonService, questionSvc: QuestionService) => {
    //    component.demoofferCode = 'ABCDE';
    //    component.addNewDemoOffer();
    //    fixture.detectChanges();
    //    fixture.whenStable().then(() => {
    //        fixture.detectChanges();
    //        expect(component.errorMessage).toBe(component.constants.MSG_DIG_DEMO_OFFER);
    //    });
        
    //}));

    it('Should allow user to Edit Demo Code if User is an Admin or TCS User', inject([Router, SharedService, CommonService, QuestionService], (router: Router, sharedSvc: SharedService, commSvc: CommonService, questionSvc: QuestionService) => {
        const el = fixture.nativeElement.getElementsByClassName('fa fa-pencil');
        expect(el.length).toBeGreaterThan(0);
    }));
    it('Should allow user to add new Demo Code if User is an Admin or TCS User', inject([Router, SharedService, CommonService, QuestionService], (router: Router, sharedSvc: SharedService, commSvc: CommonService, questionSvc: QuestionService) => {
        const el = fixture.nativeElement.getElementsByClassName('fa fa-plus-circle fa-2x');
        expect(el.length).toBe(1);
    }));
});

