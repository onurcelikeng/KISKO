import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class QuestionService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getAllQuestions() {
    var url = "http://kisko.net/apiv2/soruyanit.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&yanitlayantc=' + tc +
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

  public getUnAnswaredAllQuestions(doctortc, durum) {
    var url = "http://kisko.net/apiv2/soruyanit.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&yanitlayantc=' + doctortc +
        '&durum=' + durum +
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
  
  public answertoQuestion(credential) {
    var url = "http://kisko.net/apiv2/soruyanit.php";
    var token = sessionStorage.getItem('token');
    var actionType = 6;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&soruyanitid=' + credential.soruyanitid +
        '&yanit=' + credential.yanit +        
        '&yanitlayantc=' + credential.yanitlayantc +
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
