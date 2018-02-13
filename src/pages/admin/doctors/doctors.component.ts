import { Component, OnInit, ElementRef } from '@angular/core';
import { DoctorService } from './../../../services/DoctorService/doctor.service';
import { Subject } from 'rxjs';
import { DoctorModel } from '../../../models/DoctorModel';
import { SearchModel } from '../../../models/SearchModel';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { SendNotificationModel } from '../../../models/SendNotificationModel';
import { NotificationService } from '../../../services/NotificationService/notification.service';
import { IMyDpOptions } from 'mydatepicker';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  providers: [DoctorService, NotificationService]
})
export class DoctorsComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [ 'Doktor Adı' ],
    footerRow: [],
    dataRows: []
  };

  public sendNotificationCredentials: SendNotificationModel = { 
    tckimlik: sessionStorage.getItem("tc"), 
    othertckimlik: '', 
    title: '', 
    message: '',
    typeid: '1',
    header: '',
    messageType: ''
  };
  
  updateCredentials: DoctorModel = {
    tc: '',
    name: '',
    surname: '',
    website: '',
    email: '',
    aciklama: '',
    bransid: '',
    diplomabelgeid: '',
    kurumid: '',
    mezuniyetkurumu: '',
    mezuniyettarihi: '',
    uzmanlikkurumu: '',
    uzmanliktarihi: '',
    gender: '',
    fotourl: '',
    tel1: '',
    tel2: '',
    tel3: ''
  };

  addCredentials: DoctorModel = {
    tc: '',
    name: '',
    surname: '',
    website: '',
    email: '',
    aciklama: '',
    bransid: '',
    diplomabelgeid: '',
    kurumid: '',
    mezuniyetkurumu: '',
    mezuniyettarihi: '',
    uzmanlikkurumu: '',
    uzmanliktarihi: '',
    gender: '',
    fotourl: '',
    tel1: '',
    tel2: '',
    tel3: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  public datePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Bugün',
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    showClearDateBtn: true,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true,
    sunHighlight: true,
    inline: false
  };

  doctor: {};
  doctorPhoto: File;
  boxColor: String;
  addSelected: boolean;
  updateSelected: boolean;
  isEditing: boolean;
  userTC: string;  
  selectedValues: Array<String> = [];
  selectedObjects = [];
  isSelected = [];
  isAllSelected: boolean = false;
  messageTypeArray = ["SMS", "Bildirim", "Eposta"];
  messageType: string = "SMS";
  selectedRow : Number;
  setClickedRow : Function;

  public uzmanlikTarihiUpdate: any;
  public mezuniyetTarihiUpdate: any;  


  constructor(private doctorService: DoctorService,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private router: Router,
    private element: ElementRef) { 
      this.setClickedRow = function(index){
        this.selectedRow = index;
      }
  }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'admin') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getDoctors();
  }

  configure() {
    this.dtOptions = {
      bLengthChange:false,
      searching:false,
      header:false,
      info:false,
      infoEmpty:false,
      pageLength:25,
      sort:false,
      paginate:false
    };

    this.boxColor = sessionStorage.getItem('boxColor');
    this.addSelected = false;
    this.updateSelected = false;
    this.isEditing = false;
  }

  reloadData() {
    this.doctorService.getDoctors().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.doktor
        this.dtTrigger.repeat();
      }
    });
  }

  change(e, type, index){
    if(e.target.checked){
      this.selectedValues[index] = type.doktortc;
      this.selectedObjects[index] = {
        doktortc: type.doktortc,
        name: type.name,
        surname: type.surname
      };
      this.isSelected[index] = true;
    }
    else{
      this.isAllSelected = false;
      this.selectedValues[index] = "";
      this.selectedObjects[index] = {
        doktortc: "",
        name: "",
        surname: ""
      };
      this.isSelected[index] = false;
      this.sendNotificationCredentials.othertckimlik = "";
    }
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.doctorPhoto = file;
      var image = this.element.nativeElement.querySelector('#preview img');
      image.file = file;
      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result;}; })(image);
      reader.readAsDataURL(file);
    }
  }

  findIndexToUpdate(type) { 
    return type === this;
  }

  selectAll(event) {
    this.selectedValues = [];
    this.selectedObjects = [];
    this.sendNotificationCredentials.header = "";
    this.dataTable.dataRows.forEach(row => {
      if(event.target.checked) {
        this.selectedValues.push(row.doktortc);
        this.selectedObjects.push({
          doktortc: row.doktortc,
          name: row.name,
          surname: row.surname
        });
        this.isSelected.push(true);
        this.isAllSelected = true;
      } else if(!event.target.checked) {
        this.isSelected.push(false);
        this.selectedValues = [];
        this.selectedObjects = [];
        this.isAllSelected = false;
      }
    });
  }

  getDoctors() {
    this.doctorService.getDoctors().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.doktor;
        this.dtTrigger.repeat();
      }
    });
  }

  getDoctor(id) {
    this.emptyAddCredentials();

    this.doctorService.getDoctor(id).subscribe(data => {
      if(data) {
        this.updateCredentials.tc = data.doktor[0].doktortc; 
        this.updateCredentials.name = data.doktor[0].name; 
        this.updateCredentials.surname = data.doktor[0].surname; 
        this.updateCredentials.email = data.doktor[0].eposta; 
        this.updateCredentials.website = data.doktor[0].website; 
        this.updateCredentials.uzmanlikkurumu = data.doktor[0].uzmanlikkurumu; 
        this.updateCredentials.mezuniyetkurumu = data.doktor[0].mezuniyetkurumu; 
        this.updateCredentials.aciklama = data.doktor[0].aciklama; 
        this.updateCredentials.uzmanliktarihi = data.doktor[0].uzmanliktarihi; 
        this.updateCredentials.mezuniyettarihi = data.doktor[0].mezuniyettarihi; 
        this.updateCredentials.diplomabelgeid = data.doktor[0].diplomabelgeid; 
        this.updateCredentials.bransid = data.doktor[0].bransid; 
        this.updateCredentials.kurumid = data.doktor[0].kurumid;
        this.updateCredentials.gender = data.doktor[0].gender;
        this.updateCredentials.fotourl = data.doktor[0].fotourl;
        this.updateCredentials.tel1 = data.doktor[0].tel1;
        this.updateCredentials.tel2 = data.doktor[0].tel2;
        this.updateCredentials.tel3 = data.doktor[0].tel3;
        this.uzmanlikTarihiUpdate = { date: data.doktor[0].uzmanliktarihi };
        this.mezuniyetTarihiUpdate = { date: data.doktor[0].mezuniyettarihi };
  
        this.doctor = Observable.of({
          tc: data.doktor[0].doktortc,
          name: data.doktor[0].name,
          surname: data.doktor[0].surname,
          email: data.doktor[0].eposta,
          website: data.doktor[0].website,
          uzmanlikkurumu: data.doktor[0].uzmanlikkurumu,
          mezuniyetkurumu: data.doktor[0].mezuniyetkurumu,
          aciklama: data.doktor[0].aciklama,
          uzmanliktarihi: data.doktor[0].uzmanliktarihi,
          mezuniyettarihi: data.doktor[0].mezuniyettarihi,
          diplomabelgeid: data.doktor[0].diplomabelgeid,
          bransid: data.doktor[0].bransid,
          kurumid: data.doktor[0].kurumidi,
          gender: data.doktor[0].gender,
          telephone1: data.doktor[0].tel1,
          telephone2: data.doktor[0].tel2,
          telephone3: data.doktor[0].tel3
        }).delay(100);
      }
    });
  }

  addDoctor() {
    this.doctorService.addDoctor(this.addCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
          this.reloadData();
          this.closeRightPanel();
          this.emptyAddCredentials();   
          this.isEditing = false;
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  emptyAddCredentials() {
    this.addCredentials.tc = ''; 
    this.addCredentials.name = '';
    this.addCredentials.surname = '';
    this.addCredentials.email = '';
    this.addCredentials.website = '';
    this.addCredentials.uzmanlikkurumu = '';
    this.addCredentials.mezuniyetkurumu = '';
    this.addCredentials.aciklama = '';
    this.addCredentials.uzmanliktarihi = '';
    this.addCredentials.mezuniyettarihi = '';
    this.addCredentials.diplomabelgeid = ''; 
    this.addCredentials.bransid = '';
    this.addCredentials.kurumid = '';
    this.addCredentials.gender = '';
  }

  updateDoctor() {
    this.updateCredentials.mezuniyettarihi = this.mezuniyetTarihiUpdate.date;
    this.updateCredentials.uzmanliktarihi = this.uzmanlikTarihiUpdate.date;
    this.doctorService.updateDoctor(this.updateCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          if(data.returncode == 0) {
            this.doctorService.uploadDoctorPhoto(this.doctorPhoto, this.updateCredentials.tc).subscribe(data => {
              if (data) {
                if (data.returncode == 0) {
                  this.toastr.success('', data.message);
                  this.reloadData();
                  this.isEditing = false;
                } else {
                  this.toastr.warning('', data.message);                
                }
              }
            });
          } else {
            this.toastr.warning('', data.message);
            this.dtTrigger.repeat();
          }
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  notificationClick() {
    this.selectedObjects.forEach(element => {
      if(element.tckimlik != "") this.sendNotificationCredentials.header = this.sendNotificationCredentials.header + element.name + " " + element.surname + ", "
    });     
  }

  compareFn(c1: String, c2: String): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  sendNotification() {
    if(this.sendNotificationCredentials.title != "" || this.sendNotificationCredentials.message != "") {
      this.sendNotificationCredentials.othertckimlik = JSON.stringify(this.selectedValues);
      if(this.messageType == "SMS") this.sendNotificationCredentials.messageType = "1";
      else if(this.messageType == "Bildirim") this.sendNotificationCredentials.messageType = "2";
      else if(this.messageType == "Eposta") this.sendNotificationCredentials.messageType = "3";
      this.notificationService.sendNotification(this.sendNotificationCredentials).subscribe(data => {
        if(data) {
          this.toastr.success('', "Bildirim iletildi.");
          this.closeModal('sendNotificationModal');
        } else {
          this.toastr.error('', "Bir hata oluştu.");
          this.closeModal('sendNotificationModal');
        }
      });
    } else {
      this.toastr.warning('', "Lütfen bilgilerinizi girdiğinizden emin olunuz.");      
      this.closeModal('sendNotificationModal');
    }
  }

  getReceiverTC(tckimlik, name, surname) {
    this.sendNotificationCredentials.othertckimlik = tckimlik;
    this.sendNotificationCredentials.header = name + " " + surname;
  }

  async deleteDoctor(name, id) {
    const result = await swal({
      title: '',
      text: name + " adlı doktoru silmek istediğinize emin misiniz?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır'
      })

      if(result) {
        try {
          this.doctorService.deleteDoctor(id).subscribe(data => {
            if (data) {
              if (data.returncode == 0) {
                this.toastr.success('', data.message);
                this.reloadData();
                this.updateSelected = false;
                this.isEditing = false;
              } else {
                this.toastr.error('', data.message);                
              }
            }
          });
        } catch (err){
        }
      }
  }

  search(event) {
    if(event.keyCode == 13) {
      this.doctorService.searchDoctor(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.doktor
          this.dtTrigger.repeat();
        }
      });
    } else {
    }
  }


  //Navigations
  async openEditPanel(id) {
    if(this.isEditing) {
      const result = await swal({
        title: 'Yaptığınız değişiklikler kaybolacak!',
        text: name + "Devam etmek istediğinize emin misiniz?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Evet',
        cancelButtonText: 'Hayır'
        })

        if(result) {
          this.addSelected = false;
          this.updateSelected = true;
          this.isEditing = false;
          this.getDoctor(id);
        }
      } else {
        this.addSelected = false;
        this.updateSelected = true;
        this.getDoctor(id);
      }
  }

  async openAddPanel() {
    if(this.isEditing) {
      const result = await swal({
        title: 'Yaptığınız değişiklikler kaybolacak!',
        text: name + "Devam etmek istediğinize emin misiniz?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Evet',
        cancelButtonText: 'Hayır'
        })

        if(result) {
          this.addSelected = true;
          this.updateSelected = false;
          this.isEditing = false;
        }
      } else {
      this.addSelected = true;
      this.updateSelected = false;
      }
  }

  closeRightPanel() {
    this.updateSelected = false;
    this.addSelected = false;
    this.selectedRow = -1;
  }

  inputOnChange() {
    this.isEditing = true;
  }

  closeModal(param) {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

}
