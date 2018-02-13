import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AppointmentService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getEvents() {
    var url = "http://kisko.net/apiv2/user_login.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 4;

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

  public getAppointmentTypes(doctorTc) {
    var url = "http://kisko.net/apiv2/randevutipi.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
        let body = (
        'token=' + token +
        '&doktortc=' + doctorTc +
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

  public getAppointmentType(id) {
    var url = "http://kisko.net/apiv2/randevutipi.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
        let body = (
        'token=' + token +
        '&randevutipiid=' + id +
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
  
  public addAppointmentType(credentials) {
    var url = "http://kisko.net/apiv2/randevutipi.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
        let body = (
          'token=' + token +
          '&doktortc=' + credentials.doktortc +
          '&isim=' + credentials.isim +
          '&sure=' + credentials.sure +
          '&renk=' + credentials.renk +
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

  public updateAppointmentType(credentials) {
    var url = "http://kisko.net/apiv2/randevutipi.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
        let body = (
          'token=' + token +
          '&randevutipiid=' + credentials.randevutipiid +
          '&doktortc=' + credentials.doktortc +
          '&isim=' + credentials.isim +
          '&sure=' + credentials.sure +
          '&renk=' + credentials.renk +
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

  public deleteAppointmentType(id) {
    var url = "http://kisko.net/apiv2/randevutipi.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
        let body = (
        'token=' + token +
        '&randevutipiid=' + id +
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

  public getAppointmentTypeColors() {
    var url = "http://kisko.net/apiv2/randevutipi.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
        let body = (
        'token=' + token +
        '&renk=' + '1' +
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

}
