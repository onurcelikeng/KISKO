//modules
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'angular-calendar';
import { DataTablesModule } from 'angular-datatables';
import { SelectModule } from 'ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { TextMaskModule } from 'angular2-text-mask';
import {BreadcrumbsModule} from "ng2-breadcrumbs";
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CommonModule } from '@angular/common';
import { MyDatePickerModule } from 'mydatepicker';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AuthGuard } from './../guards/auth.guard';
import swal from 'sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { NgDatepickerModule } from 'ng2-datepicker';
import { InputMaskModule } from 'ng2-inputmask';

//componenets
import { AppComponent } from './app.component';
import { ContentComponent } from '../pages/shared/content/content.component';
import { ForgotpasswordComponent } from '../pages/account/forgotpassword/forgotpassword.component';
import { LoginComponent } from '../pages/account/login/login.component';
import { MainComponent } from '../pages/shared/main/main.component';
import { NavbarComponent } from '../pages/shared/navbar/navbar.component';
import { SidebarComponent } from '../pages/shared/sidebar/sidebar.component';
import { UsersComponent } from '../pages/admin/users/users.component';
import { NotificationsComponent } from '../pages/shared/notifications/notifications.component';
import { SystemnotificaitonComponent } from '../pages/admin/systemnotificaiton/systemnotificaiton.component';
import { LabrequestComponent } from '../pages/lab/labrequest/labrequest.component';
import { DoctorsComponent } from '../pages/admin/doctors/doctors.component';
import { PlacesComponent } from '../pages/admin/places/places.component';
import { CheckupsComponent } from '../pages/admin/checkups/checkups.component';
import { PlacetypeComponent } from '../pages/admin/placetype/placetype.component';
import { ExaminationComponent } from '../pages/admin/examination/examination.component';
import { DiseaseComponent } from '../pages/admin/disease/disease.component';
import { BranchsComponent } from '../pages/admin/branchs/branchs.component';
import { QuestionsComponent } from '../pages/doctor/questions/questions.component';
import { FieldComponent } from '../pages/doctor/field/field.component';
import { CalendarComponent } from '../pages/shared/calendar/calendar.component';
import { MedicalComponent } from '../pages/shared/medical/medical.component';
import { PatientComponent } from '../pages/shared/patient/patient.component';
import { MessageService } from '../services/MessageService/index';
import { SettingsComponent } from '../pages/shared/settings/settings.component';
import { MysecretaryComponent } from '../pages/doctor/mysecretary/mysecretary.component';
import { ChangepasswordComponent } from '../pages/shared/changepassword/changepassword.component';
import { PromotionComponent } from '../pages/doctor/promotion/promotion.component';
import { ErrorComponent } from '../pages/shared/error/error.component';
import { CommentsComponent } from '../pages/doctor/comments/comments.component';
import { ArticlesComponent } from '../pages/doctor/articles/articles.component';
import { CalendartypeComponent } from '../pages/doctor/calendartype/calendartype.component';
import { VideosComponent } from '../pages/doctor/videos/videos.component';
import { ProfilesComponent } from '../pages/shared/profiles/profiles.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    ForgotpasswordComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    UsersComponent,
    NotificationsComponent,
    SystemnotificaitonComponent,
    LabrequestComponent,
    DoctorsComponent,
    PlacesComponent,
    CheckupsComponent,
    PlacetypeComponent,
    ExaminationComponent,
    DiseaseComponent,
    BranchsComponent,
    QuestionsComponent,
    FieldComponent,
    CalendarComponent,
    MedicalComponent,
    PatientComponent,
    SettingsComponent,
    MysecretaryComponent,
    ChangepasswordComponent,
    PromotionComponent,
    ErrorComponent,
    CommentsComponent,
    ArticlesComponent,
    CalendartypeComponent,
    VideosComponent,
    ProfilesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    InputMaskModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DataTablesModule,
    SelectModule,
    BrowserAnimationsModule,
    NgDatepickerModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true
    }),
    BreadcrumbsModule,
    MultiselectDropdownModule,
    TextMaskModule,
    Ng2SmartTableModule,
    CalendarModule.forRoot(),
    DragAndDropModule,
    CommonModule,
    MyDatePickerModule,
    AngularDateTimePickerModule
  ],
  providers: [ AuthGuard, MessageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
