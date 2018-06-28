import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect,inject } from '@angular/core/testing';
//import { describe, expect, beforeEach, it, spyOn } from 'jasmine';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Http, Headers, HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { BsModalComponent, BsModalService, BsModalModule  } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { DemosSummaryComponent } from './demos-summary.component';
import { FilterSearchComponent } from '../../filter-search/filter-search.component';
import { MultiCheckBoxComponent } from '../../filter-search/multi-check-box/multi-check-box.component';
import {  FreeTextSearchPipe } from '../../_pipes/custom.pipes';
import { RouteGuardService, QuestionService, SharedService } from '../../_services/index';
import { MockLocalStorage, MockQuestionService, RouteGuardMockService, MockRouterNoLogin, MockSharedService, MockModal } from '../../_mocks/index.mock';

describe('DemosSummaryComponent', () => {
  let component: DemosSummaryComponent;
  let fixture: ComponentFixture<DemosSummaryComponent>;
  let store = {};

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [HttpModule, FormsModule, DataTableModule, RouterModule, LoadersCssModule],
          declarations: [DemosSummaryComponent, FilterSearchComponent, MultiCheckBoxComponent, FreeTextSearchPipe, MockModal ],
        providers: [
            { provide: Router, useClass: MockRouterNoLogin },
            { provide: QuestionService, useClass: MockQuestionService },
            { provide: LocalStorageService, useClass: MockLocalStorage },
            { provide: RouteGuardService, useClass: RouteGuardMockService },
            { provide: SharedService, useClass: MockSharedService },
            { provide: ComponentFixtureAutoDetect, useValue: true },
            { provide: BsModalComponent, useClass: MockModal }
        ]
    }).overrideComponent(DemosSummaryComponent, {
        set: {
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
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

    const fixture = TestBed.createComponent(DemosSummaryComponent);
    component = fixture.componentInstance;
  });
    

  it('should have a defined component', inject([SharedService, Router, QuestionService], (_sharedSVC: SharedService, _router: Router, _service: QuestionService) => {
      expect(component).toBeDefined();
  }));

  //it('should be created', () => {
  //  expect(component).toBeTruthy();
  //});
});
