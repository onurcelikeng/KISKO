import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { AccountService } from '../../../services/AccountService/account.service';
import { ForgotPasswordModel } from '../../../models/ForgotPasswordModel';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  public forgotPasswordCredentials: ForgotPasswordModel = { 
    tckimlik: ''
  };

  constructor(private accountService: AccountService,
    private toastr: ToastrService, 
    private router: Router) { }
  

  ngOnInit() {
  }

  public forgotPassword():void {
    if(this.forgotPasswordCredentials.tckimlik == "") {
      this.toastr.warning('', "Lütfen bilgilerinizi girdiğinizden emin olunuz.");      
    } else {
      this.accountService.forgotPassword(this.forgotPasswordCredentials).subscribe(data => {
        console.log(data);
      });
    }
  }

}
