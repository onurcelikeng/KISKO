import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/UserService/user.service';
import { Observable } from 'rxjs/Observable';
import { DoctorService } from '../../../services/DoctorService/doctor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css'],
  providers: [DoctorService]
})
export class PromotionComponent implements OnInit {
  boxColor: string;
  currenDoctor: string;

  public datePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Bugün',
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    showClearDateBtn: true,
    sunHighlight: true,
    inline: false
  };

  //Observable Objects
  doctor: {};
  doctorUrl: string;

  credentials= {
    doktortc: '',
    eposta: '',
    website: '',
    tel1: '',
    tel2: '',
    tel3: '',
    tag: '',
    adres: '',
    unvan: '',
    uzmanlikkurumu: '',
    mezuniyetkurumu: '',
    aciklama: '',
    uzmanliktarihi: {},
    mezuniyettarihi: {},
    diplomabelgeid: '',
    bransid: ''
  };

  
  constructor(private doctorService: DoctorService,
    private toastr: ToastrService,
    private router: Router) { }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getDoctorInfo();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currenDoctor = sessionStorage.getItem('tc');
  }

  public getDoctorInfo(): void {
    this.doctorService.getDoctor(this.currenDoctor).subscribe(data => {
      if(data.returncode == 0) {
        this.doctor = Observable.of({
          aciklama: data.doktor[0].aciklama,
          adres: data.doktor[0].adres,
          bransadi: data.doktor[0].bransadi,
          bransid: data.doktor[0].bransid,
          diplomabelgeid: data.doktor[0].diplomabelgeid,
          doktortc: data.doktor[0].doktortc,
          eposta: data.doktor[0].eposta,
          fotourl: data.doktor[0].fotourl,
          gender: data.doktor[0].gender,
          mezuniyetkurumu: data.doktor[0].mezuniyetkurumu,
          mezuniyettarihi: { date: data.doktor[0].mezuniyettarihi },
          name: data.doktor[0].name,
          surname: data.doktor[0].surname,
          unvan: data.doktor[0].unvan,
          tag: data.doktor[0].tag,
          tel1: data.doktor[0].tel1,
          tel2: data.doktor[0].tel2,
          tel3: data.doktor[0].tel3,
          uzmanlikkurumu: data.doktor[0].uzmanlikkurumu,
          uzmanliktarihi: { date: data.doktor[0].uzmanliktarihi },
          website: data.doktor[0].website
        }).delay(100);

        this.credentials = {
          doktortc: data.doktor[0].doktortc,
          eposta: data.doktor[0].eposta,
          website: data.doktor[0].website,
          tel1: data.doktor[0].tel1,
          tel2: data.doktor[0].tel2,
          tel3: data.doktor[0].tel3,
          tag: data.doktor[0].tag,
          adres: data.doktor[0].adres,
          unvan: data.doktor[0].unvan,
          uzmanlikkurumu: data.doktor[0].uzmanlikkurumu,
          mezuniyetkurumu: data.doktor[0].mezuniyetkurumu,
          aciklama: data.doktor[0].aciklama,
          uzmanliktarihi: { date: data.doktor[0].uzmanliktarihi },
          mezuniyettarihi: { date: data.doktor[0].mezuniyettarihi },
          diplomabelgeid: data.doktor[0].diplomabelgeid,
          bransid: data.doktor[0].bransid
        };

        this.doctorUrl = "http://kisko.net/" + this.credentials.tag;

      }
    });
  }

  public updateDoctorInfo(): void {    
    console.log(this.credentials.mezuniyettarihi["formatted"]);

    this.doctorService.updateDoctorSelf(this.credentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
      } else {
        this.toastr.warning('', data.message);
      }
    })
  }

}
