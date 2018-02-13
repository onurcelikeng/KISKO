import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ExaminationService } from './../../../services/ExaminationService/examination.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SearchModel } from '../../../models/SearchModel';
import { ExaminationModel } from '../../../models/ExaminationModel';
import { Observable } from 'rxjs/Observable';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css'],
  providers: [ExaminationService]
})
export class ExaminationComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject(); 
  dtOptions: any = {}; 
  dataTable: DataTable = {
    headerRow: ['Tetkik Adı'],
    footerRow: [],
    dataRows: []
  };

  updateCredentials: ExaminationModel = {
    id: '',
    name: '',
    description: '',
    examinationGroupId: '',
    examinationGroupName: ''
  };

  addCredentials: ExaminationModel = {
    id: '0',
    name: '',
    description: '',
    examinationGroupId: '',
    examinationGroupName: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };
  
  examination: {};
  boxColor: String;
  addSelected: boolean;
  updateSelected: boolean;
  isEditing: boolean;  

  selectedRow : Number;
  setClickedRow : Function;


  constructor(private examinationService: ExaminationService,
    private toastr: ToastrService,
    private router: Router) { 
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
    this.getExaminations();
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

  reloadDataTable() {
      this.examinationService.getAllExamination().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.tetkik;
        this.dtTrigger.repeat();
      }
    });
  }

  emptyAddCredentials() {
    this.addCredentials.id = ''; 
    this.addCredentials.name = '';
    this.addCredentials.description = '';
    this.addCredentials.examinationGroupId = '';
    this.addCredentials.examinationGroupName = '';
  }

  getExaminations() {
    this.examinationService.getAllExamination().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.tetkik;
        this.dtTrigger.next();
      }
    });
  } 

  getExamination(id) {
    this.emptyAddCredentials();

    this.examinationService.getExamination(id).subscribe(data => {
      if(data) {
        this.updateCredentials.id = data.tetkik[0].tetkikid; 
        this.updateCredentials.name = data.tetkik[0].tetkikadi; 
        this.updateCredentials.description = data.tetkik[0].description; 
        this.updateCredentials.examinationGroupId = data.tetkik[0].tetkikgrupid; 
        this.updateCredentials.examinationGroupName = data.tetkik[0].tetkikgrupadi; 
      
        this.examination = Observable.of({
          id: data.tetkik[0].tetkikid,
          groupId: data.tetkik[0].tetkikgrupid,
          name: data.tetkik[0].tetkikadi,
          description: data.tetkik[0].description,
          groupName: data.tetkik[0].tetkikgrupadi
        }).delay(100);
      }
    });
  }

  addExamination() {
    this.examinationService.addExamination(this.addCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
          this.reloadDataTable();
          this.closeRightPanel();
          this.emptyAddCredentials();
          this.isEditing = false;
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  updateExamination() {
    this.examinationService.updateExamination(this.updateCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          if(data.returncode == 0) {
            this.toastr.success('', data.message);
            this.reloadDataTable();
            this.isEditing = false;
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

  async deleteExamination(id) {
    const result = await swal({
      title: '',
      text: "Silmek istediğinize emin misiniz?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır'
      })

      if(result) {
        try {
          this.examinationService.deleteExamination(id).subscribe(data => {
            if (data) {
              if (data.returncode == 0) {
                this.toastr.success('', data.message);
                this.reloadDataTable();
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
      this.examinationService.searchExamination(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.tetkik
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
          this.getExamination(id);
        }
      } else {
        this.addSelected = false;
        this.updateSelected = true;
        this.getExamination(id);
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
  
}
