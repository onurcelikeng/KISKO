import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { SecretaryService } from '../../../services/SecretaryService/secretary.service';
import { Subject } from 'rxjs';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [SecretaryService]
})
export class SettingsComponent implements OnInit, OnDestroy {
  boxColor: string;
  tc: string;
  photo: string;
  email: string;
  nameSurname: string;

  secretaries: any = [];

  secretaryDtTrigger: Subject<DataTable> = new Subject(); 


  constructor(private secretaryService: SecretaryService) { }


  ngOnInit() {
    this.configure();
    this.getSecretaries();
  }

  ngOnDestroy() {

  }

  public configure():void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.tc = sessionStorage.getItem("tc");
    this.nameSurname = sessionStorage.getItem("nameSurname");
    this.email = sessionStorage.getItem("email");
    this.photo = sessionStorage.getItem("photo");
  }

  //Secretaries
  public getSecretaries(): void {
    this.secretaryService.getSecretary(this.tc).subscribe(data => {
      if(data.returncode == 0) {
        this.secretaries = data.doktorsekreter;
      }
      console.log(data);
    });
  }

}
