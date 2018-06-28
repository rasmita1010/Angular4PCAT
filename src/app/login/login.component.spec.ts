import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, AuthService } from '../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockModal, MockAuthService } from '../_mocks/index.mock';

import { LoginComponent } from './login.component';

describe('Login Component', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    const window: any = {};
    let store = {};
    let elUsername: any;
    let elPassword: any;
    let elErrMsg: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule],
            declarations: [LoginComponent, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: AuthService, useClass: MockAuthService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(LoginComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
                    { provide: RouteGuardService, useClass: RouteGuardMockService },
                    { provide: AuthService, useClass: MockAuthService },
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

        const fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        elUsername = fixture.nativeElement.getElementsByClassName('txtLogin')[0];
        elPassword = fixture.nativeElement.getElementsByClassName('txtLogin mt20')[1];
        elErrMsg = fixture.nativeElement.getElementsByClassName('errMsg')[0];
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, AuthService], (router: Router, authSvc: AuthService) => {
        expect(component).toBeDefined();
    }));

    it('Should validate empty username and password field on login', inject([Router, AuthService], (router: Router, authSvc: AuthService) => {
        component.userName = '';
        component.password = '';
        component.login();
        fixture.detectChanges();
        const el = fixture.nativeElement.getElementsByClassName('error')[0].textContent.trim();
        expect(el).toBe('Please provide Username and Password to login');
    }));

    it('Should validate empty password field on login', inject([Router, AuthService], (router: Router, authSvc: AuthService) => {
        component.userName = 'testuser';
        component.password = '';
        component.login();
        fixture.detectChanges();
        const el = fixture.nativeElement.getElementsByClassName('error')[0].textContent.trim();
        expect(el).toBe('Please provide Password to login');
    }));

    it('Should validate empty username field on login', inject([Router, AuthService], (router: Router, authSvc: AuthService) => {
        component.userName = '';
        component.password = 'testpassword';
        component.login();
        fixture.detectChanges();
        const el = fixture.nativeElement.getElementsByClassName('error')[0].textContent.trim();
        expect(el).toBe('Please provide User Name to login');
    }));

    //it('Should validate invalid credentials', inject([Router, AuthService], (router: Router, authSvc: AuthService) => {
    //    component.userName = '401';
    //    component.password = 'testpassword';
    //    component.login();
    //    fixture.detectChanges();
    //    fixture.whenStable().then(() => {
    //        fixture.detectChanges();
    //        const el = fixture.nativeElement.getElementsByClassName('error')[0].textContent.trim();
    //        expect(el).toBe(component.constants.ALERT_USER_PERMISSION);
    //    });
    //}));
});


