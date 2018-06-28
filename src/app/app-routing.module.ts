// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './login/login.component';
import { AdminSetupComponent } from './admin-setup/admin-setup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminTablesComponent } from './admin-tables/admin-tables.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ManageDemosComponent } from './questions/manage-demos/manage-demos.component';
import { ViewDemosComponent } from './questions/view-demos/view-demos.component';
import { PrioritizeDemosComponent } from './questions/prioritize-demos/prioritize-demos.component';
import { DemosSummaryComponent } from './questions/demos-summary/demos-summary.component';
import { HomeComponent } from './home/home.component';

// Services
import { RouteGuardService, AdminGuardService, ReadOnlyGuardService, AdminTMMGuardService, QuestionPendingChangesGuard, AdminChangesGuardService, PrioritizePendingChangesGuard, LoginGuardService } from './_services/index';

const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [LoginGuardService] },

    { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [RouteGuardService],
        children:
        [
            { path: '', pathMatch: 'full', redirectTo: 'home' },

            { path: 'questions', component: DemosSummaryComponent },

            { path: 'questions/view', component: ViewDemosComponent },

            { path: 'questions/prioritize', component: PrioritizeDemosComponent, canDeactivate: [PrioritizePendingChangesGuard]  },

            { path: 'questions/:action', component: ManageDemosComponent, canDeactivate: [QuestionPendingChangesGuard] },

            { path: 'home', component: HomeComponent, canActivate: [ReadOnlyGuardService] },

            { path: 'schedule', component: ScheduleComponent },

            { path: 'digital', component: AdminTablesComponent },

            { path: 'setup', component: AdminSetupComponent, canActivate: [AdminGuardService], canDeactivate: [AdminChangesGuardService] }
        ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
