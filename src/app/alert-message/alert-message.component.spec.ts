import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement,EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, PreferenceDataService } from '../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockSharedService, MockCommonService, MockModal, MockPreferenceService } from '../_mocks/index.mock';
import { AlertMessageComponent } from './alert-message.component';

describe('Alert Messages Component', () => {
    let component: AlertMessageComponent;
    let fixture: ComponentFixture<AlertMessageComponent>;
    const window: any = {};
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule],
            declarations: [AlertMessageComponent, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: PreferenceDataService, useClass: MockPreferenceService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: BsModalComponent, useClass: MockModal },
                { provide: Location }
            ],
        }).overrideComponent(AlertMessageComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
                    { provide: PreferenceDataService,useClass:MockPreferenceService },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
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

        const fixture = TestBed.createComponent(AlertMessageComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, Location, PreferenceDataService], (router: Router, prefSvc: PreferenceDataService) => {
        expect(component).toBeDefined();
    }));
});

