import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CheckupService } from './../../../services/CheckupService/checkup.service';
import { Subject } from 'rxjs';
import { SearchModel } from '../../../models/SearchModel';
import { CheckupModel } from '../../../models/CheckupModel';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-checkups',
  templateUrl: './checkups.component.html',
  styleUrls: ['./checkups.component.css'],
  providers: [CheckupService]
})
export class CheckupsComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject();  
  dtTrigger2: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dtOptions2: any = {};   
  dataTable: DataTable = {
    headerRow: [ 'Checkup Adı' ],
    footerRow: [],
    dataRows: []
  };

  examinationDataTable: DataTable = {
    headerRow: [ 'Tetkik Adı' ],
    footerRow: [],
    dataRows: []
  };

  updateCredentials: CheckupModel = {
    id: '',
    name: '',
    placeId: '',
    price: '',
    unit: '',
    description: ''
  };

  addCredentials: CheckupModel = {
    id: '0',
    name: '',
    placeId: '0',
    price: '',
    unit: '',
    description: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  boxColor: String;
  isCheckupSelected: Boolean;


  constructor(private checkupService: CheckupService,
    private router: Router,
    private toastr: ToastrService) { }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'admin') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getCheckUps();
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

    this.dtOptions2 = {
      bLengthChange:false,
      searching:false,
      header:false,
      info:false,
      infoEmpty:false,
      pageLength:25,
      sort:false,
      paginate:false
    };

    this.isCheckupSelected = false;
    this.boxColor = sessionStorage.getItem('boxColor');
  }

  reloadData() {
    this.checkupService.getCheckUps().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.checkup;
        this.dtTrigger.repeat();
      }
    });
  }

  getCheckUps() {
    this.checkupService.getCheckUps().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.checkup;
        this.dtTrigger.repeat();
      }
    });
  }

  addCheckup() {
    this.checkupService.addCheckup(this.addCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          $('#addChecupModal').modal('hide');
          this.toastr.success('', data.message);
          this.reloadData(); 
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  updateCheckup() {
    this.checkupService.updateCheckup(this.updateCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          $('#updateChecupModal').modal('hide');
          this.toastr.success('', data.message);
          this.reloadData(); 
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  deleteCheckup() {
    var id = this.updateCredentials.id;
    this.checkupService.deleteCheckUp(id).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          $('#updateChecupModal').modal('hide');
          this.toastr.success('', data.message);   
          this.reloadData();
        } else {
          $('#updateChecupModal').modal('hide');
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  getCheckupExaminations(id) {
    this.checkupService.getCheckUpExaminations(id).subscribe(data => {
      if(data) {
        this.examinationDataTable.dataRows = data.checkuptetkik;
        this.dtTrigger2.repeat();
      }
    });

    this.isCheckupSelected = true;
  }
  
  //Navigations
  openCheckupPanel(param) {    
    this.updateCredentials.id = param.checkupid
    this.updateCredentials.name = param.checkupadi;
    this.updateCredentials.price = param.ucret;
    this.updateCredentials.unit = param.birimi;
    this.updateCredentials.description = param.aciklama;
  }

  closeModal(param) {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

}
