import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, SharedService, CommonService, AnswerService, QuestionService } from '../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { DataTableModule } from 'angular2-datatable';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService, MockAnswerService } from '../_mocks/index.mock';
import { HighlightPipe, FormatDateMonthPipe, FormatDateTimePipe } from '../_pipes/custom.pipes';

import { QuestionSearchComponent } from './question-search.component';

describe('Questions Search Component', () => {
    let component: QuestionSearchComponent;
    let fixture: ComponentFixture<QuestionSearchComponent>;
    const window: any = {};
    let store = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule, DataTableModule],
            declarations: [QuestionSearchComponent, MockModal, HighlightPipe, FormatDateMonthPipe, FormatDateTimePipe],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: CommonService, useClass: MockCommonService },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: AnswerService, useClass: MockAnswerService },
                { provide: QuestionService, useClass: MockQuestionService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(QuestionSearchComponent, {
            set: {
                providers: [
                    { provide: Router, useClass: MockRouterNoLogin },
                    { provide: LocalStorageService, useClass: MockLocalStorage },
                    { provide: CommonService, useClass: MockCommonService },
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

        const fixture = TestBed.createComponent(QuestionSearchComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(QuestionSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, SharedService, QuestionService], (router: Router, sharedSvc: SharedService, questionSvc: QuestionService) => {
        fixture.nativeElement.getElementsByClassName('panel-body')[0].removeAttribute('style', 'display: none; ')
        expect(component).toBeDefined();
    }));

    it('Should display search results if there are matching demo Codes for the Keyword searched', inject([Router, SharedService, QuestionService], (router: Router, sharedSvc: SharedService, questionSvc: QuestionService) => {
        const keyword = 'fav';
        questionSvc.getQuestionsOnSearch(keyword).subscribe(data => {
            var resultCount = data.length;
            component.searchText = keyword;
            component.searchKeywords();
            fixture.detectChanges();
            fixture.nativeElement.getElementsByClassName('panel-body')[0].removeAttribute('style', 'display: none; ')
            const el = fixture.nativeElement.getElementsByClassName('result-data')[0];
            const items = el.children.length;
            expect(items).toBe(resultCount);
        });
    }));

    it('Should display no results found if there are no search results if there are matching demo Codes for the Keyword searched', inject([Router, SharedService, QuestionService], (router: Router, sharedSvc: SharedService, questionSvc: QuestionService) => {
        const keyword = 'testkeyword';
        component.searchText = keyword;
        component.searchKeywords();
        fixture.detectChanges();
        fixture.nativeElement.getElementsByClassName('panel-body')[0].removeAttribute('style', 'display: none; ')
        const result = fixture.nativeElement.getElementsByClassName('result-data')[0].children[0].textContent.trim();
        expect(result).toBe(component.constants.SEARCH_KEYWORD_EMPTY_RESULT);
    }));

    it('Should allow Admin / Marketing users to Create new question from Home Page', inject([Router, SharedService, QuestionService], (router: Router, sharedSvc: SharedService, questionSvc: QuestionService) => {
        var element = fixture.nativeElement.getElementsByClassName('inb btnc panelb fr')[0].textContent.trim();
        expect(element).toBeDefined();
    }));
});

