import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FreeUserPipe } from '../_pipes/custom.pipes';
import { AdminSetupComponent } from './admin-setup.component';
import { RouteGuardService, SharedService, CommonService } from '../_services/index';
import { DndModule } from 'ng2-dnd';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockSharedService, MockCommonService, MockModal } from '../_mocks/index.mock';

describe('Admin Setup Component', () => {
    let component: AdminSetupComponent;
    let fixture: ComponentFixture<AdminSetupComponent>;
    const window: any = {};
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, DndModule, LoadersCssModule],
            declarations: [AdminSetupComponent, FreeUserPipe, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: CommonService, useClass: MockCommonService },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(AdminSetupComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: CommonService, useClass: MockCommonService },
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

        const fixture = TestBed.createComponent(AdminSetupComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminSetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, CommonService, Location], (router: Router, commSvc: CommonService) => {
        expect(component).toBeDefined();
    }));
});
