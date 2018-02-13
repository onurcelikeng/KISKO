import { LoginModel } from '../../models/LoginModel';
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public login(credentials) {
    var url = "http://kisko.net/apiv2/user_login.php";

    return Observable.create(observer => {
      let body = (
        'tckimlik=' + credentials.tckimlik + 
        '&password=' + credentials.password + 
        '&deviceid=' + "" + 
        '&playerid=' + credentials.playerid +
        '&logintype=' + credentials.logintype
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

  public logout() {
    var url = "http://kisko.net/apiv2/user_logout.php";
    var token = sessionStorage.getItem("token");

    return Observable.create(observer => {
      let body = (
        'token=' + token
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

  public getMe() {
    var url = "http://kisko.net/apiv2/user_get.php";
    var token = sessionStorage.getItem("token");
    var tc = sessionStorage.getItem("tc");

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&tckimlik=' + tc
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

  public forgotPassword(credentials) {
    var url = "http://kisko.net/apiv2/user_forgotpassword.php";

    return Observable.create(observer => {
      let body = (
        'tckimlik=' + credentials.tckimlik
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

  public changePassword(password) {
    var url = "http://kisko.net/apiv2/user_changepassword.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        'tckimlik=' + tc +
        '&password=' + password
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

  public switchRole(role) {
    var url = "http://kisko.net/apiv2/user_switchrole.php";
    var token = sessionStorage.getItem("token");
    var tc = sessionStorage.getItem("tc");
    var logintype = 'web';

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&tckimlik=' + tc +
        '&logintype=' + logintype +
        '&rolenames=' + role
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
