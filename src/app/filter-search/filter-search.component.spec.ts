import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, SharedService, CommonService, PreferenceDataService, QuestionService } from '../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService } from '../_mocks/index.mock';

import { FilterSearchComponent } from './filter-search.component';
import { MultiCheckBoxComponent } from './multi-check-box/multi-check-box.component';

describe('Filter Search Component', () => {
    let component: FilterSearchComponent;
    let fixture: ComponentFixture<FilterSearchComponent>;
    const window: any = {};
    let store = {};
    let routes: Routes = [];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule],
            declarations: [FilterSearchComponent, MockModal, MultiCheckBoxComponent],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: CommonService, useClass: MockCommonService },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(FilterSearchComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: CommonService, useClass: MockCommonService },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
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

        const fixture = TestBed.createComponent(FilterSearchComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, CommonService, Location, QuestionService], (router: Router, commSvc: CommonService, questionSvc: QuestionService) => {
        expect(component).toBeDefined();
    }));
});

