//import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
//import { Http, Headers, HttpModule } from '@angular/http';
//import { Location } from '@angular/common';
//import { FormsModule } from '@angular/forms';
//import { By } from '@angular/platform-browser';
//import { DebugElement, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { LocalStorageService } from 'angular-2-local-storage';
//import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
//import { RouterTestingModule } from '@angular/router/testing';
//import { RouteGuardService, SharedService, CommonService, AnswerService, QuestionService } from '../../_services/index';
//import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
//import { LoadersCssModule } from 'angular2-loaders-css';
//import { DataTableModule } from 'angular2-datatable';
//import { DndModule, DragDropService, DragDropConfig, DragDropSortableService, DraggableComponent } from 'ng2-dnd';
//import { MyDatePickerModule } from 'mydatepicker';
//import { Observable } from 'rxjs/Rx';
//import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService, MockAnswerService, MockActivatedRoute } from '../../_mocks/index.mock';
//import { FormatDatePipe, FormatDateMonthPipe, FormatDateTimePipe } from '../../_pipes/custom.pipes';

//import { PrioritizeDemosComponent } from './prioritize-demos.component';

//describe('Prioritize Demo Component', () => {
//    let component: PrioritizeDemosComponent;
//    let fixture: ComponentFixture<PrioritizeDemosComponent>;
//    const window: any = {};
//    let store = {};
//    let route: MockActivatedRoute;
//    let elemRef: ElementRef = new ElementRef('test');
//    let tst = elemRef.nativeElement;
//   // elemRef.nativeElement = 'test';
//    let drpSvc: DragDropService = new DragDropService();
//    drpSvc.allowedDropZones = null;
//    let drgConfig: DragDropConfig = new DragDropConfig();
//    drgConfig.onDragStartClass = null;
//    let chnRef : ChangeDetectorRef;
//    //chnRef.markForCheck();
//    console.log(drgConfig.defaultCursor);
//    elemRef.nativeElement.style.cursor = drgConfig.defaultCursor;
//    let dndCmpt: DraggableComponent = new DraggableComponent(elemRef, drpSvc, drgConfig, chnRef);
//    beforeEach(() => {
//      //  dndCmpt._defaultCursor = drgConfig.defaultCursor;
//        TestBed.configureTestingModule({
//            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule, RouterTestingModule, MyDatePickerModule, DndModule],
//            declarations: [PrioritizeDemosComponent, MockModal, FormatDatePipe, FormatDateMonthPipe, FormatDateTimePipe, dndCmpt],
//            schemas: [CUSTOM_ELEMENTS_SCHEMA],
//            providers: [
//                { provide: Router, useClass: MockRouterNoLogin },
//                { provide: ActivatedRoute, useValue: { params: Observable.of({ type: 'create' }) } },
//                { provide: LocalStorageService, useClass: MockLocalStorage },
//                { provide: CommonService, useClass: MockCommonService },
//                { provide: RouteGuardService, useClass: RouteGuardMockService },
//                { provide: SharedService, useClass: MockSharedService },
//                { provide: AnswerService, useClass: MockAnswerService },
//                { provide: QuestionService, useClass: MockQuestionService },
//                { provide: ComponentFixtureAutoDetect, useValue: true },
//                { provide: DragDropService },
//                { provide: DragDropConfig },
//                { provide: DragDropSortableService },
//                { provide: Location },
//                { provide: BsModalComponent, useClass: MockModal }
//            ],
//        }).overrideComponent(PrioritizeDemosComponent, {
//            set: {
//                providers: [
//                    { provide: Router, useClass: MockRouterNoLogin },
//                    { provide: LocalStorageService, useClass: MockLocalStorage },
//                    { provide: CommonService, useClass: MockCommonService },
//                    { provide: RouteGuardService, useClass: RouteGuardMockService },
//                    { provide: QuestionService, useClass: MockQuestionService },
//                    { provide: SharedService, useClass: MockSharedService },
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

//        const fixture = TestBed.createComponent(PrioritizeDemosComponent);
//        component = fixture.componentInstance;
//    });

//    beforeEach(() => {
//        fixture = TestBed.createComponent(PrioritizeDemosComponent);
//        component = fixture.componentInstance;
//        fixture.detectChanges();
//    });

//    it('Should Load Component Successfully', inject([Router, CommonService, SharedService], (router: Router, commonSvc: CommonService, sharedSvc: SharedService) => {
//        expect(component).toBeDefined();
//    }));
//});


