import { Component, OnInit, ElementRef } from '@angular/core';
import { AppointmentService } from '../../../services/AppointmentService/appointment.service';
import { Subject } from 'rxjs';
import { Base } from '../../base/Base';
import { UserService } from '../../../services/UserService/user.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';

declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  providers: [UserService]
})
export class ProfilesComponent implements OnInit {
  boxColor: string;
  currenttc: string;
  userPhoto: File;

  //Observable Objects
  user: {};
  
  credentials = {
    tckimlik: '',
    name: '',
    surname: '',
    email: '',
    birthdate: '',
    birthplace: '',
    country: '',
    city: '',
    address: '',
    cellphone: '',
    homephone: '',
    gender: '',
    meslek: ''
  };

  isAdmin: boolean;
  isDoctor: boolean;
  isSecretary: boolean;
  isLab: boolean;

  //Options
  genders = ["Erkek", "Kadın"];
  

  constructor(private userService: UserService,
    private element: ElementRef,
    private toastr: ToastrService) {
  }


  ngOnInit() {
    this.configure();
    this.getUserInfo();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currenttc = sessionStorage.getItem('tc');

    this.isAdmin = false;
    this.isDoctor = false;
    this.isSecretary = false;
    this.isLab = false;
  }

  public getUserInfo(): void {
    this.userService.getUser(this.currenttc).subscribe(data => {
      if(data.returncode == 0) {
        this.user = Observable.of({
          address: data.userinfo[0].address,
          birthdate: data.userinfo[0].birthdate,
          birthplace: data.userinfo[0].birthplace,
          cellphone: data.userinfo[0].cellphone,
          city: data.userinfo[0].city,
          country: data.userinfo[0].country,
          email: data.userinfo[0].email,
          gender: data.userinfo[0].gender,
          homephone: data.userinfo[0].homephone,
          meslek: data.userinfo[0].meslek,
          name: data.userinfo[0].name,
          photourl: data.userinfo[0].photourl,
          registerdate: data.userinfo[0].registerdate,
          surname: data.userinfo[0].surname,
          tckimlik: data.userinfo[0].tckimlik
        }).delay(100);

        this.credentials = {
          tckimlik: this.currenttc,
          name: data.userinfo[0].name,
          surname: data.userinfo[0].surname,
          email: data.userinfo[0].email,
          birthdate: data.userinfo[0].birthdate,
          birthplace: data.userinfo[0].birthplace,
          country: data.userinfo[0].country,
          city: data.userinfo[0].city,
          address: data.userinfo[0].address,
          cellphone: data.userinfo[0].cellphone,
          homephone: data.userinfo[0].homephone,
          gender: data.userinfo[0].gender,
          meslek: data.userinfo[0].meslek
        };

        for(var role of data.userinfo[0].roles) {
          if(role.rolenames == 'admin') {
            this.isAdmin = true;
          } if(role.rolenames == 'doktor') {
            this.isDoctor = true;
          } if(role.rolenames == 'sekreter') {
            this.isSecretary = true;
          } if(role.rolenames == 'lab') {
            this.isLab = true;
          }
        }
      }
    })
  }
  
  public updateUser(): void {
    this.userService.updateUser(this.credentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.uploadPhoto();
      } else {
        this.toastr.warning('', data.message);
      }
    })
  }

  public fileChange(event): void {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.userPhoto = file;
      var image = this.element.nativeElement.querySelector('#preview img');
      image.file = file;
      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result;}; })(image);
      reader.readAsDataURL(file);
    }
  }

  public uploadPhoto(): void {
    this.userService.uploadUserPhoto(this.userPhoto, this.currenttc).subscribe(data => {
      this.getUserInfo();
    })
  }

}
