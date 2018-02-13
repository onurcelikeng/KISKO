import { Component, OnInit } from '@angular/core';
import { FieldService } from '../../../services/FieldService/field.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { SahaTypeModel } from '../../../models/SahaTypeModel';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
  providers: [ FieldService ]
})
export class FieldComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [],
    dataRows: []
  };

  addCredentials = {
    name: '',
    typeId: '',
    order: ''
  };

  updateCredentials = {
    id: '',
    name: '',
    fieldType: '',
    order: ''
  };

  boxColor: string;
  isUpdateSelected: boolean;
  isAddSelected: boolean;
  selectedFieldId: string;

  field: {};
  selectedRow : Number;
  setClickedRow : Function;

  fieldType: {};
  fieldTypes: Array<SahaTypeModel> = [];
  selectedFieldType: SahaTypeModel;

  orderTypes = ["1", "2", "3", "4", "6", "7", "8", "9", "10", "11", "12"];
  orderType: string = "1";
  selectedOrderType: string;


  constructor(private fieldService: FieldService,
    private router: Router,
    private toastr: ToastrService) {
      this.setClickedRow = function(index){
        this.selectedRow = index;
      }
  }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getFields();
    this.getFieldTypes();
  }

  configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.isUpdateSelected = false;
    this.isAddSelected = false;
  }

  getFieldTypes():void {
    this.fieldService.getFieldTypes().subscribe(data => {
      if(data.returncode == 0) {
        this.fieldTypes = data.doktorsaha;
      }
    });
  }

  findFieldTypeId(fieldType) {
    this.fieldTypes.forEach(element => {
      if(element.sahatipi == fieldType) {
        let model = new SahaTypeModel;
        model.sahatipi = element.sahatipi;
        model.sahatipiid = element.sahatipiid;

        this.selectedFieldType = model;
        this.fieldType = Observable.of({
          sahatipiid: model.sahatipiid,
          sahatipi: model.sahatipi
        });
      }
    });
  }

  getFields(): void {
    let tc = sessionStorage.getItem('tc');
    this.fieldService.getFields(tc).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.dataTable.dataRows = data.doktorsaha;
          this.dtTrigger.repeat();
        } else {

        }
      }
    });
  }

  getField(id): void {
    this.fieldService.getField(id).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.updateCredentials.id = data.doktorsaha[0].doktorsahaid;
          this.updateCredentials.name = data.doktorsaha[0].sahaadi;
          this.updateCredentials.fieldType = data.doktorsaha[0].sahatipi;
          this.updateCredentials.order = data.doktorsaha[0].sirano;
          this.findFieldTypeId(data.doktorsaha[0].sahatipi);
          this.orderType = this.updateCredentials.order;

          this.field = Observable.of({
            id: data.doktorsaha[0].doktorsahaid,
            name: data.doktorsaha[0].sahaadi,
            fieldType: data.doktorsaha[0].sahatipi,
            order: data.doktorsaha[0].sirano
          });
        }
      }
    });
  }

  addField(): void {
    this.addCredentials.order = this.orderType;
    this.addCredentials.typeId = this.selectedFieldType.sahatipiid;
    this.fieldService.addField(this.addCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
          this.getFields();
          this.addCredentials.name = '';
          this.addCredentials.typeId = '';
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  updateField(): void {
    this.updateCredentials.fieldType = this.selectedFieldType.sahatipiid;
    this.fieldService.updateField(this.updateCredentials).subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          this.toastr.success('', data.message);
          this.getFields();
        } else {
          this.toastr.warning('', data.message);
        }
      }
    });
  }

  deleteField(): void {
    this.fieldService.deleteField(this.selectedFieldId).subscribe(data => {
      if(data.returncode == 0) {
        this.closeRightPanel();
        this.getFields();
        this.toastr.success('', data.message);
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  change(value) {
    //console.log(value);
  }

  public compareFn(c1: SahaTypeModel, c2: SahaTypeModel): boolean {
    return c1 && c2 ? c1.sahatipiid === c2.sahatipiid : c1 === c2;
  }

  public compareFn2(c1: String, c2: String): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  //navigations
  public openAddPanel(): void {
    this.isAddSelected = true;
    this.isUpdateSelected = false;
  }

  public openUpdatePanel(id): void {
    this.selectedFieldId = id;
    this.isAddSelected = false;
    this.isUpdateSelected = true;
    this.getField(id);
  }

  public closeRightPanel(): void {
    this.isAddSelected = false;
    this.isUpdateSelected = false;
    this.selectedRow = -1;
  }

  public async deleteRequest() {
    const result = await swal({
    title: '',
    text: "Eğer sahayı silerseniz hastalarınızda bu sahaya ait verileri kaybetmiş olursunuz. Devam etmek istiyor musunuz?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        this.deleteField();
      } catch (err){
      }
    }
  }

}
