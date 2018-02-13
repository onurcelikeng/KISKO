import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { PlaceService } from './../../../services/PlaceService/place.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PlaceModel } from '../../../models/PlaceModel';
import { SearchModel } from '../../../models/SearchModel';
import { Observable } from 'rxjs/Observable';
import { PlaceTypeModel } from '../../../models/PlaceTypeModel';
import { PlacetypeService } from '../../../services/PlacetypeService/placetype.service';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { PlaceTypeModelPlaces } from '../../../models/PlaceTypeModelPlaces';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css'],
  providers: [PlaceService, PlacetypeService]
})
export class PlacesComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject();   
  dtOptions: any = {}; 
  dataTable: DataTable = {
    headerRow: [ 'Kurum Adı' ],
    footerRow: [],
    dataRows: []
  };

  updateCredentials: PlaceModel = {
    id: '',
    name: '',
    placeType: '',
    address: ''
  };

  addCredentials: PlaceModel = {
    id: '0',
    name: '',
    placeType: '',
    address: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  place: {};
  placeType: {};
  boxColor: String;
  addSelected: boolean;
  updateSelected: boolean;
  isEditing: boolean;
  placeTypeArray: Array<PlaceTypeModelPlaces> = [];
  selectedPlaceType: PlaceTypeModelPlaces;

  selectedRow : Number;
  setClickedRow : Function;


  constructor(private placeService: PlaceService,
    private toastr: ToastrService,
    private router: Router, 
    private placetypeService: PlacetypeService) {

      this.getPlaceTypes();

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
    this.getPlaces();
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
    this.placeService.getAllPlaces().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.kurum
        this.dtTrigger.repeat();
      }
    });
  }

  emptyAddCredentials() {
    this.addCredentials.id = ''; 
    this.addCredentials.name = '';
    this.updateCredentials.address = '';
    this.updateCredentials.placeType = '';
  }

  compareFn(c1: PlaceTypeModelPlaces, c2: PlaceTypeModelPlaces): boolean {
    return c1 && c2 ? c1.kurumtipiid === c2.kurumtipiid : c1 === c2;
  }

  change(value) {
    console.log(value);
  }

  getPlaceTypes() {
    this.placetypeService.getAllPlaceTypes().subscribe(data => {
      if(data) {
        this.placeTypeArray = data.kurumtipi;
      }
    });
  }

  findPlaceTypeId(placeType) {
    this.placeTypeArray.forEach(element => {
      if(element.kurumtipi == placeType) {
        let model = new PlaceTypeModelPlaces;
        model.kurumtipi = element.kurumtipi;
        model.kurumtipiid = element.kurumtipiid;

        this.selectedPlaceType = model;
        this.placeType = Observable.of({
          kurumtipi: model.kurumtipi,
          kurumtipiid: model.kurumtipiid
        });
      }
    });
  }

  getPlaces() {
    this.emptyAddCredentials();
    this.placeService.getAllPlaces().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.kurum;
        this.dtTrigger.repeat();
      }
    });
  }

  getPlace(id) {
    this.placeService.getPlace(id).subscribe(data => {
      if(data) {  
        this.updateCredentials.id = data.kurum[0].kurumid;
        this.updateCredentials.name = data.kurum[0].kurumadi;
        this.updateCredentials.address = data.kurum[0].adres;
        this.updateCredentials.placeType = data.kurum[0].kurumtipi;        
        this.findPlaceTypeId(data.kurum[0].kurumtipi);      

        this.place = Observable.of({
          id: data.kurum[0].kurumid,
          name: data.kurum[0].kurumadi,
          placeType: data.kurum[0].kurumtipi,
          address: data.kurum[0].adres
        });
      }
    });
  }

  addPlace() {    
    this.addCredentials.placeType = this.selectedPlaceType.kurumtipiid;
    this.placeService.addPlace(this.addCredentials).subscribe(data => {
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

  updatePlace() {
    this.updateCredentials.placeType = this.selectedPlaceType.kurumtipiid;
    this.placeService.updatePlace(this.updateCredentials).subscribe(data => {
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

  async deletePlace(name, id) {
    const result = await swal({
      title: '',
      text: name + " kurumunu silmek  istediğinize emin misiniz?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Evet',
      cancelButtonText: 'Hayır'
      })

      if(result) {
        try {
          this.placeService.deletePlace(id).subscribe(data => {
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
      this.placeService.searchPlace(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.kurum;
          this.dtTrigger.repeat();
        }
      });
    } else {
    }
  }


  //navigations
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
          this.getPlace(id);
        }
      } else {
        this.addSelected = false;
        this.updateSelected = true;
        this.getPlace(id);
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
