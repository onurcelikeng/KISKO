import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';

//services
import { AccountService } from '../../../services/AccountService/account.service';
import { QuestionService } from '../../../services/QuestionService/question.service';
import { SecretaryService } from '../../../services/SecretaryService/secretary.service';
import { NotificationService } from '../../../services/NotificationService/notification.service';
import { ChatService } from '../../../services/ChatService/chat.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../services/MessageService/index';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';

declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AccountService, QuestionService, ChatService, NotificationService, SecretaryService]
})
export class NavbarComponent implements OnInit, OnDestroy {
  nameSurname: string;
  photo: string;
  email: string;
  userRoles: any = [];
  currentRole: string;
  currentTc: string;

  notifications: any = [];
  doctors: any;
  currentDoctor: string;

  title: string;

  chats: any = [];
  message: any;
  subscription: Subscription;
  ticks = 0;

  secretaryTc: string = "";
  doctorTc: string = "";


  constructor(private accountService: AccountService,
    private questionService: QuestionService,
    private secretaryService: SecretaryService, 
    private chatService: ChatService,
    private toastr: ToastrService,
    private notificationService: NotificationService, 
    private messageService: MessageService,
    private router: Router) { 
      
  }


  ngOnInit(): void {    
    var timer = Observable.timer(500,500);
    this.subscription = timer.subscribe(t => this.tickerFunc(t));  

    this.configure();
    this.secretaryControl();
    this.getMyNotifications();
    this.getUserRoles();
    this.getDoctors();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public configure(): void {
    this.currentRole = sessionStorage.getItem('currentRole');
    if (this.currentRole == 'admin') {
      this.title = "Admin";
    } else if (this.currentRole == 'doktor') {
      this.title = "Doktor";
    } else if (this.currentRole == 'lab') {
      this.title = "Lab";   
    } else if (this.currentRole == 'sekreter') {
      this.title = "Sekreter";
    }

    this.currentTc = sessionStorage.getItem('tc');
    this.nameSurname = sessionStorage.getItem("nameSurname");
    this.email = sessionStorage.getItem("email");
    this.photo = sessionStorage.getItem("photo");
    this.currentDoctor = sessionStorage.getItem('currentDoctorInfo');    
  }

  public tickerFunc(tick): void {
    this.ticks = tick
    if(this.currentRole == "doktor") {
      if(this.secretaryTc != '') {
        this.getDoctorChats();
      }
    }

    else if(this.currentRole == "sekreter") {
      if(this.doctorTc != '') {
        this.getSecreterChat();
      }
    }
  } 

  public getMyNotifications(): void {
    this.notificationService.getMyNotifications(0,1000).subscribe(data => {
      if(data.returncode == 0) {
        for(let notification of data.notificationlist) {
          var date = moment(notification.date);
          date.locale('tr');
          notification.date = moment(date).fromNow();       
        };

        this.notifications = data.notificationlist;
      }
    });
  }

  public getUserRoles(): void {
    this.accountService.getMe().subscribe(data => {
      if(data.returncode == 0) {
        for(let role of data.userinfo[0].roles) {
          if(role.rolenames != "hasta") {
            this.userRoles.push(role);
          }
        }
      }
    });
  }

  public changeRole(currentRole): void {
    this.accountService.switchRole(currentRole).subscribe(data => {
      if(data.returncode == 0) {
        sessionStorage.setItem('currentRole', currentRole);
        if (currentRole == 'admin') {
          sessionStorage.setItem('color', 'skin-red'); 
          sessionStorage.setItem('boxColor', 'box-danger');           
          this.router.navigateByUrl("main/users");                 
        } if (currentRole == 'doktor') {
          sessionStorage.setItem('color', 'skin-blue'); 
          sessionStorage.setItem('boxColor', 'box-primary');                             
          this.router.navigateByUrl("main/patients");
        } if (currentRole == 'sekreter') {
          sessionStorage.setItem('color', 'skin-green'); 
          sessionStorage.setItem('boxColor', 'box-success');                                               
          this.router.navigateByUrl("main/patients");  
        } if (currentRole == 'lab') {
          sessionStorage.setItem('color', 'skin-yellow');
          sessionStorage.setItem('boxColor', 'box-warning');                              
          this.router.navigateByUrl("main/labrequests");
        }      
        window.location.reload();
      }
    });
  }

  public async logout() {
    this.accountService.logout().subscribe(data => {
      if(data.returncode == 0) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('nameSurname');
        sessionStorage.removeItem('tc');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('photo');
        sessionStorage.removeItem('currentRole');
        sessionStorage.removeItem('color');      
        sessionStorage.removeItem('boxColor'); 
        sessionStorage.removeItem('currentDoctorTc');      
        sessionStorage.removeItem('currentDoctorInfo'); 

        this.router.navigateByUrl("login");
      }
    });
  }

