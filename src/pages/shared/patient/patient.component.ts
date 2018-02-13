import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/PatientService/patient.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/NotificationService/notification.service';
import { UserService } from '../../../services/UserService/user.service';
import { IMyDpOptions } from 'mydatepicker';

declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  providers: [PatientService, UserService, NotificationService]
})
export class PatientComponent implements OnInit {
  boxColor: string;
  searchedValue: string;
  currentDoctor: string;
  selectedType: string;
  selectedOrderType: string;
  
  patientsDtTrigger: Subject<DataTable> = new Subject(); 
  patientsDataTable: DataTable = { headerRow: [], dataRows: [] };

  notificationTypes: any;
  notificationType: string;

  selectedValues: Array<String> = [];
  selectedObjects = [];
  isSelected = [];
  isAllSelected: boolean;
  isPatientAdded: boolean;

  birthDate: any;
  datePickerOptions: IMyDpOptions;
  
  //Credentials
  notificationCredentials = { 
    tckimlik: '', 
    othertckimlik: '', 
    title: '', 
    message: '',
    typeid: '1',
    header: '',
    messageType: ''
  };

  patientCredentials = {
    tc: '',
    name: '',
    surname: '',
    birthdate: ''
  };


  constructor(private patientService: PatientService,
    private notificationService: NotificationService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router) { 

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
    
    this.configure();
    this.getPatients();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    
    this.selectedType = 'a';
    this.selectedOrderType = '3';

    this.notificationTypes = ["SMS", "Bildirim", "Eposta"];
    this.notificationType = this.notificationTypes[0];

    this.isAllSelected = false;
    this.isPatientAdded = false;


    let date = new Date();
    this.birthDate = { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } };
    this.datePickerOptions = {
      todayBtnTxt: 'Bugün',
      dateFormat: 'dd/mm/yyyy',
      firstDayOfWeek: 'mo',
      showClearDateBtn: true,
      showDecreaseDateBtn: true,
      showIncreaseDateBtn: true,
      sunHighlight: true,
      inline: false
    };

  }


  //Call Service Providers
  public getPatients(): void {
    this.patientService.getDoctorPatients(this.currentDoctor, this.selectedType, this.selectedOrderType).subscribe(data => {
      if(data.returncode == 0) {
        for(let patient of data.doktorhasta) {
          if(patient.hastafoto == null) {
            if(patient.hastacinsiyet == 'Erkek') {
              patient.hastafoto = "assets/images/male.png";
            } else if(patient.hastacinsiyet == 'Kadın'){
              patient.hastafoto = "assets/images/female.png";
            } else {
              patient.hastafoto == null;
            }

            if(patient.hastameslek == 'null' || patient.hastameslek == null) {
              patient.hastameslek = '';
            }
          }
        }
        this.patientsDataTable.dataRows = data.doktorhasta;
      } else if(data.returncode == 1) {
        //send to logout
      } else if(data.returncode == 4) {
        this.patientsDataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public searchPatients(): void {
    this.patientService.searchPatients(this.currentDoctor, this.searchedValue).subscribe(data => {
      if(data.returncode == 0) {
        for(let patient of data.doktorhasta) {
          if(patient.hastafoto == null) {
            if(patient.hastacinsiyet == 'erkek') {
              patient.hastafoto = "assets/images/male.png";
            } else {
              patient.hastafoto = "assets/images/female.png";
            }
          }
        }
        this.patientsDataTable.dataRows = data.doktorhasta;
        this.patientsDtTrigger.repeat();
      } else if(data.returncode == 1) {

      } else if(data.returncode == 4) {
        this.patientsDataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public sendNotification(): void {
    this.notificationCredentials.tckimlik = this.currentDoctor;
    if(this.notificationCredentials.title != "" || this.notificationCredentials.message != "") {
      this.notificationCredentials.othertckimlik = JSON.stringify(this.selectedValues);
      if(this.notificationType == "SMS") this.notificationCredentials.messageType = "1";
      else if(this.notificationType == "Bildirim") this.notificationCredentials.messageType = "2";
      else if(this.notificationType == "Eposta") this.notificationCredentials.messageType = "3";
      this.notificationService.sendNotification(this.notificationCredentials).subscribe(data => {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
          this.closeModal('notificationModal');
          this.disposeNotificationCredentials();
        } else {
          this.toastr.warning('', data.message);
          this.closeModal('notificationModal');
        }
      });
    } else {
      this.toastr.warning('', "Lütfen bilgilerinizi girdiğinizden emin olunuz.");      
      this.closeModal('notificationModal');
    }
  }

  public addPatient(): void {  
    if(this.patientCredentials.tc != '' && 
    this.patientCredentials.name != '' && 
    this.patientCredentials.surname != '') {
      this.patientCredentials.birthdate = this.birthDate.date.year + "-" + this.birthDate.date.month + "-" + this.birthDate.date.day;
        this.patientService.addNewPatient(this.patientCredentials).subscribe(data => {
          if(data.returncode == 0) {
            this.toastr.success('', data.message);
            this.getPatients(); 
            this.closeModal('addPatientModal');
          }
        });
      } else if(this.patientCredentials.tc != '' && 
        this.patientCredentials.name == '' && 
        this.patientCredentials.surname == '') {
          var hastatc = this.patientCredentials.tc;
          this.userService.getUser(hastatc).subscribe(data => {
            if(data) {
              if(data.returncode == 0) {
                this.patientService.addPatient(hastatc).subscribe(datum => {
                  if(datum) {
                    this.toastr.success('', datum.message);
                    this.getPatients();
                    this.closeModal('addPatientModal');
                  }
                });
              } else {
                this.isPatientAdded = true;
                this.toastr.warning('', 'T.C. numarası sistemde kayıtlı değildir. Eklemek için lütfen bilgileri giriniz.');
              }
            }
          });
      } else {
        this.toastr.warning('', 'Lütfen bilgileri eksiksiz giriniz.');        
      }
  }


  //Button Funcs.
  public selectFilter(param): void {
    if(param == 1) {
      this.selectedType = 'a';
      this.selectedOrderType = '1';
    } else if(param == 2) {
      this.selectedType = 'd';
      this.selectedOrderType = '1';
    } else if(param == 3) {
      this.selectedType = 'a';
      this.selectedOrderType = '2';
    } else if(param == 4) {
      this.selectedType = 'd';
      this.selectedOrderType = '2';
    } else if(param == 5) {
      this.selectedType = 'a';
      this.selectedOrderType = '3';
    } else if(param == 6) {
      this.selectedType = 'd';
      this.selectedOrderType = '3';
    }

    this.getPatients();
  }

  public selectPatient(tc): void {
    sessionStorage.setItem('patient', tc);
    this.router.navigate(['main/medical']);
  }

  public notificationButtonClick(): void {
    this.notificationCredentials.header = "";
    this.selectedObjects.forEach(element => {
      if(element.tckimlik != "") this.notificationCredentials.header = this.notificationCredentials.header + element.name + " " + element.surname + ", ";
    });

    if(this.notificationCredentials.header != "") {
      this.openModal('notificationModal');
    }
  }

  public change(e, type, index): void {
    if(e.target.checked){
      this.selectedValues[index] = type.hastatc;
      this.selectedObjects[index] = {
        tckimlik: type.hastatc,
        name: type.hastaadi,
        surname: type.hastasoyadi
      };
      this.isSelected[index] = true;
    }
    else{
      this.isAllSelected = false;
      this.selectedValues[index] = "";
      this.selectedObjects[index] = {
        tckimlik: "",
        name: "",
        surname: ""
      };
      this.isSelected[index] = false;
    }
  }

  public selectAll(event): void {
    this.selectedValues = [];
    this.selectedObjects = [];
    this.notificationCredentials.header = "";
    this.patientsDataTable.dataRows.forEach(row => {
      if(event.target.checked) {
        this.selectedValues.push(row.hastatc);
        this.selectedObjects.push({
          tckimlik: row.hastatc,
          name: row.hastaadi,
          surname: row.hastasoyadi
        });
        this.isSelected.push(true);
        this.isAllSelected = true;
      } else if(!event.target.checked) {
        this.isSelected.push(false);
        this.selectedValues = [];
        this.selectedObjects = [];
        this.isAllSelected = false;
        this.notificationCredentials.othertckimlik = "";
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


  //Disposes
  public disposeNotificationCredentials(): void {
    this.notificationCredentials = { 
      tckimlik: '', 
      othertckimlik: '', 
      title: '', 
      message: '',
      typeid: '1',
      header: '',
      messageType: this.notificationTypes[0]
    };
  }

  public disposePatientCredentials(): void {
    this.patientCredentials = {
      tc: '',
      name: '',
      surname: '',
      birthdate: ''
    };
  }

}
