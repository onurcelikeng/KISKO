import { Component, OnInit } from '@angular/core';
import { SecretaryService } from '../../../services/SecretaryService/secretary.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../services/UserService/user.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-mysecretary',
  templateUrl: './mysecretary.component.html',
  styleUrls: ['./mysecretary.component.css'],
  providers: [SecretaryService, UserService]
})
export class MysecretaryComponent implements OnInit, OnDestroy {
  boxColor: string;
  doctortc: string;

  secretaryDtTrigger: Subject<DataTable> = new Subject();  
  secretaryDataTable: DataTable = { headerRow: [], dataRows: [] };

  isSecretaryExist: boolean;

  //Observable Objects
  secretary: {};

  //Credentials
  credentials = {
    sekretertc: '',
    doktortc: ''
  };

  
  constructor(private secretaryService: SecretaryService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService) { 

  }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getSecretary();
  }

  ngOnDestroy() {

  }

  public configure():void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.doctortc = sessionStorage.getItem('tc');

    this.isSecretaryExist = false;
  }


  public getSecretary(): void {
    this.secretaryService.getSecretary(this.doctortc).subscribe(data => {
      if(data.returncode == 0) {
        this.isSecretaryExist = true;
        let secretarytc = data.doktorsekreter[0].sekretertc;
        this.credentials.sekretertc = secretarytc;
        this.getSecretaryInfo(secretarytc);
      } else {
        this.isSecretaryExist = false;
      }
    });
  }

  public getSecretaryInfo(secretarytc) {
    this.userService.getUser(secretarytc).subscribe(data => {
      if(data.returncode == 0) {
        var date = moment(data.userinfo[0].birthdate);
        date.locale('tr');
        data.userinfo[0].birthdate = 

        this.secretary = Observable.of({
          tckimlik: data.userinfo[0].tckimlik,
          nameSurname: data.userinfo[0].name + " " + data.userinfo[0].surname,
          photo: data.userinfo[0].photourl,
          email: data.userinfo[0].email,
          birthplace: data.userinfo[0].birthplace,
          birthdate: moment(date).format('LL'),
          gender: data.userinfo[0].gender,
          address: data.userinfo[0].address,
          city: data.userinfo[0].city,
          country: data.userinfo[0].country,
          cellphone: data.userinfo[0].cellphone,
          homephone: data.userinfo[0].homephone,
          meslek: data.userinfo[0].meslek
        }).delay(100);
      }
    });
  }

  public addSecreter(): void {
    this.credentials.doktortc = this.doctortc;

    this.secretaryService.addSecretary(this.credentials).subscribe(data => {
      if(data.returncode == 0) {
        this.getSecretary();  
        window.location.reload();  
      } else if(data.returncode == 4) {
        this.isSecretaryExist = false;
        this.toastr.warning('', data.message);
      }
    });
  }

  public deleteSecretary(): void {
    this.credentials.doktortc = this.doctortc;

    this.secretaryService.deleteSecretary(this.credentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getSecretary();
        window.location.reload();
      } else if(data.returncode == 4) {
        this.isSecretaryExist = true;
        this.toastr.warning('', data.message);
      }
    })
  }


  //Navigations
  public closeModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

  public async deleteRequest() {
    const result = await swal({
    title: '',
    text: "Sekreterinizi silmek istediğinize emin misiniz?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        this.deleteSecretary();
      } catch (err){
      }
    }
  }

}
