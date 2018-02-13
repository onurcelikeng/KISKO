import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IOption } from 'ng-select';
import { Observable } from 'rxjs/Observable';
import { partition } from 'rxjs/operator/partition';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/delay';
import { element } from 'protractor';

//modules
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';

//Services
import { PatientService } from '../../../services/PatientService/patient.service';
import { FieldService } from '../../../services/FieldService/field.service';
import { UserService } from '../../../services/UserService/user.service';
import { HistoryService } from '../../../services/HistoryService/history.service';
import { PlaceService } from '../../../services/PlaceService/place.service';
import { fadeInAnimation } from '../../../helpers/animations/index';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css'],
  animations: [fadeInAnimation],
  providers: [PatientService, FieldService, UserService, HistoryService, PlaceService]
})
export class MedicalComponent implements OnInit, OnDestroy {
  private sub: any;
  boxColor: string;
  patient: string;
  currentDoctor: string;
  searchedValue: string;

  visitDtTrigger: Subject<DataTable> = new Subject();  
  visitDataTable: DataTable = { headerRow: [], dataRows: [] };
  
  labDtTrigger: Subject<DataTable> = new Subject(); 
  labDataTable: DataTable = { headerRow: [], dataRows: [] };

  documentDtTrigger: Subject<DataTable> = new Subject();  
  documentDataTable: DataTable = { headerRow: [], dataRows: [] };

  fieldDtTrigger: Subject<DataTable> = new Subject(); 
  fieldDataTable: DataTable = { headerRow: [], dataRows: [] };

  historyDtTrigger: Subject<DataTable> = new Subject();  
  historyDataTable: DataTable = { headerRow: [], dataRows: [] };

  olcumDtTrigger: Subject<DataTable> = new Subject(); 
  olcumDataTable: DataTable = { headerRow: [], dataRows: [] };

  patientsMedicalIds = new Array();

  //Controls
  isCurrentDoctorsVisit: boolean;
  isMedicalDetailSelected: boolean;
  isMedicalAddSelected: boolean;
  isCurrentDoctorsMedical: boolean;
  isFollowOlcumSelected: boolean;
  isSahaDetailSelected: boolean;
  isProgressBar: boolean;
  isPatientExist: boolean;

  //DateTime Pickers
  public medicalDate: any;
  public medicalControlDate: any;
  public olcumDate: any;

  //Credentials
  medicalCredentials = {
    muayeneid: '',    
    bulgu: '',
    date: '',
    docId: '1',
    doctortc: '',
    hastatc: '',
    oyku: '',
    yakinma: '',
    tani: '',
    muayeneType: '1',
    kontrolnotlari: '',
    kontrolTarihi: '',
    notlar: '',
    sonuc: ''
  };

  labRequestredentials = {
    kurumid: '',
    muayeneid: '',
    istektipi: '1',
    aciklama: '',
    doktortc: '',
    hastatc: ''
  };

  documentCredentials = {
    belgeid: '',
    islemid: '',
    islemtipi: '',
    belgetipi: ''
  };

  medicalFieldCredentials = {
    doktorsahaveriid: '',
    muayeneid: '',
    doktortc: '',
    sahaid: '',
    deger1: ''
  };

  historyCredentials = {
    gecmisid: '',
    hastatc: '',
    ekleyentc: '',
    ozgecmis: '',
    soygecmis: '',
  };

  patientCredentials = {
    tckimlik: '',
    name: '',
    surname: '',
    email: '',
    birthdate: '',
    birthplace: '',
    address: '',
    cellphone: '',
    homephone: '',
    gender: '',
    city: '',
    country: '',
    job: ''
  };

  patientFieldCredentials = {
    hastatc: '',
    name: '',
    type: '',
    size: '',
    unit: ''
  };

  followOlcumCredentials = {
    hastatc: '',
    sahaid: '',
    sure: '',
    suretipi: '',
    etkilesimtipiid: '',
    kucukse: '',
    buyukse: ''
  };

  patientOlcumCredentials = {
    sahaid: '',
    deger1: '',
    deger2: '',
    deger3: '',
    deger4: '',
    degers: '',
    ekleyentc: '',
    hastatc: '',
    olcumzamani: ''
  };

