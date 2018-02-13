import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BranchService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getAllBranchs() {
    var url = "http://kisko.net/apiv2/brans.php";
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

  public getBranch(id) {
    var url = "http://kisko.net/apiv2/brans.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&bransid=' + id +
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

  public addBranch(credentials) {
    var url = "http://kisko.net/apiv2/brans.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&bransadi=' + credentials.name +
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

  public updateBranch(credentials) {
    var url = "http://kisko.net/apiv2/brans.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&bransid=' + credentials.id +
        '&bransadi=' + credentials.name +
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

  public deleteBranch(id) {
    var url = "http://kisko.net/apiv2/brans.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&bransid=' + id +
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

  public searchBranch(param) {
    var url = "http://kisko.net/apiv2/brans.php";
    var token = sessionStorage.getItem('token');
    var actionType = 5;
    console.log(param);
    
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

}
