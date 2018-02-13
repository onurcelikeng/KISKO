import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { PlacetypeService } from './../../../services/PlacetypeService/placetype.service';
import { Subject } from 'rxjs';
import { PlaceTypeModel } from '../../../models/PlaceTypeModel';
import { SearchModel } from '../../../models/SearchModel';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-placetype',
  templateUrl: './placetype.component.html',
  styleUrls: ['./placetype.component.css'],
  providers: [PlacetypeService]
})
export class PlacetypeComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [ 'Kurum Tipi Adı'],
    footerRow: [],
    dataRows: []
  };

  updateCredentials: PlaceTypeModel = {
    id: '',
    name: ''
  };

  addCredentials: PlaceTypeModel = {
    id: '0',
    name: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  placeType: {};
  boxColor: String;
  addSelected: boolean;
  updateSelected: boolean;
  isEditing: boolean;

  selectedRow : Number;
  setClickedRow : Function;

  constructor(private placetypeService: PlacetypeService,
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
    this.getPlaceTypes();
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
    this.placetypeService.getAllPlaceTypes().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.kurumtipi
        this.dtTrigger.repeat();
      }
    });
  }

  emptyAddCredentials() {
    this.addCredentials.id = ''; 
    this.addCredentials.name = '';
  }

  getPlaceTypes() {
    this.placetypeService.getAllPlaceTypes().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.kurumtipi;
        this.dtTrigger.next();
      }
    });
  }

  getPlaceType(id) {
    this.emptyAddCredentials();

    this.placetypeService.getPlaceType(id).subscribe(data => {
      if(data) {
        this.updateCredentials.id = data.kurumtipi[0].kurumtipiid; 
        this.updateCredentials.name = data.kurumtipi[0].kurumtipi; 
      
        this.placeType = Observable.of({
          id: data.kurumtipi[0].kurumtipiid,
          name: data.kurumtipi[0].kurumtipi
        }).delay(100);
      }
    });
  }

  addPlaceType() {
    this.placetypeService.addPlaceType(this.addCredentials).subscribe(data => {
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

  updatePlaceType() {
    this.placetypeService.updatePlaceType(this.updateCredentials).subscribe(data => {
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

  async deletePlaceType(name, id) {
    const result = await swal({
      title: '',
      text: name + " kurum tipini silmek  istediğinize emin misiniz?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır'
      })

      if(result) {
        try {
          this.placetypeService.deletePlaceType(id).subscribe(data => {
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
      this.placetypeService.searchPlaceType(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.kurumtipi
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
          this.getPlaceType(id);}
        } else {
          this.addSelected = false;
          this.updateSelected = true;
          this.getPlaceType(id);
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
          this.updateSelected = false;this.isEditing = false;
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
