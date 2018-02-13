import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class MediaService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getArticles(doctortc) {
    let url = "http://kisko.net/apiv2/medya.php";
    let token = sessionStorage.getItem('token');
    let actionType = "4";

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&gonderentc=' + doctortc +
        '&medyatipiid=' + "1" + 
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

  public getArticle(id) {
    let url = "http://kisko.net/apiv2/medya.php";
    let token = sessionStorage.getItem('token');
    let actionType = "4";

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&medyaid=' + id +
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

  public uploadArticle(credentials, file) {
    var url = "http://kisko.net/apiv2/medya.php";
    var token = sessionStorage.getItem('token');
    var actionType = "1";

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.delete('Content-Type');

    return Observable.create(observer => {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('medya', file, file.name);
      formData.append('baslik', credentials.baslik);
      formData.append('aciklama', credentials.aciklama);
      formData.append('gonderentc', credentials.gonderentc);
      formData.append('medyatipiid', credentials.medyatipiid);
      formData.append('action', actionType);

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

  public deleteArticle(id) {
    let url = "http://kisko.net/apiv2/medya.php";
    let token = sessionStorage.getItem('token');
    let actionType = "3";

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&medyaid=' + id +
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


  public getVideos(doctortc) {
    let url = "http://kisko.net/apiv2/medya.php";
    let token = sessionStorage.getItem('token');
    let actionType = "4";

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&gonderentc=' + doctortc +
        '&medyatipiid=' + "2" + 
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
  
  public uploadVideo(credentials) {
    let url = "http://kisko.net/apiv2/medya.php";
    let token = sessionStorage.getItem('token');
    let actionType = "1";

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&gonderentc=' + credentials.gonderentc +
        '&medyatipiid=' + credentials.medyatipiid +
        '&baslik=' + credentials.baslik +
        '&aciklama=' + credentials.aciklama +
        '&medya=' + credentials.medya + 
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

  public deleteVideo(id) {
    let url = "http://kisko.net/apiv2/medya.php";
    let token = sessionStorage.getItem('token');
    let actionType = "3";

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&medyaid=' + id +
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
