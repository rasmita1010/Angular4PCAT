//import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect, inject } from '@angular/core/testing';
////import { describe, expect, beforeEach, it, spyOn } from 'jasmine';
//import { LocalStorageService } from 'angular-2-local-storage';
//import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
//import { Http, Headers, HttpModule } from '@angular/http';
//import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
//import { DataTableModule } from 'angular2-datatable';
//import { BsModalComponent, BsModalService, BsModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
//import { LoadersCssModule } from 'angular2-loaders-css';
//import { PopoverModule } from 'ng2-popover';
//import { DndModule } from 'ng2-dnd';
//import { Subject } from 'rxjs/Subject';
//import { Observable } from 'rxjs/Rx';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//import { ManageDemosComponent } from './manage-demos.component';
//import { DemosSummaryComponent, ChainOfferComponent, ViewDemosComponent, ChainOfferSetupComponent, UsersViewComponent, CommmentsComponent } from '../../questions/index';
//import { MagazineComponent } from '../magazine/magazine.component';
//import { ChoiceAnswerComponent } from './demo-offers/choice-answer/choice-answer.component';
//import { NonChoiceAnswersComponent } from './demo-offers/non-choice-answers/non-choice-answers.component';
//import { FreeTextSearchPipe, DemoOfferCodePipe, HighlightPipe, FormatDateMonthPipe, DemoOfferSearchPipe, SourceRecordName, MagazineDemoOfferCode, FormatDatePipe, DisplayPipe, FormatDateTimePipe } from '../../_pipes/custom.pipes';
//import { RouteGuardService, QuestionService, SharedService, AnswerService } from '../../_services/index';
//import { MockLocalStorage, MockQuestionService, MockAnswerService, RouteGuardMockService, MockRouterNoLogin, MockSharedService, MockModal, MockActivatedRoute } from '../../_mocks/index.mock';

//describe('ManageDemosComponent', () => {
//  let component: ManageDemosComponent;
//  let fixture: ComponentFixture<ManageDemosComponent>;
//  let store = {};
//  let route: MockActivatedRoute;

//  beforeEach(() => {
//      route = new MockActivatedRoute();
//      TestBed.configureTestingModule({
//          imports: [HttpModule, FormsModule, ReactiveFormsModule, DataTableModule, RouterModule, DndModule, LoadersCssModule, PopoverModule],
//          declarations: [ManageDemosComponent, MockModal, HighlightPipe, FormatDateMonthPipe, DemoOfferSearchPipe, DemoOfferCodePipe, MagazineDemoOfferCode, DisplayPipe, FormatDatePipe, FormatDateTimePipe, SourceRecordName, ChoiceAnswerComponent, NonChoiceAnswersComponent, MagazineComponent, CommmentsComponent, ChainOfferComponent, UsersViewComponent],
//          providers: [
//              { provide: Router, useClass: MockRouterNoLogin },
//              { provide: QuestionService, useClass: MockQuestionService },
//              { provide: AnswerService, useClass: MockAnswerService },
//              { provide: LocalStorageService, useClass: MockLocalStorage },
//              { provide: RouteGuardService, useClass: RouteGuardMockService },
//              { provide: SharedService, useClass: MockSharedService },
//              { provide: ComponentFixtureAutoDetect, useValue: true },
//              { provide: BsModalComponent, useClass: MockModal },
//              { provide: ActivatedRoute, useValue: { params: Observable.of({ type: 'create' }) } }
//          ],
//          schemas: [CUSTOM_ELEMENTS_SCHEMA]
//      }).overrideComponent(ManageDemosComponent, {
//          set: {
//              providers: [
//                  { provide: Router, useClass: MockRouterNoLogin },
//                  { provide: QuestionService, useClass: MockQuestionService },
//                  { provide: AnswerService, useClass: MockAnswerService },
//                  { provide: LocalStorageService, useClass: MockLocalStorage },
//                  { provide: RouteGuardService, useClass: RouteGuardMockService },
//                  { provide: SharedService, useClass: MockSharedService },
//                  { provide: BsModalComponent, useClass: MockModal },
//                  { provide: ActivatedRoute, useValue: route }
//              ]
//          }
//      });

//      const mock = (function () {
//          let store = {};
//          return {
//              getItem: function (key) {
//                  return JSON.stringify(new MockLocalStorage().getItem(key));
//              },
//              setItem: function (key, value) {
//                  store[key] = value.toString();
//              },
//              clear: function () {
//                  store = {};
//              }
//          };
//      })();
//      Object.defineProperty(window, 'sessionStorage', { value: mock, configurable: true, enumerable: true, writable: true });
//      spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
//          return JSON.stringify(new MockLocalStorage().getItem(key));
//      });
//      spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
//          delete store[key];
//      });
//      spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
//          return store[key] = <string>value;
//      });
//      spyOn(localStorage, 'clear').and.callFake(() => {
//          store = {};
//      });

//      const fixture = TestBed.createComponent(ManageDemosComponent);
//      component = fixture.componentInstance;
//  });


//  it('should have a defined component', inject([Router, ActivatedRoute, FormBuilder, QuestionService, SharedService, AnswerService], (
//  _router: Router, _route: ActivatedRoute, fb: FormBuilder, _questionService: QuestionService, _sharedSVC: SharedService, _answerService: AnswerService
//      ) => {
//      expect(component).toBeDefined();
//  }));

//});
