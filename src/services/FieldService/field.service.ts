import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class FieldService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getFieldTypes() {
    var url = "http://kisko.net/apiv2/doktorsaha.php";
    var token = sessionStorage.getItem('token');
    var actionType = 5;

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

  public getFields(tc) {
    var url = "http://kisko.net/apiv2/doktorsaha.php";
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

  public getField(id) {
    var url = "http://kisko.net/apiv2/doktorsaha.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&doktorsahaid=' + id +
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

  public addField(credentials) {
    var url = "http://kisko.net/apiv2/doktorsaha.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&sahaadi=' + credentials.name +
        '&sahatipi=' + credentials.typeId +
        '&sirano=' + credentials.order +
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

  public updateField(credentials) {
    var url = "http://kisko.net/apiv2/doktorsaha.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&doktorsahaid=' + credentials.id +
        '&sahaadi=' + credentials.name +
        '&sahatipi=' + credentials.typeId +
        '&doktortc=' + tc +
        '&sirano=' + credentials.order +
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

  public deleteField(id) {
    var url = "http://kisko.net/apiv2/doktorsaha.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&doktorsahaid=' + id +
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

  public addPatientField(credentials) {
    var url = "http://kisko.net/apiv2/saha.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&sahaadi=' + credentials.name +
        '&sahatipi=' + credentials.type +
        '&birimi=' + credentials.unit +
        '&boyut=' + credentials.size +
        '&hastatc=' + credentials.hastatc +
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
  
  public isFollow(doctortc, patienttc, sahaid) {
    var url = "http://kisko.net/apiv2/olcumtakip.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&doktortc=' + doctortc +
        '&hastatc=' + patienttc +
        '&sahaid=' + sahaid +
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

  public followField(credentials) {
    var url = "http://kisko.net/apiv2/olcumtakip.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&hastatc=' + credentials.hastatc +
        '&doktortc=' + tc +
        '&sahaid=' + credentials.sahaid +
        '&sure=' + credentials.sure +
        '&suretipi=' + credentials.suretipi +
        '&etkilesimtipiid=' + credentials.etkilesimtipiid +
        '&buyukse=' + credentials.buyukse +
        '&kucukse=' + credentials.kucukse +
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

  public unfollowOlcum(doctortc, patienttc, sahaid) {
    var url = "http://kisko.net/apiv2/olcumtakip.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&doktortc=' + doctortc +
        '&hastatc=' + patienttc +
        '&sahaid=' + sahaid +
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

  public getFieldData(id){
    var url = "http://kisko.net/apiv2/doktorsahaveri.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;
    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&muayeneid=' + id +
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

  public addFieldData(credentials) {
    var url = "http://kisko.net/apiv2/doktorsahaveri.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&muayeneid=' + credentials.muayeneid +
        '&doktortc=' + credentials.doktortc +
        '&sahaid=' + credentials.sahaid +
        '&deger1=' + credentials.deger1 +
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

  public updateFieldData(credentials) {
    var url = "http://kisko.net/apiv2/doktorsahaveri.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&doktorsahaveriid=' + credentials.doktorsahaveriid +
        '&muayeneid=' + credentials.muayeneid +
        '&doktortc=' + credentials.doktortc +
        '&sahaid=' + credentials.sahaid +
        '&deger1=' + credentials.deger1 +
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
