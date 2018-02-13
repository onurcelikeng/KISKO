import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CalendarService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getEvents(tc) {
    var url = "http://kisko.net/apiv2/randevu.php";
    var token = sessionStorage.getItem('token');
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

  public getEvent(id) {
    var url = "http://kisko.net/apiv2/randevu.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&randevuid=' + id +
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

  public getDayEvents(tc, date) {
    var url = "http://kisko.net/apiv2/randevu.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + tc +
        '&baslangictarih=' + date + ' 00:00' +
        '&bitistarih=' + date + ' 23:59' +
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

  public addEvent(credentials) {
    var url = "http://kisko.net/apiv2/randevu.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + credentials.doktortc +
        '&kayityapantc=' + credentials.kayityapantc +
        '&baslangictarih=' + credentials.baslangictarih +
        '&bitistarih=' + credentials.bitistarih +
        '&randevutipi=' + credentials.randevutipi +
        '&aciklama=' + credentials.aciklama +
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

  public updateEvent(credentials) {
    let url = "http://kisko.net/apiv2/randevu.php";
    let token = sessionStorage.getItem('token');
    let actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&randevuid=' + credentials.randevuid +
        '&doktortc=' + credentials.doktortc +
        '&kayityapantc=' + credentials.kayityapantc +
        '&baslangictarih=' + credentials.baslangictarih +
        '&bitistarih=' + credentials.bitistarih +
        '&randevutipi=' + credentials.randevutipi +
        '&aciklama=' + credentials.aciklama +
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

  public updateEventDate(id, start, finish) {
    var url = "http://kisko.net/apiv2/randevu.php";
    var token = sessionStorage.getItem('token');
    var actionType = 6;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&randevuid=' + id +
        '&baslangictarih=' + start +
        '&bitistarih=' + finish +
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

  public deleteEvent(id) {
    var url = "http://kisko.net/apiv2/randevu.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&randevuid=' + id +
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
