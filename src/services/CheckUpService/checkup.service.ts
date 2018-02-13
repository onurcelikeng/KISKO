import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class CheckupService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getCheckUps() {
    var url = "http://kisko.net/apiv2/checkup.php";
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

  public addCheckup(credentials) {
    var url = "http://kisko.net/apiv2/checkup.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&kurumid=' + credentials.price +
        '&checkupadi=' + credentials.name +
        '&ucret=' + credentials.price +
        '&birimi=' + credentials.unit +
        '&aciklama=' + credentials.description +
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

  public updateCheckup(credentials) {
    var url = "http://kisko.net/apiv2/checkup.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&checkupid=' + credentials.id +
        '&kurumid=' + credentials.price +
        '&checkupadi=' + credentials.name +
        '&ucret=' + credentials.price +
        '&birimi=' + credentials.unit +
        '&aciklama=' + credentials.description +
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

  public deleteCheckUp(id) {
    var url = "http://kisko.net/apiv2/checkup.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&checkupid=' + id +
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

  public getCheckUpExaminations(id) {
    var url = "http://kisko.net/apiv2/checkup_tetkik.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&checkupid=' + id +
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
