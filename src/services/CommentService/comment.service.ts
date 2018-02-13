import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class CommentService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getComments() {
    let url = "http://kisko.net/apiv2/medya_yorum.php";
    let token = sessionStorage.getItem('token');
    let tc = sessionStorage.getItem('tc');
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

  public changeCommentStatus(id, status) {
    let url = "http://kisko.net/apiv2/medya_yorum.php";
    let token = sessionStorage.getItem('token');
    let actionType = 7;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&medyayorumid=' + id +
        '&onay=' + status +
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

  public deleteComment(id) {
    let url = "http://kisko.net/apiv2/medya_yorum.php";
    let token = sessionStorage.getItem('token');
    let actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&medyayorumid=' + id +
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
