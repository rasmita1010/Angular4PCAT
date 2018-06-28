import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed, inject } from '@angular/core/testing';
import { Http, Headers, HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { RouterModule, Router, Routes, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouteGuardService, SharedService } from '../../_services/index';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MockLocalStorage, RouteGuardMockService, MockRouterNoLogin, MockQuestionService, MockSharedService, MockModal, MockCommonService } from '../../_mocks/index.mock';
import { CommonFilterModel } from '../../_models/index';

import { MultiCheckBoxComponent } from './multi-check-box.component';

describe('Multi-checkbox Component', () => {
    let component: MultiCheckBoxComponent;
    let fixture: ComponentFixture<MultiCheckBoxComponent>;
    const window: any = {};
    let store = {};
    let routes: Routes = [];
    const channels = [
        {
            'ChannelName': 'Test Channel 1',
            'ChannelId': 1
        },
        {
            'ChannelName': 'Test Channel 2',
            'ChannelId': 2
        },
        {
            'ChannelName': 'Test Channel 3',
            'ChannelId': 3
        }
    ]
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, LoadersCssModule],
            declarations: [MultiCheckBoxComponent, MockModal],
            providers: [
                { provide: Router, useClass: MockRouterNoLogin },
                { provide: LocalStorageService, useClass: MockLocalStorage },
                { provide: RouteGuardService, useClass: RouteGuardMockService },
                { provide: SharedService, useClass: MockSharedService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: Location },
                { provide: BsModalComponent, useClass: MockModal }
            ],
        }).overrideComponent(MultiCheckBoxComponent, {
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
        
        const fixture = TestBed.createComponent(MultiCheckBoxComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiCheckBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should Load Component Successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        expect(component).toBeDefined();
    }));

    it('Should Load Filter Values successfully', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {
        
        const MCChannels = [];
        channels.forEach(mag => {
            MCChannels.push(new CommonFilterModel(mag.ChannelName, mag.ChannelId, false));
        });
        component.ColumnName = component.constants.FTR_MAGCODE;
        component.filterColumn = MCChannels;
        fixture.detectChanges();
        const el = fixture.nativeElement.getElementsByClassName('checkbox');
        expect(el.length).toBe(channels.length + 1);

    }));

    it("Component should display ' Select All ' message when no items are selected.", inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {

        const MCChannels = [];
        channels.forEach(mag => {
            MCChannels.push(new CommonFilterModel(mag.ChannelName, mag.ChannelId, false));
        });
        component.ColumnName = component.constants.FTR_MAGCODE;
        component.filterColumn = MCChannels;
        component.setselectedMsg();
        fixture.detectChanges();
        expect(component.selectedText).toBe(component.constants.LBL_SELECT_ALL);

    }));

    it('Component should display Selected Filter Column Values when there are some items selected.', inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {

        const MCChannels = [];
        channels.forEach(mag => {
            MCChannels.push(new CommonFilterModel(mag.ChannelName, mag.ChannelId, true));
        });
        MCChannels[0].IsSelected = false;
        component.ColumnName = component.constants.FTR_MAGCODE;
        component.filterColumn = MCChannels;
        component.setselectedMsg();
        fixture.detectChanges();
        expect(component.selectedText).toBe('Test Channel 2,Test Channel 3');

    }));

    it(" Component should display 'All selected' when all items are selected.", inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {

        const MCChannels = [];
        channels.forEach(mag => {
            MCChannels.push(new CommonFilterModel(mag.ChannelName, mag.ChannelId, true));
        });
        component.ColumnName = component.constants.FTR_MAGCODE;
        component.filterColumn = MCChannels;
        component.setselectedMsg();
        fixture.detectChanges();
        expect(component.selectedText).toBe(component.constants.LBL_ALL_SELECTED);

    }));

    it(" Component should select all items when 'Select All' is checked ", inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {

        const MCChannels = [];
        channels.forEach(mag => {
            MCChannels.push(new CommonFilterModel(mag.ChannelName, mag.ChannelId, false));
        });
        component.ColumnName = component.constants.FTR_MAGCODE;
        component.filterColumn = MCChannels;
        component.selectAll = true;
        component.selectAllItems();
        fixture.detectChanges();
        expect(component.selectedText).toBe(component.constants.LBL_ALL_SELECTED);

    }));

    it(" Component should deselect all items when 'Select All' is unchecked ", inject([Router, SharedService], (router: Router, sharedSvc: SharedService) => {

        const MCChannels = [];
        channels.forEach(mag => {
            MCChannels.push(new CommonFilterModel(mag.ChannelName, mag.ChannelId, true));
        });
        component.ColumnName = component.constants.FTR_MAGCODE;
        component.filterColumn = MCChannels;
        component.selectAll = false;
        component.selectAllItems();
        fixture.detectChanges();
        expect(component.selectedText).toBe(component.constants.LBL_SELECT_ALL);

    }));

    
});

