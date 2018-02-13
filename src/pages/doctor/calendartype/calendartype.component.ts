import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../services/AppointmentService/appointment.service';
import { Subject } from 'rxjs';
import { SahaTypeModel } from '../../../models/SahaTypeModel';
import { ColorModel } from '../../../models/ColorModel';
import { ToastrService } from 'ngx-toastr';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-calendartype',
  templateUrl: './calendartype.component.html',
  styleUrls: ['./calendartype.component.css'],
  providers: [AppointmentService]
})
export class CalendartypeComponent implements OnInit {
  boxColor: string;
  currentDoctor: string;

  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [],
    dataRows: []
  };
  
  timeTypes = ["15", "30", "45", "60", "120", "240", "1440"];
  selectedTimeType: string = this.timeTypes[0];

  colorType: {};
  colorTypes: Array<ColorModel> = [];
  selectedColorType: ColorModel;

  isAddedSelected: boolean;
  isUpdatedSelected: boolean;

  credetials = {
    doktortc: '',
    isim: '',
    sure: '',
    renk: ''
  };


  constructor(private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private router: Router) { }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 

    this.configure();
    this.getAppointmentTypeColors();
    this.getAppointmentTypes();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currentDoctor = sessionStorage.getItem('tc');

    this.isAddedSelected = false;
  }

  public getAppointmentTypeColors(): void {
    this.appointmentService.getAppointmentTypeColors().subscribe(data => {
      if(data.returncode == 0) {
        this.colorTypes = data.randevutipi;
      }
    })
  }

  public getAppointmentTypes(): void {
    this.appointmentService.getAppointmentTypes(this.currentDoctor).subscribe(data => {
      if(data.returncode == 0) {
        this.dataTable.dataRows = data.randevutipi;
      } else {
        this.dataTable.dataRows = { headerRow: [], dataRows: [] };
      }
    })
  }

  public addAppointmentType():void {
    this.credetials.doktortc = this.currentDoctor;
    this.credetials.sure = this.selectedTimeType;

    this.appointmentService.addAppointmentType(this.credetials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getAppointmentTypes();
      } else {
        this.toastr.warning('', data.message);
      }
    })
  }

  public async deleteAppointmentType(id) {
    this.appointmentService.deleteAppointmentType(id).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getAppointmentTypes();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public selectColor(param): void {
    for(let item of this.colorTypes) {
      if(item.renkadi == param) {
        this.credetials.renk = item.renkid;
      }
    }
  }


  //Navigations
  public openRightPanel(param): void {
    if(param == "add") {
      this.isAddedSelected = true;
    } else if(param == "close") {
      this.isUpdatedSelected = true;
    }
  }

  public closeRightPanel(param): void {
    if(param == "add") {
      this.isAddedSelected = false;
    } else if(param == "close") {
      this.isUpdatedSelected = false;
    }
  }  

  public async deleteRequest(id) {
    const result = await swal({
    title: '',
    text: "Randevu türünü silmek istediğinize emin misiniz?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        await this.deleteAppointmentType(id);
      } catch (err){
      }
    }
  }

}
