import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SecretaryService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getDoctors(secretaryTc) {
    var url = "http://kisko.net/apiv2/doktorsekreter.php";
    var token = sessionStorage.getItem("token");
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&sekretertc=' + secretaryTc +
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

  public changeDoctor(doctorTc) {
    var url = "http://kisko.net/apiv2/doktorsekreter.php";
    var token = sessionStorage.getItem("token");
    var tc = sessionStorage.getItem("tc");
    var actionType = 5;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctorTc +
        '&sekretertc=' + tc +
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

  public getSecretary(doctorTc) {
    var url = "http://kisko.net/apiv2/doktorsekreter.php";
    var token = sessionStorage.getItem("token");
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

  public getDoctor(secreterTc) {
    var url = "http://kisko.net/apiv2/doktorsekreter.php";
    var token = sessionStorage.getItem("token");
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&sekretertc=' + secreterTc +
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

  public addSecretary(credentials) {
    let url = "http://kisko.net/apiv2/doktorsekreter.php";
    let token = sessionStorage.getItem("token");
    let actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&sekretertc=' + credentials.sekretertc +
        '&doktortc=' + credentials.doktortc +
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

  public deleteSecretary(credentials) {
    let url = "http://kisko.net/apiv2/doktorsekreter.php";
    let token = sessionStorage.getItem("token");
    let actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&sekretertc=' + credentials.sekretertc +
        '&doktortc=' + credentials.doktortc +
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
