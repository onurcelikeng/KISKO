import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { AccountService } from '../../../services/AccountService/account.service';
import { LoginModel } from '../../../models/LoginModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AccountService]
})
export class LoginComponent implements OnInit {
  loginCredentials: LoginModel = { 
    tckimlik: '',
    password: '',
    deviceid: '561d40bcb3478ab4', 
    playerid: '',
    logintype: 'web'
  };


  constructor(private accountService: AccountService,
    private toastr: ToastrService, 
    private router: Router,
    private fb: FormBuilder) { 
  }
  
  
  ngOnInit() {
  }

  public login(): void {
    if(this.loginCredentials.tckimlik == "" || this.loginCredentials.password == "") {
      this.toastr.warning('', "Lütfen bilgilerinizi girdiğinizden emin olunuz.");      
    } else {
      this.loginCredentials.playerid = sessionStorage.getItem('OneSignalUserId');
      this.accountService.login(this.loginCredentials).subscribe(data => {
        if (data) { 
          if(data.returncode == 0) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("tc", this.loginCredentials.tckimlik);

            this.accountService.getMe().subscribe(user => {
              if(user) {
                sessionStorage.setItem("nameSurname", user.userinfo[0].name + " " + user.userinfo[0].surname);
                sessionStorage.setItem("email", user.userinfo[0].email);
                sessionStorage.setItem('currentRole', data.lastrole);
                if(user.userinfo[0].lastdoctor != false) {
                  sessionStorage.setItem('currentDoctorTc', user.userinfo[0].lastdoctor[0].doktortc);
                  sessionStorage.setItem('currentDoctorInfo', user.userinfo[0].lastdoctor[0].doktorbilgi);
                }

                if(user.userinfo[0].photourl != null) {
                  sessionStorage.setItem("photo", user.userinfo[0].photourl);                  
                } else {
                  sessionStorage.setItem("photo", "http://i.sozcu.com.tr/wp-content/uploads/2016/09/mustafa-kemal-ataturk.jpg");                  
                }

                var currentRole = sessionStorage.getItem('currentRole');
                this.router.navigated = false;
                
                if (currentRole == 'admin') {
                  sessionStorage.setItem('color', 'skin-red');
                  sessionStorage.setItem('boxColor', 'box-danger');
                  this.router.navigateByUrl("main/users");
                } if (currentRole == 'doktor') {
                  sessionStorage.setItem('color', 'skin-blue');
                  sessionStorage.setItem('boxColor', 'box-primary');
                  this.router.navigateByUrl("main/patient");
                } if (currentRole == 'sekreter') {
                  sessionStorage.setItem('color', 'skin-green');  
                  sessionStorage.setItem('boxColor', 'box-success');                                     
                  this.router.navigateByUrl("main/patient");  
                } if (currentRole == 'lab') {
                  sessionStorage.setItem('color', 'skin-yellow');  
                  sessionStorage.setItem('boxColor', 'box-warning');                    
                  this.router.navigateByUrl("main/labrequests");
                }
              }
            });
          } else if (data.returncode == 3) {
            this.toastr.warning('', data.message);
          } else if(data.returncode == 4) {
            this.toastr.warning('', data.message);
          } else {
            this.toastr.error('', "Bilinmedik bir hata oluştu.");
          }
        }
      },
      error => {
        console.log(error);
      });
    }
  }

  public gotoForgotPage(): void {
    this.router.navigated = false;
    this.router.navigateByUrl("forgot");
  }

}