  public async cikis() {
    const result = await swal({
    title: '',
    text: "Çıkış yapmak istediğinize emin misiniz?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        await this.logout();
      } catch (err){
      }
    }
  }


  //Secretary Operations
  public getDoctors(): void {
    var currentRole = sessionStorage.getItem('currentRole');
    if(currentRole == "sekreter") {
      var sekretertc = sessionStorage.getItem('tc');
      this.secretaryService.getDoctors(sekretertc).subscribe(data => {
        if(data.returncode == 0) {
          this.doctors = data.doktorsekreter;
            
          let existTC = sessionStorage.getItem('currentDoctorTc');
          if(existTC != '') {
            this.doctorTc = existTC;
          } else {
            this.doctorTc = data.doktorsekreter[0].doktortc;    
          }
        }
      });
    }
  }

  public selectDoctor(doctor): void {
    this.secretaryService.changeDoctor(doctor.doktortc).subscribe(data => {
      if(data.returncode == 0) {
        sessionStorage.setItem('currentDoctorTc', doctor.doktortc);
        sessionStorage.setItem('currentDoctorInfo', doctor.doktor);
        this.currentDoctor = doctor.doktor;
        this.doctorTc = doctor.doktortc;

        window.location.reload();
      }
    });
  }


  //Chats
  public getDoctorChats(): void {
    this.chatService.getChats(this.currentTc, this.secretaryTc).subscribe(data => {
      if(data.returncode == 0) {
        for(let message of data.notificationlist) {
          var date = moment(message.date);
          date.locale('tr');
          message.date = moment(date).format('LLL');
        }

        this.chats = data.notificationlist.reverse();
        $('#chatList').scrollTop(100000);
      }
    });
  }

  public getSecreterChat(): void {
    console.log(this.doctorTc);
    this.chatService.getChats(this.currentTc, this.doctorTc).subscribe(data => {
      if(data.returncode == 0) {
        for(let message of data.notificationlist) {
          var date = moment(message.date);
          date.locale('tr');
          message.date = moment(date).format('LLL');
        }

        this.chats = data.notificationlist.reverse();
        $('#chatList').scrollTop(100000);
      }
    });
  }

  public sendMessage(): void {
    if (!this.message.trim()) {
      return;
    }

    if(this.currentRole == 'doktor') {
      this.chatService.sendMessage(this.message, this.currentTc, this.secretaryTc).subscribe(data => {
        if(data.returncode == 0) {
          this.message = '';
          $('#chatList').scrollTop(100000);
          this.getDoctorChats();
        }
      });
    } else if(this.currentRole == 'sekreter') {
      this.chatService.sendMessage(this.message, this.currentTc, this.doctorTc).subscribe(data => {
        if(data.returncode == 0) {
          this.message = '';
          $('#chatList').scrollTop(100000);
          this.getSecreterChat();
        }
      });
    }
  }

  public secretaryControl(): void {
    this.secretaryService.getSecretary(this.currentTc).subscribe(data => {
      if(data.returncode == 0) {
        this.secretaryTc = data.doktorsekreter[0].sekretertc;
        this.getDoctorChats();
      } else if(data.returncode == 4) {
        this.toastr.warning('', 'Size bağlı bir sekreter bulunmamaktadır. Şimdi eklemek için; Ayarlar->Sekreter Ekle');
      }
    });
  }

}
