import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  private headers: Headers;
  private token: string;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
    this.token = sessionStorage.getItem("token");
  }


  public getUsers() {
    var url = "http://kisko.net/apiv2/user_get.php";
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

  public getUser(tc) {
    var url = "http://kisko.net/apiv2/user_get.php";
    var token = sessionStorage.getItem("token");

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

  public changePassword(credentials) {
    var url = "http://kisko.net/apiv2/user_changepassword.php";

    return Observable.create(observer => {
      let body = (
        'token=' + this.token + 
        '&tckimlik=' + credentials.tc + 
        '&oldpassword=' + credentials.oldPassword + 
        '&newpassword=' + credentials.newPassword
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

  public deleteUser(tc) {
    var url = "http://kisko.net/apiv2/user_delete.php";
    var token = sessionStorage.getItem("token");

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

  public updateUser(credentials) {
    let url = "http://kisko.net/apiv2/user_update.php";
    let token = sessionStorage.getItem("token");

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&tckimlik=' + credentials.tckimlik + 
        '&name=' + credentials.name +
        '&surname=' + credentials.surname + 
        '&email=' + credentials.email + 
        '&birthdate=' + credentials.birthdate +
        '&birthplace=' + credentials.birthplace + 
        '&country=' + credentials.country +
        '&city=' + credentials.city +
        '&address=' + credentials.address +
        '&cellphone=' + credentials.cellphone +
        '&homephone=' + credentials.homephone +
        '&gender=' + credentials.gender +
        '&meslek=' + credentials.meslek
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

  public uploadImage(formData) {
    var url = "http://kisko.net/apiv2/user_photoupload";
    var token = sessionStorage.getItem("token");
    
  }

  public changeUserRoles(tc, roles) {
    var url = "http://kisko.net/apiv2/user_setrole.php";
    var token = sessionStorage.getItem("token");

    console.log(roles);
    console.log(tc);

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&tckimlik=' + tc +
        '&rolenames=' + roles
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

  public searchUser(param) {
    var url = "http://kisko.net/apiv2/user_search.php";
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

  public uploadUserPhoto(file, tc) {
    var url = "http://kisko.net/apiv2/user_photoupload.php";
    var token = sessionStorage.getItem('token');
    var actionType = 5;

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.delete('Content-Type');

    return Observable.create(observer => {
      const formData = new FormData();
      formData.append('photo', file, file.name);
      formData.append('token', token);
      formData.append('tckimlik', tc);
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
  
}
