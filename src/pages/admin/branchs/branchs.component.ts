import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BranchService } from './../../../services/BranchService/branch.service';
import { Subject } from 'rxjs';
import { BranchModel } from '../../../models/BranchModel';
import { Observable } from 'rxjs/Observable';
import { SearchModel } from '../../../models/SearchModel';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-branchs',
  templateUrl: './branchs.component.html',
  styleUrls: ['./branchs.component.css'],
  providers: [BranchService]
})
export class BranchsComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject(); 
  dtOptions: any = {}; 
  dataTable: DataTable = {
    headerRow: ['Branş Adı'],
    footerRow: [],
    dataRows: []
  };

  updateCredentials: BranchModel = {
    id: '',
    name: ''
  };

  addCredentials: BranchModel = {
    id: '0',
    name: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  branch: {};
  boxColor: String;
  addSelected: boolean;
  updateSelected: boolean;
  isEditing: boolean;

  selectedRow : Number;
  setClickedRow : Function;


  constructor(private branchService: BranchService,
    private router: Router,
    private toastr: ToastrService) { 
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
      this.getBranchs();
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
      this.branchService.getAllBranchs().subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.brans
          this.dtTrigger.repeat();
        }
      });
    }

    emptyAddCredentials() {
      this.addCredentials.id = ''; 
      this.addCredentials.name = '';
    }

    getBranchs() {
      this.branchService.getAllBranchs().subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.brans
          this.dtTrigger.next();
        }
      });
    }

    getBranch(id) {
      this.emptyAddCredentials();
      
      this.branchService.getBranch(id).subscribe(data => {
        if(data) {
          this.updateCredentials.id = data.brans[0].bransid; 
          this.updateCredentials.name = data.brans[0].bransadi; 
        
          this.branch = Observable.of({
            id: data.brans[0].bransid,
            name: data.brans[0].bransadi
          }).delay(100);
        }
      });
    }

    addBranch() {
      this.branchService.addBranch(this.addCredentials).subscribe(data => {
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

    updateBranch() {
      this.branchService.updateBranch(this.updateCredentials).subscribe(data => {
        if(data) {
          if(data.returncode == 0) {
            if(data.returncode == 0) {
              this.toastr.success('', data.message);
              this.reloadData();
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

    async deleteBranch(name, id) {
      const result = await swal({
        title: '',
        text: name + " silmek istediğinize emin misiniz?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Evet',
        cancelButtonText: 'Hayır'
        })
  
        if(result) {
          try {
            this.branchService.deleteBranch(id).subscribe(data => {
              if (data) {
                console.log(data);
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
        this.branchService.searchBranch(this.searchCredentials.value).subscribe(data => {
          if(data) {
            this.dataTable.dataRows = data.brans
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
            this.getBranch(id);
          }
      } else {
        this.addSelected = false;
        this.updateSelected = true;
        this.getBranch(id);
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
