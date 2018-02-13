import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class DoctorService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getDoctors() {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&action=' + actionType
      );
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

  public getDoctor(tc) {
    let url = "http://kisko.net/apiv2/doktor.php";
    let token = sessionStorage.getItem('token');
    let actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + tc +
        '&action=' + actionType
      );
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

  public addDoctor(credentials) {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + credentials.tc +
        '&eposta=' + credentials.email +
        '&website=' + credentials.website +
        '&uzmanlikkurumu=' + credentials.uzmanlikkurumu +
        '&mezuniyetkurumu=' + credentials.mezuniyetkurumu +        
        '&aciklama=' + credentials.aciklama +
        '&uzmanliktarihi=' + credentials.uzmanliktarihi +
        '&mezuniyettarihi=' + credentials.mezuniyettarihi +    
        '&diplomabelgeid=' + credentials.diplomabelgeid +
        '&bransid=' + credentials.bransid +        
        '&kurumid=' + credentials.kurumid +
        '&surname=' + credentials.surname +
        '&name=' + credentials.name +    
        '&action=' + actionType
      );
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

  public updateDoctor(credentials) {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + credentials.tc +
        '&eposta=' + credentials.email +
        '&website=' + credentials.website +
        '&uzmanlikkurumu=' + credentials.uzmanlikkurumu +
        '&mezuniyetkurumu=' + credentials.mezuniyetkurumu +        
        '&aciklama=' + credentials.aciklama +
        '&uzmanliktarihi=' + credentials.uzmanliktarihi +
        '&mezuniyettarihi=' + credentials.mezuniyettarihi +    
        '&diplomabelgeid=' + credentials.diplomabelgeid +
        '&bransid=' + credentials.bransid +        
        '&kurumid=' + credentials.kurumid +
        '&surname=' + credentials.surname +
        '&name=' + credentials.name +    
        '&action=' + actionType
      );
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

  public deleteDoctor(doctortc) {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctortc +
        '&action=' + actionType
      );
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

  public searchDoctor(param) {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = 5;
    
    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&ara=' + param +
        '&action=' + actionType
      );
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            console.log(data);
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

  public uploadDoctorPhoto(file, tc) {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = "6";

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.delete('Content-Type');

    return Observable.create(observer => {
      const formData = new FormData();
      formData.append('foto', file, file.name);
      formData.append('token', token);
      formData.append('action', actionType);
      formData.append('doktortc', tc);
      let body = formData;
      let options = new RequestOptions({ headers: headers });

      this._http.post(url, body, options).map(res => res.json()).subscribe(
        data=>{
          observer.next(data);
          observer.complete();
        },
        err=>{console.log(err);
      });
    });
  }

  public updateDoctorSelf(credentials) {
    var url = "http://kisko.net/apiv2/doktor.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + credentials.doktortc +
        '&eposta=' + credentials.eposta +
        '&website=' + credentials.website +
        '&tel1=' + credentials.tel1 +
        '&tel2=' + credentials.tel2 +
        '&tel3=' + credentials.tel3 +
        '&tag=' + credentials.tag +
        '&adres=' + credentials.adres +
        '&unvan=' + credentials.unvan +
        '&uzmanlikkurumu=' + credentials.uzmanlikkurumu +
        '&mezuniyetkurumu=' + credentials.mezuniyetkurumu +        
        '&aciklama=' + credentials.aciklama +
        '&uzmanliktarihi=' + credentials.uzmanliktarihi.date +
        '&mezuniyettarihi=' + credentials.mezuniyettarihi.date +    
        '&diplomabelgeid=' + credentials.diplomabelgeid +
        '&bransid=' + credentials.bransid +
        '&action=' + actionType
      );
      console.log(body);

      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(
          data=>{
            observer.next(data);
            observer.complete();
          },
          err=>{console.log(err);
        });
    });
  }

}
