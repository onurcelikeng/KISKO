import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

//components
import { LoginComponent } from '../../pages/account/login/login.component';
import { ForgotpasswordComponent } from '../../pages/account/forgotpassword/forgotpassword.component';
import { MainComponent } from '../../pages/shared/main/main.component';
import { UsersComponent } from '../../pages/admin/users/users.component';
import { DoctorsComponent } from '../../pages/admin/doctors/doctors.component';
import { PlacesComponent } from '../../pages/admin/places/places.component';
import { CheckupsComponent } from '../../pages/admin/checkups/checkups.component';
import { NotificationsComponent } from '../../pages/shared/notifications/notifications.component';
import { SystemnotificaitonComponent } from '../../pages/admin/systemnotificaiton/systemnotificaiton.component';
import { LabrequestComponent } from '../../pages/lab/labrequest/labrequest.component';
import { ExaminationComponent } from '../../pages/admin/examination/examination.component';
import { PlacetypeComponent } from '../../pages/admin/placetype/placetype.component';
import { DiseaseComponent } from '../../pages/admin/disease/disease.component';
import { BranchsComponent } from '../../pages/admin/branchs/branchs.component';
import { QuestionsComponent } from '../../pages/doctor/questions/questions.component';
import { FieldComponent } from '../../pages/doctor/field/field.component';
import { CalendarComponent } from '../../pages/shared/calendar/calendar.component';
import { MedicalComponent } from '../../pages/shared/medical/medical.component';
import { PatientComponent } from '../../pages/shared/patient/patient.component';
import { SettingsComponent } from '../../pages/shared/settings/settings.component';
import { MysecretaryComponent } from '../../pages/doctor/mysecretary/mysecretary.component';
import { ChangepasswordComponent } from '../../pages/shared/changepassword/changepassword.component';
import { PromotionComponent } from '../../pages/doctor/promotion/promotion.component';
import { ErrorComponent } from '../../pages/shared/error/error.component';
import { CommentsComponent } from '../../pages/doctor/comments/comments.component';
import { ArticlesComponent } from '../../pages/doctor/articles/articles.component';
import { CalendartypeComponent } from '../../pages/doctor/calendartype/calendartype.component';
import { VideosComponent } from '../../pages/doctor/videos/videos.component';
import { ProfilesComponent } from '../../pages/shared/profiles/profiles.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'forgot', component: ForgotpasswordComponent },          
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { 
        path: 'main',
        component: MainComponent,
        canActivate: [
          AuthGuard
        ],
        children: [
          {
            path: 'users',
            component: UsersComponent
          },
          {
            path: 'doctors',
            component: DoctorsComponent
          },
          {
            path: 'places',
            component: PlacesComponent
          },
          {
            path: 'checkups',
            component: CheckupsComponent
          },
          {
            path: 'notifications',
            component: NotificationsComponent
          },
          {
            path: 'systemnotifications',
            component: SystemnotificaitonComponent
          },
          {
            path: 'patient',
            component: PatientComponent
          },
          {
            path: 'labrequests',
            component: LabrequestComponent
          },
          {
            path: 'mysecretary',
            component: MysecretaryComponent
          },
          {
            path: 'placetypes',
            component: PlacetypeComponent
          },
          {
            path: 'diseases',
            component: DiseaseComponent
          },
          {
            path: 'branchs',
            component: BranchsComponent
          },
          {
            path: 'questions',
            component: QuestionsComponent
          },
          {
            path: 'calender',
            component: CalendarComponent
          },
          {
            path: 'profile',
            component: ProfilesComponent
          },
          {
            path: 'fields',
            component: FieldComponent
          },
          {
            path: 'medical',
            component: MedicalComponent
          },
          {
            path: 'settings',
            component: SettingsComponent
          },
          {
            path: 'promotion',
            component: PromotionComponent
          },
          {
            path: 'changepassword',
            component: ChangepasswordComponent
          },
          {
            path: 'error',
            component: ErrorComponent
          },
          {
            path: 'comments',
            component: CommentsComponent
          },
          {
            path: 'articles',
            component: ArticlesComponent
          },
          {
            path: 'calendartypes',
            component: CalendartypeComponent
          },
          {
            path: 'videos',
            component: VideosComponent
          }
        ] },
    ], {useHash:true})
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }