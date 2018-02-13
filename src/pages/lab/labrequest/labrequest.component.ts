import { element } from 'protractor';
import { LabRequestService } from './../../../services/LabRequestService/lab.service';
import { NotificationService } from './../../../services/NotificationService/notification.service';
import { UserService } from './../../../services/UserService/user.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { IOption } from 'ng-select';
import { Subject } from 'rxjs';
import { SendNotificationModel } from '../../../models/SendNotificationModel';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/delay';
import { ToastrService } from 'ngx-toastr';
import { isNull, isUndefined } from 'util';

declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-labrequest',
  templateUrl: './labrequest.component.html',
  styleUrls: ['./labrequest.component.css'],
  providers: [UserService, NotificationService, LabRequestService]
})

export class LabrequestComponent implements OnInit {
  public dtTrigger: Subject<DataTable> = new Subject();
  public labDataTable: DataTable = {
    headerRow: ['Durum', 'İstek Tarihi', 'Doktor', 'Hasta', 'İstem', 'Sonuç', 'Onaylayan', 'Belge'],
    footerRow: [],
    dataRows: []
  };

  public sendNotificationCredentials: SendNotificationModel = {
    tckimlik: sessionStorage.getItem("tc"),
    othertckimlik: '',
    title: '',
    messageType: '',
    message: '',
    typeid: '1',
    header: ''
  };

  boxColor: String;
  labbelge1: File;
  selectedValues: Array<String> = [];
  selectedObjects = [];
  isSelected = [];
  isAllSelected: boolean = false;
  labistekid: number;
  durum: string;
  aciklama: string;
  hastatc: number;
  doktortc: number;
  onaylayantc: number;
  hastabilgileri: String;
  istembilgileri: String;
  doktorbilgileri: String;



  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private LabRequestService: LabRequestService,
    private toastr: ToastrService,
    private router: Router,
    private element: ElementRef) { }


  ngOnInit() {
    this.configure();
    this.getLabRequestAll();
  }

  configure() {
    this.boxColor = sessionStorage.getItem('boxColor');
  }

  getLabRequestAll() {
    this.LabRequestService.getLabRequestAll().subscribe(data => {
      if (data) {
        this.labDataTable.dataRows = data.labistek;
        this.dtTrigger.repeat();
      }
    });
  }

  labResultFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.labbelge1 = file;
      // var image = this.element.nativeElement.querySelector('#preview img');
      // image.file = file;
      var reader = new FileReader();
      //reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(image);
      reader.readAsDataURL(file);
    }
  }


  changeSelect(event) {
    //console.log(this.durum);
  }

  selectCheckBox(labistekid, doktortc, hastatc) {
    //console.log(param);
    this.labistekid = labistekid;
    this.hastatc = hastatc;
    this.doktortc = doktortc;
  }

  selectAll(event) {
    this.selectedValues = [];
    this.labDataTable.dataRows.forEach(row => {
      if (event.target.checked) {
        this.selectedValues.push(row.labistek);
        this.selectedObjects.push({
          labistek: row.labistekid,
          doktor: row.doktortc,
          hastatc: row.hastatc
        });
        this.isSelected.push(true);
        this.isAllSelected = true;
      } else if (!event.target.checked) {
        this.isSelected.push(false);
        this.selectedValues = [];
        this.selectedObjects = [];
        this.isAllSelected = false;
      }
    });
  }

  closeModalLabRequest() {
    $('#modal-lab').modal('hide');
  }

  sendNotification() {
    if (this.sendNotificationCredentials.title != "" || this.sendNotificationCredentials.message != "") {
      this.notificationService.sendNotification(this.sendNotificationCredentials).subscribe(data => {
        if (data) {
          $('#modal-success').modal('hide');
          this.toastr.success('', "Bildirim iletildi.");
        } else {
          $('#modal-success').modal('hide');
          this.toastr.error('', "Bir hata oluştu.");
        }
      });
    } else {
      $('#modal-success').modal('hide');
      this.toastr.warning('', "Lütfen bilgilerinizi girdiğinizden emin olunuz.");
    }
  }

  updateLabRequestt() {
    var onaylayantc = sessionStorage.getItem("tc");
    if (this.aciklama != "") {
      this.LabRequestService.updateLabRequest(this.labistekid, "2", this.aciklama, onaylayantc).subscribe(data => {
        if (data) {
          if (this.labbelge1 != undefined) {
            this.LabRequestService.uploadLabresults(this.labbelge1, this.hastatc, this.labistekid).subscribe(data => {
              if (data) {
                $('#modal-lab').modal('hide');
                this.toastr.success('', "Güncellendi.");
                this.getLabRequestAll();
              } else {
                $('#modal-lab').modal('hide');
                this.toastr.error('', "Bir hata oluştu.");
              }
            });
          } else {
            $('#modal-lab').modal('hide');
            this.toastr.success('', "Güncellendi.");
            this.getLabRequestAll();
          }
        } else {
          $('#modal-lab').modal('hide');
          this.toastr.error('', "Bir hata oluştu.");
        }
      });
    } else {
      $('#modal-lab').modal('hide');
      this.toastr.warning('', "Lütfen bilgileri girdiğinizden emin olunuz.");
    }
  }

  openModal(labistekid, doktortc, hastatc, hastabilgi, doktorbilgi, istem, istektarih) {
    this.labistekid = labistekid;
    this.hastatc = hastatc;
    this.doktortc = doktortc;
    this.hastabilgileri = hastabilgi;
    this.istembilgileri = istektarih + " " + istem;
    this.doktorbilgileri = doktorbilgi;
    $('#modal-lab').modal('show');
  }

  openModal2(labistekid, doktortc, hastatc, hastabilgi, doktorbilgi, istem, istektarih) {
    $('#modal-lab').modal('show');
  }

  cancelLabRequest() {
    var onaylayantc = sessionStorage.getItem("tc");
    if (this.aciklama != "") {
      this.LabRequestService.updateLabRequest(this.labistekid, "3", this.aciklama, onaylayantc).subscribe(data => {
        if (data) {
          $('#modal-lab').modal('hide');
          this.toastr.success('', "Laboratuvar isteği iptal edildi.");
          this.getLabRequestAll();
        } else {
          $('#modal-lab').modal('hide');
          this.toastr.error('', "Bir hata oluştu.");
        }
      });
    } else {
      $('#modal-lab').modal('hide');
      this.toastr.warning('', "Lütfen bilgileri girdiğinizden emin olunuz.");
    }
  }

}
