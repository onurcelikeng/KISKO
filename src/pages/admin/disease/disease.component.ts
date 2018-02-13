import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DiseaseService } from '../../../services/DiseaseService/disease.service';
import { Subject } from 'rxjs';
import { DiseaseGroupModel } from '../../../models/DiseaseGroupModel';
import { SearchModel } from '../../../models/SearchModel';
import { ToastrService } from 'ngx-toastr';
import { DiseaseModel } from '../../../models/DiseaseModel';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css'],
  providers: [DiseaseService]
})
export class DiseaseComponent implements OnInit {
  dtTrigger1: Subject<DataTable> = new Subject(); 
  dtOptions1: any = {}; 
  dataTable1: DataTable = {
    headerRow: ['Hastalık Grup Adı'],
    footerRow: [],
    dataRows: []
  };
  dtTrigger2: Subject<DataTable> = new Subject(); 
  dtOptions2: any = {}; 
  dataTable2: DataTable = {
    headerRow: ['Hastalık Adı'],
    footerRow: [],
    dataRows: []
  };

  updateDiseaseGroupCredentials: DiseaseGroupModel = {
    id: '',
    name: ''
  };

  addDiseaseGroupCredentials: DiseaseGroupModel = {
    id: '0',
    name: ''
  };

  updateDiseaseCredentials: DiseaseModel = {
    id: '',
    name: '',
    diseasegroupId: ''
  };

  addDiseaseCredentials: DiseaseModel = {
    id: '0',
    name: '',
    diseasegroupId: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  diseaseGroup: {};
  boxColor: String;
  diseaseSelected: boolean;
  selectedRow : Number;
  setClickedRow : Function;

  constructor(private diseaseService: DiseaseService,
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
    this.getAllDiseaseGroups();
  }

  configure() {
    //disease group
    this.dtOptions1 = {
      bLengthChange:false,
      searching:false,
      header:false,
      info:false,
      infoEmpty:false,
      pageLength:25,
      paginate:false,
      sort:false
    };

    //disease
    this.dtOptions2 = {
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
    this.diseaseSelected = false;
  }

  reloadDataTable1() {
    this.diseaseService.getAllDiseaseGroups().subscribe(data => {
      if(data) {
        this.dataTable1.dataRows = data.hastalikgrup
        this.dtTrigger1.repeat();
      }
    });
  }

  reloadDataTable2() {
    this.diseaseService.getAllDiseases(this.addDiseaseCredentials.diseasegroupId).subscribe(data => {
      if(data) {
        this.dataTable2.dataRows = data.hastalik
        this.dtTrigger2.repeat();
      }
    });
  }

  getAllDiseaseGroups() {
    this.diseaseService.getAllDiseaseGroups().subscribe(data => {
      if(data) {
        this.dataTable1.dataRows = data.hastalikgrup;
        this.dtTrigger1.repeat();
      }
    });
  }

  addDiseaseGroup() {
    if(this.addDiseaseGroupCredentials.name != "") {
      this.diseaseService.addDiseaseGroup(this.addDiseaseGroupCredentials).subscribe(data => {
        if(data) {
          if(data.returncode == 0) {
            $('#addDiseaseGroupModal').modal('hide');
            this.toastr.success('', data.message);   
            this.reloadDataTable1();                         
          } else {
            $('#addDiseaseGroupModal').modal('hide');
            this.toastr.warning('', data.message);      
          }
        }
      });
    } else {
      this.toastr.warning('', 'Eksiksiz bilgi giriniz.');                
    }
  }

  updateDiseaseGroup() {
    if(this.updateDiseaseGroupCredentials.name != null) {
      this.diseaseService.updateDiseaseGroup(this.updateDiseaseGroupCredentials).subscribe(data => {
        if(data) {
          if(data.returncode == 0) {
            $('#updateDiseaseGroupModal').modal('hide');
            this.toastr.success('', data.message);   
            this.reloadDataTable1();
          } else {
            $('#updateDiseaseGroupModal').modal('hide');
            this.toastr.warning('', data.message);
          }
        }
      });
    } else {
      this.toastr.warning('', 'Eksiksiz bilgi giriniz.');                      
    }
  }

  deleteDiseaseGroup() {
    var id = this.updateDiseaseGroupCredentials.id;
    this.diseaseService.deleteDiseaseGroup(id).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          $('#updateDiseaseGroupModal').modal('hide');
          this.toastr.success('', data.message);   
          this.reloadDataTable1();
          this.closeRightPanel();
        } else {
          $('#updateDiseaseGroupModal').modal('hide');
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  search(event) {
    if(event.keyCode == 13) {
      this.diseaseService.searchDiseaseGroups(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable1.dataRows = data.hastalik;
          this.dtTrigger1.repeat();
          this.closeRightPanel();
        }
      });
    }
  }

  getAllDisease(id) {
    this.diseaseService.getAllDiseases(id).subscribe(data => {
      if(data) {
        this.dataTable2.dataRows = data.hastalik;
        this.dtTrigger2.repeat();
      }
    });
  }
  
  addDisease() {
    if(this.addDiseaseCredentials.name != "") {
      this.diseaseService.addDisease(this.addDiseaseCredentials).subscribe(data => {
        if(data) {
          if(data.returncode == 0) {
            $('#addDiseaseModal').modal('hide');
            this.toastr.success('', data.message);   
            this.reloadDataTable2();                         
          } else {
            $('#addDiseaseModal').modal('hide');
            this.toastr.warning('', data.message);      
          }
        }
      });
    } else {
      this.toastr.warning('', 'Eksiksiz bilgi giriniz.');                
    }
  }

  updateDisease() {
    if(this.updateDiseaseCredentials.name != null) {
      this.diseaseService.updateDisease(this.updateDiseaseCredentials).subscribe(data => {
        if(data) {
          if(data.returncode == 0) {
            $('#updateDiseaseModal').modal('hide');
            this.toastr.success('', data.message);   
            this.reloadDataTable2();
          } else {
            $('#updateDiseaseModal').modal('hide');
            this.toastr.warning('', data.message);
          }
        }
      });
    } else {
      this.toastr.warning('', 'Eksiksiz bilgi giriniz.');                            
    }
  }
  
  deleteDisease() {
    var id = this.updateDiseaseCredentials.id;
    this.diseaseService.deleteDisease(id).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          $('#updateDiseaseModal').modal('hide');
          this.toastr.success('', data.message);   
          this.reloadDataTable2();
          this.closeRightPanel();
        } else {
          $('#updateDiseaseModal').modal('hide');
          this.toastr.warning('', data.message);
        }
      }
    });
  }


  //Navigations
  openRightPanel(id) {
    this.diseaseSelected = true;
    this.addDiseaseCredentials.diseasegroupId = id
    this.getAllDisease(id);
  }

  closeRightPanel() {
    this.diseaseSelected = false;
    this.selectedRow = -1;
  }
  
  openDiseaseGroupPanel(param) {    
    this.updateDiseaseGroupCredentials.id = param.hastalikgrupid;
    this.updateDiseaseGroupCredentials.name = param.hastalikgrupadi;
  }

  openDiseasePanel(param) {
    this.updateDiseaseCredentials.id = param.hastalikid;
    this.updateDiseaseCredentials.name = param.hastalikadi; 
    this.updateDiseaseCredentials.diseasegroupId = param.hastalikgrupid;    
  }

  closeModal(param) {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

}
