//import { AppComponent } from './app.component';
//import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
//import { Http, Headers, HttpModule } from '@angular/http';
//import { Location } from '@angular/common';
//import { FormsModule } from '@angular/forms';
//import { By } from '@angular/platform-browser';
//import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { LocalStorageService } from 'angular-2-local-storage';
//import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';

//import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
//import { LoadersCssModule } from 'angular2-loaders-css';
//import { DataTableModule } from 'angular2-datatable';
//import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
//import { Observable } from 'rxjs/Rx';
//import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService, MockAnswerService, MockActivatedRoute } from './_mocks/index.mock';


//describe('App Component', () => {
//    let component: AppComponent;
//    let fixture: ComponentFixture<AppComponent>;
//    const window: any = {};
//    let store = {};
//    let route: MockActivatedRoute;
//    beforeEach(() => {
//        TestBed.configureTestingModule({
//            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule, NgIdleKeepaliveModule],
//            declarations: [AppComponent, MockModal],
//            schemas: [CUSTOM_ELEMENTS_SCHEMA],
//            providers: [
//                { provide: Router, useClass: MockRouterNoLogin },
//                { provide: ActivatedRoute, useValue: { params: Observable.of({ type: 'create' }) } },
//                { provide: LocalStorageService, useClass: MockLocalStorage },
//                { provide: ComponentFixtureAutoDetect, useValue: true },
//                { provide: Location },
//                { provide: BsModalComponent, useClass: MockModal }
//            ],
//        }).overrideComponent(AppComponent, {
//            set: {
//                providers: [
//                    { provide: Router, useClass: MockRouterNoLogin },
//                    { provide: LocalStorageService, useClass: MockLocalStorage },
//                    { provide: BsModalComponent, useClass: MockModal },
//                    { provide: ActivatedRoute, useValue: route }
//                ]
//            }
//        });
//        const mock = (function () {
//            let store = {};
//            return {
//                getItem: function (key) {
//                    return JSON.stringify(new MockLocalStorage().getItem(key));
//                },
//                setItem: function (key, value) {
//                    store[key] = value.toString();
//                },
//                clear: function () {
//                    store = {};
//                }
//            };
//        })();
//        Object.defineProperty(window, 'sessionStorage', { value: mock, configurable: true, enumerable: true, writable: true });
//        spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
//            return JSON.stringify(new MockLocalStorage().getItem(key));
//        });
//        spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
//            delete store[key];
//        });
//        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
//            return store[key] = <string>value;
//        });
//        spyOn(localStorage, 'clear').and.callFake(() => {
//            store = {};
//        });

//        const fixture = TestBed.createComponent(AppComponent);
//        component = fixture.componentInstance;
//    });

//    beforeEach(() => {
//        fixture = TestBed.createComponent(AppComponent);
//        component = fixture.componentInstance;
//        fixture.detectChanges();
//    });

//    it('Should Load Component Successfully', inject([Router], (router: Router) => {
//        expect(component).toBeDefined();
//    }));
//});




