import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/UserService/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [UserService]
})
export class ChangepasswordComponent implements OnInit {
  boxColor: string;
  currenttc: string;

  credentials = {
    tc: sessionStorage.getItem('tc'),
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
  };

  constructor(private userService: UserService,
    private toastr: ToastrService) { }


  ngOnInit() {
    this.configure();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currenttc = sessionStorage.getItem('tc');
  }

  public changePassword(): void {
    if(this.credentials.oldPassword == '' || this.credentials.newPassword == '' || this.credentials.newPassword2 == '') {
      this.toastr.error('', 'Eksiksiz bilgi giriniz.');
    } else {
      if(this.credentials.newPassword != this.credentials.newPassword2) {
        this.toastr.error('', 'Yeni şifrenizi doğru giriniz.');
      } else {
        this.userService.changePassword(this.credentials).subscribe(data => {
          if(data.returncode == 0) {
            this.toastr.success('', data.message);
            this.disposeCredentials();
          } else {
            this.toastr.warning('', data.message);
          }
        })
      } 
    }
  }

  public disposeCredentials(): void {
    this.credentials = {
      tc: sessionStorage.getItem('tc'),
      oldPassword: '',
      newPassword: '',
      newPassword2: ''
    };
  }

}
