import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class ChatService {
  private headers: Headers;

  
  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getChats(gonderen, alici) {
    let url = "http://kisko.net/apiv2/notification_list.php";
    var token = sessionStorage.getItem('token');
    let typeId = 7;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&alicitc=' + alici +
        '&gonderentc=' + gonderen +
        '&typeid=' + typeId
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

  public sendMessage(message, gonderen, alici) {
    let url = "http://kisko.net/apiv2/notification_send.php";
    var token = sessionStorage.getItem('token');
    let typeId = 7;
    let etkilesimtipiid = 2;
    let title = "Kisko Chat";
    console.log(alici);
    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&othertckimlik=[' + alici + ']' +
        '&tckimlik=' + gonderen +
        '&message=' + message +
        '&title=' + title +
        '&typeid=' + typeId +
        '&etkilesimtipiid=' + etkilesimtipiid
      );
      console.log(body);
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
