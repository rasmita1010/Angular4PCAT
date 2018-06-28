import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, SharedService } from '../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService, MockReadOnlyLocalStorage } from '../_mocks/index.mock';

import { NavTabsComponent } from './nav-tabs.component';

describe('Navigation Tabs Component - User roles containing Admin', () => {
    let component: NavTabsComponent;
    let fixture: ComponentFixture<NavTabsComponent>;
    const window: any = {};
    let store = {};
    let routes: Routes = [];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule],
            declarations: [NavTabsComponent, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(NavTabsComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
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

        const fixture = TestBed.createComponent(NavTabsComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        expect(component).toBeDefined();
    }));

    it('Should Display Home tab as default landing page for users other than strictly Readonly Component Successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        const activeTabName = fixture.nativeElement.getElementsByClassName('notify')[0].textContent.trim();
        expect(activeTabName).toBe(component.constants.PCA_HOME);
    }));

    it('Should Contain Setup tab if the user belongs to Admin Role Successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        const listItems = fixture.nativeElement.getElementsByClassName('ml15');
        const tabNames = [];
        for (let i = 0; i < listItems.length; i++) {
            tabNames.push(listItems[i].textContent.trim());
        }
        expect(tabNames.indexOf(component.constants.PCA_SETUP)).toBeGreaterThan(-1);
    }));


});
describe('Navigation Tabs Component - User roles containing Strictly Readonly', () => {
    let component: NavTabsComponent;
    let fixture: ComponentFixture<NavTabsComponent>;
    const window: any = {};
    let store = {};
    let routes: Routes = [];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule],
            declarations: [NavTabsComponent, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockReadOnlyLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(NavTabsComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockReadOnlyLocalStorage },
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
                    return JSON.stringify(new MockReadOnlyLocalStorage().getItem(key));
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
            return JSON.stringify(new MockReadOnlyLocalStorage().getItem(key));
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

        const fixture = TestBed.createComponent(NavTabsComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Display Questions tab as default landing page for users who are strictly Readonly Successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        const listItems = fixture.nativeElement.getElementsByClassName('ml15');
        const tabNames = [];
        for (let i = 0; i < listItems.length; i++) {
            tabNames.push(listItems[i].textContent.trim());
        }
        expect(tabNames.indexOf(component.constants.PCA_HOME)).toBe(-1);
    }));

    it('Should Not Contain Setup tab if the user does not belongs to Admin Role Successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        const listItems = fixture.nativeElement.getElementsByClassName('ml15');
        const tabNames = [];
        for (let i = 0; i < listItems.length; i++) {
            tabNames.push(listItems[i].textContent.trim());
        }
        expect(tabNames.indexOf(component.constants.PCA_SETUP)).toBe(-1);
    }));


});