  //Options
  genders = ["Erkek", "Kadın"];
  fieldTypes = ["Metin", "Sayı", "Tarih"];
  sizes = ["1", "2", "3", "4"];
  places = [];
  periodTypes = ["Dakika", "Saat", "Gün"];
  periodType: string = "Dakika";
  timeTypes = ["Anlık", "Periyodik", "Filtre"];
  timeType: string = "Anlık";

  calendarSettings = {
		bigBanner: true,
		timePicker: true,
		format: 'dd-MM-yyyy hh:mm',
    defaultOpen: false,
    closeOnSelect: true
  }

  //Observable Objects
  user: {};
  history: {};
  medical: {};

  //Arrays
  fields: any = [];
  documentFiles: File;

  //Table Item Click
  selectedRow : Number;
  setClickedRow : Function;
  

  constructor(private patientService: PatientService,
    private fieldService: FieldService,
    private userService: UserService,
    private toastr: ToastrService,
    private historyService: HistoryService,
    private placeService: PlaceService,
    private route: ActivatedRoute,
    private router: Router,
    private element: ElementRef) {
      this.setClickedRow = function(index){
        this.selectedRow = index;
        this.isSahaDetailSelected = false;
      }
  }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor' && role != 'sekreter') {
      this.router.navigate(['main/error']);
      return;
    }
    
    let currentRole = sessionStorage.getItem('currentRole');
    if (currentRole == 'doktor') {
      this.currentDoctor = sessionStorage.getItem('tc');
    } else if (currentRole == 'sekreter') {
      this.currentDoctor = sessionStorage.getItem('currentDoctorTc');
    }

    this.patient = sessionStorage.getItem('patient');
    if(this.patient != '' && this.patient != null) {
      this.isPatientExist = true;
      this.configure();
      this.getPatientVisits();
      this.getPatientDetail();
      this.getPatientHistory();
      this.getPatientField();
      this.getPlaces();
    } else {
      this.isPatientExist = false;
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem('patient', '');
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.selectedRow = 0;
    this.isCurrentDoctorsVisit = false;
    this.isMedicalDetailSelected = true;
    this.isMedicalAddSelected = false;
    this.isCurrentDoctorsMedical = false;
    this.isFollowOlcumSelected = false;
    this.isSahaDetailSelected = false;
    this.isProgressBar = false;

    this.patientFieldCredentials.type = this.fieldTypes[0];
    this.patientFieldCredentials.size = this.sizes[0];
  }

  public searchPatient(): void {
    this.patientService.searchPatient(this.currentDoctor, this.searchedValue).subscribe(data => {
      console.log(data);
      if(data.returncode == 0) {
        sessionStorage.setItem('patient', this.searchedValue);
        this.toastr.success('', data.message);
        this.ngOnInit();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }
  

  //Visit Funcs.
  public getPatientVisits(): void {
    this.patientService.getPatientVisits(this.patient, this.isCurrentDoctorsVisit, this.muayeneVisitPageIndex, this.muayeneVisitPageLength).subscribe(data => {
      if(data.returncode == 0) {
        this.patientsMedicalIds = new Array();
        for(var value of data.vizit) {
          if(value.islemtipi == 2) {
            this.patientsMedicalIds.push(value.muayeneid);
          }
          var date = moment(value.tarih).locale('tr');
          value.tarih = moment(date).format('LL');
        }
        this.muayeneVisitLength = data.vizit.length;
        this.visitDataTable.dataRows = data.vizit;
        this.visitDtTrigger.repeat();  

        this.getPatientVisitDetail(data.vizit[0].muayeneid);
      }
    });
  }

  public getPatientVisitDetail(muayeneId): void {
    this.isMedicalDetailSelected = true;
    this.isMedicalAddSelected = false;

    this.patientService.getMuayeneDetail(muayeneId).subscribe(data => {
      if(data.returncode == 0) {
        this.medical = Observable.of({
          muayeneid: data.muayene[0].muayeneid,
          oyku: data.muayene[0].oyku,
          yakinma: data.muayene[0].yakinma,
          bulgu: data.muayene[0].bulgular,
          tani: data.muayene[0].tani,
          sonuc: data.muayene[0].sonuc,
          kontrolnotlari: data.muayene[0].kontrol,
          notlar: data.muayene[0].aciklama,
          doktortc: data.muayene[0].dokortc,
          doktorbilgi: data.muayene[0].doktorbilgi,
        }).delay(100);

        this.medicalDate = moment(data.muayene[0].tarih).format();
        this.medicalControlDate = moment(data.muayene[0].kontroltarihi).format();

        this.medicalCredentials.muayeneid = data.muayene[0].muayeneid;
        this.medicalCredentials.bulgu = data.muayene[0].bulgular;
        this.medicalCredentials.date = data.muayene[0].tarih;
        this.medicalCredentials.notlar = data.muayene[0].aciklama;
        this.medicalCredentials.docId = data.muayene[0].belgeid;
        this.medicalCredentials.doctortc = data.muayene[0].doktortc;
        this.medicalCredentials.hastatc = data.muayene[0].hastatc;
        this.medicalCredentials.oyku = data.muayene[0].oyku;
        this.medicalCredentials.tani = data.muayene[0].tani;
        this.medicalCredentials.yakinma = data.muayene[0].yakinma;
        this.medicalCredentials.muayeneType = data.muayene[0].muayenetipi;
        this.medicalCredentials.sonuc = data.muayene[0].sonuc;
        this.medicalCredentials.kontrolnotlari = data.muayene[0].kontrol;
        this.medicalCredentials.kontrolTarihi = data.muayene[0].kontroltarihi;
        this.medicalCredentials.notlar = data.muayene[0].aciklama;

        if(data.muayene[0].doktortc == this.currentDoctor) {
          this.isCurrentDoctorsMedical = true;
        } else {
          this.isCurrentDoctorsMedical = false;
        }

        this.getMedicalFields(muayeneId);
        this.getLabRequests();
        this.getDocuments();
      }
    });
  }

  public filterPatientVisitByDoctor(param) {
    this.isCurrentDoctorsVisit = param;
    this.getPatientVisits();
  }


  //Muayene
  public createEmptyMuayene(): void {
    let credentials = {
      muayeneid: '',    
      bulgu: '',
      date: moment(new Date()).format('YYYY-MM-DD hh:mm'),
      docId: '1',
      doctortc: this.currentDoctor,
      hastatc: this.patient.toString(),
      oyku: '',
      yakinma: '',
      tani: '',
      muayeneType: '1',
      kontrolnotlari: '',
      kontrolTarihi: moment(new Date()).format('YYYY-MM-DD hh:mm'),
      notlar: '',
      sonuc: ''
    };

    this.patientService.addMuayene(credentials).subscribe(data => {
      if(data.returncode == 0){
        this.toastr.success('', data.message);
        this.getPatientVisits();
        this.selectedRow = 0;
        this.getPatientVisitDetail(data.muayeneid);
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public addMuayene(): void {
    this.medicalCredentials.hastatc = this.patient.toString();
    this.medicalCredentials.doctortc = this.currentDoctor;

    this.medicalCredentials.date = moment(this.medicalDate).format('YYYY-MM-DD hh:mm');
    this.medicalCredentials.kontrolTarihi = moment(this.medicalControlDate).format('YYYY-MM-DD hh:mm');
    
    this.patientService.addMuayene(this.medicalCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.medicalFieldCredentials.muayeneid = data.muayeneid;
        for(let field of this.fields) {
          this.medicalFieldCredentials.doktortc = this.currentDoctor;
            this.medicalFieldCredentials.sahaid = field.doktorsahaid;
            this.medicalFieldCredentials.deger1 = field.deger1;
            this.fieldService.addFieldData(this.medicalFieldCredentials).subscribe(data => {
              if(data) {
                if(data.returncode == 0) {
                  console.log("done");
                } else {
                  console.log("not done");
                }
              }
            });
        }

        this.toastr.success('', data.message);

        this.getPatientVisits();
        this.disposeMedicalCredentials();
        this.isMedicalAddSelected = false;   
        this.getPatientVisitDetail(data.muayeneId);
        this.selectedRow = 0;
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public updateMuayene(): void {
    this.medicalCredentials.date = moment(this.medicalDate).format('YYYY-MM-DD hh:mm');
    this.medicalCredentials.kontrolTarihi = moment(this.medicalControlDate).format('YYYY-MM-DD hh:mm');
    
    this.patientService.updateMuayene(this.medicalCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.medicalFieldCredentials.muayeneid = this.medicalCredentials.muayeneid;
        for(let field of this.fields) {
          this.medicalFieldCredentials.doktorsahaveriid = field.doktorsahaveriid;
          this.medicalFieldCredentials.doktortc = this.medicalCredentials.doctortc;
          this.medicalFieldCredentials.sahaid = field.sahaid;
          this.medicalFieldCredentials.deger1 = field.deger1;
          
          this.fieldService.updateFieldData(this.medicalFieldCredentials).subscribe(data => {
            if(data.returncode == 0) {
              console.log('done');
            } else {  
              console.log('not done!');
            }
          });
        }
      }

      this.getPatientVisits();
    });
  }

  public async deleteMuayene() {
    this.patientService.deleteMuayene(this.medicalCredentials.muayeneid).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
          this.disposeMedicalCredentials();
          this.getPatientVisits();  
        } else {
          this.toastr.warning('', data.message);
        }   
      }
    });
  }

  public getLabRequests(): void {
    this.patientService.getLabRequests(this.medicalCredentials.muayeneid).subscribe(data => {
      if(data.returncode == 0) {
        for(var value of data.labistek) {
          var date = moment(value.istektarih);
          date.locale('tr');
          value.istektarih = moment(date).format('LL');
        }
        this.labDataTable.dataRows = data.labistek;
        this.labDtTrigger.repeat();
      } else if(data.returncode == 4) {
        this.labDataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public addLabrequest(): void {
    this.labRequestredentials.doktortc = this.currentDoctor;
    this.labRequestredentials.hastatc = this.patient.toString();
    this.labRequestredentials.muayeneid = this.medicalCredentials.muayeneid;
    this.labRequestredentials.istektipi = "1"; //docter added.

    this.patientService.labRequest(this.labRequestredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('labRequestModal');
        this.disposeLabRequestredentials();
        this.getLabRequests();
      } else {
        this.toastr.warning('', data.message);
      }
    });

  }

  public getDocuments(): void {
    let islemtipi = 2;
    this.patientService.getDocuments(this.medicalCredentials.muayeneid, islemtipi).subscribe(data => {
      if(data.returncode == 0) {
        for(var value of data.belge) {
          var date = moment(value.tarih).locale('tr');
          value.tarih = moment(date).format('LL');
        }
        this.documentDataTable.dataRows = data.belge;
      } else if(data.returncode == 4){
        this.documentDataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public fileChange(event): void {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.documentFiles = file;
      var image = this.element.nativeElement.querySelector('#preview img');
      image.file = file;
      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result;}; })(image);
      reader.readAsDataURL(file);
    }
  }

  public uploadDocument(): void {
    if(this.documentFiles == null) {
      this.toastr.warning('', 'Lütfen dosya seçiniz.');
    } else {
      this.isProgressBar = true;

      this.documentCredentials.islemid = this.medicalCredentials.muayeneid;
      this.documentCredentials.islemtipi = "2";
      this.documentCredentials.belgetipi = "1";
  
      this.patientService.uploadDocument(this.documentCredentials, this.documentFiles).subscribe(data => {
        if(data.returncode == 0) {
          
          this.documentFiles = null;
          this.closeModal("documentUploadModal");
          this.toastr.success('', data.message);
          this.getDocuments();
        } else {
          this.toastr.warning('', data.message);
        } 
        this.isProgressBar = false;
      });
    }
  }

  public getPlaces(): void {
    this.placeService.getLabPlaces().subscribe(data => {
      if(data.returncode == 0) {
        this.places = data.kurum;
      }
    })
  }


  //History Funcs.
  public getPatientHistory(): void {
    this.historyService.getResume(this.patient).subscribe(data => {
      if(data.returncode == 0) {
        for(let history of data.gecmis) {
          var date = moment(history.eklemetarihi);
          date.locale('tr');
          history.eklemetarihi = moment(date).format('LL');
        }
        this.historyDataTable.dataRows = data.gecmis;
        this.historyDtTrigger.repeat();
      } else if(data.returncode == 4) {
        this.historyDataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public getPatientHistoryDetail(id): void {
    this.historyService.getHistory(id).subscribe(data => {
      if(data.returncode == 0) {
        var date = moment(data.gecmis[0].eklemetarihi).locale('tr');

        this.history = Observable.of({
          ozgecmis: data.gecmis[0].ozgecmis,
          soygecmis: data.gecmis[0].soygecmis,
          eklemetarihi: moment(date).format('LL'),
          doktorbilgi: data.gecmis[0].doktorbilgi
        }).delay(100);

        this.historyCredentials.ekleyentc = data.gecmis[0].ekleyentc;
        this.historyCredentials.gecmisid = data.gecmis[0].gecmisid;
        this.historyCredentials.hastatc = data.gecmis[0].hastatc;

        this.openModal('editHistoryModal');
      }
    });
  }

  public addPatientHistory(): void {
    this.historyCredentials.ekleyentc = this.currentDoctor;
    this.historyCredentials.hastatc = this.patient.toString();
    
    this.historyService.addHistory(this.historyCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('addHistoryModal');
        this.getPatientHistory();
        this.disposeHistoryCredentials();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public updatePatientHistory(): void {
    this.historyService.updateHistory(this.historyCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('editHistoryModal');
        this.getPatientHistory();
        this.disposeHistoryCredentials();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public deletePatientHistory(): void {
    this.historyService.deleteHistory(this.historyCredentials.gecmisid).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('editHistoryModal');
        this.getPatientHistory();
        this.disposeHistoryCredentials();
      } else {
        this.toastr.warning('', data.message);
      }
    })
  }


  //Field Funcs.
  olcumTitle: string;
  olcumSize: number = 1;

  public getMedicalFields(muayeneId): void {
    this.fields = [];
    this.fieldService.getFieldData(muayeneId).subscribe(data => {
      if(data.returncode == 0) {
        this.fields = data.muayenenotu;
      }
    });
  }

  public getDoctorFileds(): void {
    this.fields = [];
    this.fieldService.getFields(this.currentDoctor).subscribe(data => {
      if(data.returncode == 0) {
        this.fields = data.doktorsaha;
      }
    })
  }

  public getPatientField(): void {
    this.patientService.getPatientSaha(this.patient).subscribe(data => {
      if(data.returncode == 0) {
        for(var index in data.saha) {
          var date = moment(data.saha[index].eklenmetarihi);
          date.locale('tr');
          data.saha[index].eklenmetarihi = moment(date).format('LL');
        }
        this.fieldDataTable.dataRows = data.saha;
        this.fieldDtTrigger.repeat();
      } else if(data.returncode == 4) {
        this.fieldDataTable = { headerRow: [], dataRows: [] };
      }     
    });
  }

  public addPatientFiled(): void {
    if(this.patientFieldCredentials.type == 'Metin') {
      this.patientFieldCredentials.type = "1"
    } else if(this.patientFieldCredentials.type == 'Sayı') {
      this.patientFieldCredentials.type = "2"
    } else if(this.patientFieldCredentials.type == 'Tarih') {
      this.patientFieldCredentials.type = "3"
    }
    this.patientFieldCredentials.hastatc = this.patient.toString();

    this.fieldService.addPatientField(this.patientFieldCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.disposePatientFieldCredentials();
        this.getPatientField();
        this.closeModal('addPatientFieldModal');
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public selectSaha(sahaId, sahaName): void {
    this.isSahaDetailSelected = true;
    this.olcumTitle = sahaName;
    this.followOlcumCredentials.sahaid = sahaId;
    this.isFollowOlcumValues();

    this.patientService.getPatientSahaDetail(sahaId).subscribe(data => {
      if(data.returncode == 0) {
        this.olcumSize = data.saha[0].boyut;
      }
    });

    this.getPatientOlcumValues(sahaId);
  }

  public getPatientOlcumValues(sahaId): void {
    this.patientService.getPatientOlcum(this.patient.toString(), sahaId).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          for(var index in data.olcum) {
            var date = moment(data.olcum[index].olcumzamani);
            date.locale('tr');
            data.olcum[index].olcumzamani = moment(date).format('LLL');
          }
          this.olcumDataTable.dataRows = data.olcum;
          this.olcumDtTrigger.repeat();
        } else if(data.returncode == 4) {
          this.olcumDataTable = { headerRow: [], dataRows: [] };
        }
      }
    });
  }

  public addPatientOlcum(): void {
    this.patientOlcumCredentials.ekleyentc = this.currentDoctor;
    this.patientOlcumCredentials.hastatc = this.patient.toString();
    this.patientOlcumCredentials.olcumzamani = moment(this.olcumDate).format('YYYY-MM-DD hh:mm');
    this.patientOlcumCredentials.sahaid = this.followOlcumCredentials.sahaid;
    
    if(this.olcumSize == 4) {
      this.patientOlcumCredentials.degers = this.patientOlcumCredentials.deger1 + "," + this.patientOlcumCredentials.deger2 + "," + this.patientOlcumCredentials.deger3 + "," + this.patientOlcumCredentials.deger4;
    } else if(this.olcumSize == 3) {
      this.patientOlcumCredentials.degers = this.patientOlcumCredentials.deger1 + "," + this.patientOlcumCredentials.deger2 + "," + this.patientOlcumCredentials.deger3;
    } else if(this.olcumSize == 2) {
      this.patientOlcumCredentials.degers = this.patientOlcumCredentials.deger1 + "," + this.patientOlcumCredentials.deger2;
    } else if(this.olcumSize == 1) {
      this.patientOlcumCredentials.degers = this.patientOlcumCredentials.deger1;
    }
    
    this.patientService.addPatientOlcum(this.patientOlcumCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('addPatientOlcumModal');
        this.getPatientOlcumValues(this.patientOlcumCredentials.sahaid);
        this.disposePatientOlcumCredentials();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }


  public isFollowOlcumValues(): void {
    this.fieldService.isFollow(this.currentDoctor, this.patient.toString(), this.followOlcumCredentials.sahaid).subscribe(data => {
      if(data.returncode == 0) {
        this.isFollowOlcumSelected = true;
      } else if(data.returncode == 4) {
        this.isFollowOlcumSelected = false;
      }
    });

  }

  public followOLcum(): void {
    this.followOlcumCredentials.etkilesimtipiid = "2";

    if(this.periodType == "Gün") {
      this.followOlcumCredentials.suretipi = "1";
    } else if(this.periodType == "Saat") {
      this.followOlcumCredentials.suretipi = "2";
    } else if(this.periodType == "Dakika") {
      this.followOlcumCredentials.suretipi = "3";
    }

    if(this.timeType == "Periyodik") {
      this.isPeriod = true;
      this.isFiltre = false;
    } else if(this.timeType == "Filtre") {
      this.isPeriod = false;
      this.isFiltre = true;
      this.followOlcumCredentials.suretipi = "5";
    } else if(this.timeType == "Anlık") {
      this.isPeriod = false;
      this.isFiltre = false;
      this.followOlcumCredentials.suretipi = "4";
    }

    this.followOlcumCredentials.hastatc = this.patient.toString();
    
    this.fieldService.followField(this.followOlcumCredentials).subscribe(data => {
      if(data.returncode == 0) {  
        this.toastr.success('', data.message);
        this.isFollowOlcumSelected = true;
        this.closeModal('followOlcumModal');
      } else {
        this.toastr.warning('', data.message);
        this.isFollowOlcumSelected = false;
      }
    });
  }

  public unFollowOlcum(): void {
    this.fieldService.unfollowOlcum(this.currentDoctor, this.patient.toString(), this.followOlcumCredentials.sahaid).subscribe(data => {
      if(data.returncode == 0) {
        this.isFollowOlcumSelected = false;
        this.toastr.success('', data.message);
      } else if(data.returncode == 4) {
        this.isFollowOlcumSelected = true;
        this.toastr.warning('', data.message);
      }
    });
  }

  public isPeriod: boolean = false;
  public isFiltre: boolean = false;
  public onChangeEtkilesim(param): void {
    if(this.timeType == "Periyodik") {
      this.isPeriod = true;
      this.isFiltre = false;
    } else if(this.timeType == "Filtre") {
      this.isPeriod = false;
      this.isFiltre = true;
    } else if(this.timeType == "Anlık") {
      this.isPeriod = false;
      this.isFiltre = false;
    }
  }

  public onChangePeriod(param): void {
    if(this.periodType == "Gün") {
      this.followOlcumCredentials.suretipi = "1";
    } else if(this.periodType == "Saat") {
      this.followOlcumCredentials.suretipi = "2";
    } else if(this.periodType == "Dakika") {
      this.followOlcumCredentials.suretipi = "3";
    }
  }


  //Profile Funcs.
  public getPatientDetail(): void {
    this.userService.getUser(this.patient).subscribe(data => {
      if(data.returncode == 0) {
        var date = moment(data.userinfo[0].birthdate).locale('tr');

        this.user = Observable.of({
          tckimlik: data.userinfo[0].tckimlik,
          name: data.userinfo[0].name,
          surname: data.userinfo[0].surname,
          email: data.userinfo[0].email,
          address: data.userinfo[0].address,
          birthdate: moment(date).format('LL'),
          birthplace: data.userinfo[0].birthplace,
          cellphone: data.userinfo[0].cellphone,
          homephone: data.userinfo[0].homephone,
          gender: data.userinfo[0].gender,
          city: data.userinfo[0].city,
          country: data.userinfo[0].country,
          job: data.userinfo[0].meslek
        }).delay(100);

        this.patientCredentials.tckimlik = data.userinfo[0].tckimlik;
        this.patientCredentials.name = data.userinfo[0].name;
        this.patientCredentials.surname = data.userinfo[0].surname;
        this.patientCredentials.birthdate = data.userinfo[0].birthdate;
        this.patientCredentials.birthplace = data.userinfo[0].birthplace;
        this.patientCredentials.email = data.userinfo[0].email;
        this.patientCredentials.cellphone = data.userinfo[0].cellphone;
        this.patientCredentials.address = data.userinfo[0].address;
        this.patientCredentials.gender = data.userinfo[0].gender;
      }
    });
  }

  public updatePatient(): void {
    this.userService.updateUser(this.patientCredentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }


  //Navigations
  public openModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('show'); 
  }

  public closeModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

  public tabItemClick(param): void {
    this.isMedicalAddSelected = false;
    this.isMedicalDetailSelected = false;
  }

  public async openDeleteMuayene() {
    const result = await swal({
      title: '',
      text: "Muayeneyi silmek istediğinize emin misiniz?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır'
      })
  
      if(result) {
        try {
          await this.deleteMuayene();
        } catch (err){
        }
      }
  }

  public openDocumentUrl(url): void {
    window.open(url);
  }


  //Disposes
  public disposeHistoryCredentials(): void {
    this.historyCredentials = { 
      gecmisid: '',
      hastatc: '',
      ekleyentc: '',
      ozgecmis: '',
      soygecmis: ''
    };
  }

  public disposeMedicalCredentials(): void {
    this.medicalCredentials = {
      muayeneid: '',
      bulgu: '',
      date: '',
      docId: '1',
      doctortc: '',
      hastatc: '',
      oyku: '',
      yakinma: '',
      tani: '',
      muayeneType: '1',
      kontrolnotlari: '',
      kontrolTarihi: '',
      notlar: '',
      sonuc: ''
    };
  }

  public disposePatientFieldCredentials(): void {
    this.patientFieldCredentials = {
      hastatc: '',
      name: '',
      type: this.fieldTypes[0],
      size: this.sizes[0],
      unit: ''
    };
  }

  public disposeLabRequestredentials(): void {
    this.labRequestredentials = {
      kurumid: '',
      muayeneid: '',
      istektipi: '1',
      aciklama: '',
      doktortc: '',
      hastatc: ''
    };
  }

  public disposePatientOlcumCredentials(): void {
    this.patientOlcumCredentials = {
      sahaid: '',
      deger1: '',
      deger2: '',
      deger3: '',
      deger4: '',
      degers: '',
      ekleyentc: '',
      hastatc: '',
      olcumzamani: ''
    };
  }


  //Paginations
  muayeneVisitPageIndex: number = 0;
  muayeneVisitPageLength: number = 10;
  muayeneVisitLength: number = 0;
  
  public medicalVisitPagination(param): void {
    if(param == "next") {
      if(this.muayeneVisitLength != 0) {
        this.muayeneVisitPageIndex = this.muayeneVisitPageIndex + this.muayeneVisitPageLength;
      }
    } else if(param == "back") {
      if(this.muayeneVisitPageIndex > 0) {
        this.muayeneVisitPageIndex = this.muayeneVisitPageIndex - this.muayeneVisitPageLength;
      }
    }

  }

}
