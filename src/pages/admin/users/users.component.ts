import { NotificationService } from './../../../services/NotificationService/notification.service';
import { UserService } from './../../../services/UserService/user.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { IOption } from 'ng-select';
import { Subject } from 'rxjs';
import { SendNotificationModel } from '../../../models/SendNotificationModel';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { UserUpdateModel } from '../../../models/UserUpdateModel';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/delay';
import { ToastrService } from 'ngx-toastr';
import { SearchModel } from '../../../models/SearchModel';
import emailMask from 'text-mask-addons/dist/emailMask';
import { forEach } from '@angular/router/src/utils/collection';
import { empty } from 'rxjs/observable/empty';
import { EMPTY_ARRAY } from '@angular/core/src/view/util';
import {IMyDpOptions} from 'mydatepicker';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, NotificationService]
})
export class UsersComponent implements OnInit {
  public phoneMask: Array<string | RegExp>
  public birthdateMask: Array<string | RegExp>

  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [ 'İsim Soyisim' ],
    footerRow: [],
    dataRows: []
  };

  myOptions: Array<IOption> = [
    {label: 'admin', value: 'admin'},
    {label: 'doktor', value: 'doktor'},
    {label: 'hasta', value: 'hasta'},
    {label: 'lab', value: 'lab'},
    {label: 'sekreter', value: 'sekreter'}
  ];

  public sendNotificationCredentials: SendNotificationModel = { 
    tckimlik: sessionStorage.getItem("tc"), 
    othertckimlik: '', 
    title: '', 
    message: '',
    typeid: '1',
    header: '',
    messageType: ''
  };

  updateCredentials: UserUpdateModel = {
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
    photourl: '',
    roles: '',
    gender: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  sub: any; 
  user: {};
  boxColor: String;
  addSelected: boolean;
  updateSelected: boolean;
  defaultRoles: Array<String> = [];  
  userTC: string;  
  selectedValues: Array<String> = [];
  selectedObjects = [];
  isSelected = [];
  isAllSelected: boolean = false;
  messageTypeArray = ["SMS", "Bildirim", "Eposta"];
  messageType: string = "SMS";
  userPhoto: File;

  selectedRow : Number;
  setClickedRow : Function;
  yourName: string = '';

  public datePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Bugün',
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    showClearDateBtn: true,
    sunHighlight: true,
    inline: false
  };

  public selectedDate: any;
  public description: string;
  public randevuType: string;
  clickedDate: Date;

  
  constructor(private userService: UserService, 
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private router: Router,
    private element: ElementRef) {
      this.phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      this.birthdateMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
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
    this.getUsers();
  }

  configure() {
    this.dtOptions = {
      bLengthChange:false,
      searching:false,
      header:false,
      info:false,
      infoEmpty:false,
      pageLength:25,
      paginate:false,
      sort:false
    };

    this.boxColor = sessionStorage.getItem('boxColor');
    this.addSelected = false;
    this.updateSelected = false;  
  }

  reloadData() {
    this.userService.getUsers().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.userinfo
        this.dtTrigger.repeat();
      }
    });
  }

  change(e, type, index){
    if(e.target.checked){
      this.selectedValues[index] = type.tckimlik;
      this.selectedObjects[index] = {
        tckimlik: type.tckimlik,
        name: type.name,
        surname: type.surname
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

  fileChange(event) {
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

  findIndexToUpdate(type) { 
    return type === this;
  }

  selectAll(event) {
    this.selectedValues = [];
    this.selectedObjects = [];
    this.sendNotificationCredentials.header = "";
    this.dataTable.dataRows.forEach(row => {
      if(event.target.checked) {
        this.selectedValues.push(row.tckimlik);
        this.selectedObjects.push({
          tckimlik: row.tckimlik,
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
        this.sendNotificationCredentials.othertckimlik = "";
      }
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.userinfo;
        this.dtTrigger.repeat();
      }
    });
  }

  getUserInfo(tc) {
    this.userService.getUser(tc).subscribe(data => {

      if(data) {
        this.updateCredentials.tckimlik = data.userinfo[0].tckimlik;      
        this.updateCredentials.name = data.userinfo[0].name;
        this.updateCredentials.surname = data.userinfo[0].surname;
        this.updateCredentials.email = data.userinfo[0].email;
        this.updateCredentials.country = data.userinfo[0].country;
        this.updateCredentials.city = data.userinfo[0].city;
        this.updateCredentials.address = data.userinfo[0].address;
        this.updateCredentials.birthdate = data.userinfo[0].birthdate;
        this.updateCredentials.birthplace = data.userinfo[0].birthplace;
        this.updateCredentials.cellphone = data.userinfo[0].cellphone;
        this.updateCredentials.homephone = data.userinfo[0].homephone;
        this.updateCredentials.photourl = data.userinfo[0].photourl;
        this.updateCredentials.gender = data.userinfo[0].gender;
        this.selectedDate = { date: data.userinfo[0].birthdate };

        let i = 0;
        let arr = new Array<string>();
        for(i = 0; i < data.userinfo[0].roles.length; i++) {
          switch(data.userinfo[0].roles[i]["rolenames"]) {
            case "admin" :
              arr[i] = 'admin';
            break;
            case "doktor" : 
              arr[i] = 'doktor';
            break;
            case "hasta" :
              arr[i] = 'hasta';
            break;
            case "lab" :
              arr[i] = "lab";
            break;
            case "sekreter" :
              arr[i] = "sekreter";
            break;
          }
        }
        this.defaultRoles = arr;
        
        this.user = Observable.of({
          tckimlik: data.userinfo[0].tckimlik,
          name: data.userinfo[0].name,
          surname: data.userinfo[0].surname,
          email: data.userinfo[0].email,
          country: data.userinfo[0].country,
          city: data.userinfo[0].city,
          address: data.userinfo[0].address,
          birthdate: data.userinfo[0].birthdate,
          birthplace: data.userinfo[0].birthplace,
          cellphone: data.userinfo[0].cellphone,
          homephone: data.userinfo[0].homephone,
          photourl: data.userinfo[0].photourl,
          gender: data.userinfo[0].gender   
        }).delay(100);

      }
    });
  }

  updateUser() {
    this.updateCredentials.birthdate = this.selectedDate.date;

    this.userService.updateUser(this.updateCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          let userRoles = this.defaultRoles.toString();

          this.userService.changeUserRoles(this.updateCredentials.tckimlik, userRoles).subscribe(datum => {
            if (datum) {
              if (datum.returncode == 0) {
                this.userService.uploadUserPhoto(this.userPhoto, this.updateCredentials.tckimlik).subscribe(photoData => {
                  if (photoData) {
                    if (photoData.returncode == 0) {
                      this.toastr.success('', data.message);
                      this.reloadData();
                    } else {
                      this.toastr.warning('', data.message);                
                    }
                  }
                });
              } else {
                this.toastr.warning('', data.message);
              }
            }
          });
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  notificationClick() {
    console.log(this.selectedObjects);
    this.selectedObjects.forEach(element => {
      if(element.tckimlik != "") this.sendNotificationCredentials.header = this.sendNotificationCredentials.header + element.name + " " + element.surname + ", ";
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

  async deleteUser(name, id) {
    const result = await swal({
      title: '',
      text: name + " adlı kullanıcıyı silmek istediğinize emin misiniz?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır'
      })

      if(result) {
        try {
          this.userService.deleteUser(id).subscribe(data => {
            if (data) {
              if (data.returncode == 0) {
                this.toastr.success('', data.message);
                this.reloadData();
                this.updateSelected = false;
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
      this.userService.searchUser(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.ozgecmis
          this.dtTrigger.repeat();
        }
      });
    } else {
    }
  }


  //Navigations
  openEditPanel(id) {
    this.addSelected = false;
    this.updateSelected = true;
    this.getUserInfo(id);
  }

  openAddPanel() {
    this.addSelected = true;
    this.updateSelected = false;
  }

  closeRightPanel() {
    this.updateSelected = false;
    this.addSelected = false;
    this.selectedRow = -1;
  }

  closeModal(param) {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

}
