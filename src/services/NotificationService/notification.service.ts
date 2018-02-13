import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SendNotificationModel } from '../../models/SendNotificationModel';
import 'rxjs/Rx';

@Injectable()
export class NotificationService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getAllNotificaitons() {
    var url = "http://kisko.net/apiv2/notification_list.php";
    var token = sessionStorage.getItem('token');

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

  public getMyNotifications(start, length) {
    let url = "http://kisko.net/apiv2/notification_list.php";
    let token = sessionStorage.getItem("token");
    let tc = sessionStorage.getItem("tc");
    let groupIds = "[1,2,3,4,5,6, 7]"

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&alici=' + tc +         
        '&start=' + start +
        '&length=' + length +
        '&groupid=' + groupIds
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

  public sendNotification(credentials) {
    var url = "http://kisko.net/apiv2/notification_send.php";
    var token = sessionStorage.getItem("token");

    return Observable.create(observer => {
      let body = (
        'token=' + token + 
        '&tckimlik=' + credentials.tckimlik + 
        '&othertckimlik=' + credentials.othertckimlik + 
        '&title=' + credentials.title + 
        '&message=' + credentials.message +
        '&typeid=' + credentials.typeid +
        '&etkilesimtipiid=' + credentials.messageType
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
