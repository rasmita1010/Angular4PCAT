// Module imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { DndModule } from 'ng2-dnd';
import { BsModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DataTableModule } from 'angular2-datatable';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { LoadersCssModule } from 'angular2-loaders-css';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { PopoverModule } from 'ng2-popover';
import { MyDatePickerModule } from 'mydatepicker';

// Component imports
import { AppComponent } from './app.component';
import { AdminSetupComponent } from './admin-setup/admin-setup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { AdminTablesComponent } from './admin-tables/admin-tables.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ManageDemosComponent, DemosSummaryComponent, ChainOfferComponent, ViewDemosComponent, ChainOfferSetupComponent, UsersViewComponent, CommmentsComponent } from './questions/index';
import { HomeComponent } from './home/home.component';
import { QuestionSearchComponent } from './question-search/question-search.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrioritizeDemosComponent } from './questions/prioritize-demos/prioritize-demos.component';
import { MagazineComponent } from './questions/magazine/magazine.component';
import { ChoiceAnswerComponent } from './questions/manage-demos/demo-offers/choice-answer/choice-answer.component';
import { NonChoiceAnswersComponent } from './questions/manage-demos/demo-offers/non-choice-answers/non-choice-answers.component';
import { FilterSearchComponent } from './filter-search/filter-search.component';
import { MultiCheckBoxComponent } from './filter-search/multi-check-box/multi-check-box.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';

// Custom pipes
import { FreeUserPipe, HighlightPipe, ForcedChainPipe, ChoiceChainPipe, FreeTextSearchPipe, DemoOfferCodePipe, DemoOfferSearchPipe, PendingScheduleSearchPipe, CompletedScheduleSearchPipe, SourceRecordName, MagazineDemoOfferCode, DisplayPipe, DigitalDemoSearchPipe, FormatDatePipe, FormatDateTimePipe, FormatDateMonthPipe } from './_pipes/custom.pipes';

// Service imports
import { AuthService, CommonService, QuestionService, SharedService, AnswerService, PreferenceDataService } from './_services/index';
import { RouteGuardService, AdminGuardService, ReadOnlyGuardService, AdminTMMGuardService, QuestionPendingChangesGuard, AdminChangesGuardService, PrioritizePendingChangesGuard, LoginGuardService } from './_services/index';

@NgModule({
    declarations: [
        AppComponent,
        AdminSetupComponent,
        LoginComponent,
        FreeUserPipe,
        DashboardComponent,
        NavTabsComponent,
        AdminTablesComponent,
        ScheduleComponent,
        ManageDemosComponent,
        ViewDemosComponent,
        DemosSummaryComponent,
        HomeComponent,
        QuestionSearchComponent,
        NotificationsComponent,
        HighlightPipe,
        ChainOfferComponent,
        ChainOfferSetupComponent,
        FreeTextSearchPipe,
        PrioritizeDemosComponent,
        DemoOfferCodePipe,
        DemoOfferSearchPipe,
        MagazineComponent,
        UsersViewComponent,
        ChoiceAnswerComponent,
        NonChoiceAnswersComponent,
        PendingScheduleSearchPipe,
        CompletedScheduleSearchPipe,
        SourceRecordName,
        UsersViewComponent,
        CommmentsComponent,
        MagazineDemoOfferCode,
        FilterSearchComponent,
        MultiCheckBoxComponent,
        ForcedChainPipe,
        ChoiceChainPipe,
        AlertMessageComponent,
        DisplayPipe,
        DigitalDemoSearchPipe,
        FormatDatePipe,
        FormatDateTimePipe,
        FormatDateMonthPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        DndModule.forRoot(),
        BsModalModule,
        NgIdleKeepaliveModule.forRoot(),
        PopoverModule,
        DataTableModule,
        IonRangeSliderModule,
        LoadersCssModule,
        MyDatePickerModule
    ],
    providers: [AuthService, SharedService, RouteGuardService, AdminGuardService, ReadOnlyGuardService, AdminTMMGuardService, QuestionService, CommonService, AnswerService, QuestionPendingChangesGuard, AdminChangesGuardService, PreferenceDataService, PrioritizePendingChangesGuard, LoginGuardService ],
    bootstrap: [AppComponent]
})
export class AppModule { }
