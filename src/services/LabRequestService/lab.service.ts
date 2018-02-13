import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LabRequestService {
  private headers: Headers;


  constructor(public _http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }



  public getLabRequestAll() {
    var url = "http://kisko.net/apiv2/lab_istek.php";
    var token = sessionStorage.getItem('token');
    var onaylayantc = sessionStorage.getItem('tc');
    var actionType = 4;

    let sonuc = Observable.create(observer => {
      let body = ('token=' + token + '&action=' + actionType + '&onaylayantc=' + onaylayantc);
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(

        data => {
          observer.next(data);
          observer.complete();
        },

        err => {
          console.log(err);
        });
    })
    return sonuc;
  }


  public updateLabRequest(labistekid, durum, aciklama, onaylayantc) {
    var url = "http://kisko.net/apiv2/lab_istek.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;
    let sonuc = Observable.create(observer => {
      let body = ('token=' + token + '&action=' + actionType + '&labistekid=' + labistekid + "&aciklama=" + aciklama + "&durum=" + durum + "&onaylayantc=" + onaylayantc);      
      let options = new RequestOptions({ headers: this.headers });
      this._http.post(url, body, options).map(res => res.json()).subscribe(

        data => {
          observer.next(data);
          observer.complete();
        },

        err => {
          console.log(err);
        });
    })
    return sonuc;
  }

  uploadLabresults(file, hastatc, labistekid) {
    var url = "http://kisko.net/apiv2/belge.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;
    var baslik = "LabSonuc";
    var aciklama = "LabSonuc belge yükleme";
    var belgetipi = "1";
    var islemtipi = "4";

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');

    return Observable.create(observer => {
      const formData = new FormData();
      formData.append('belge', file, file.name);
      formData.append('action', actionType.toString());
      formData.append('token', token);
      formData.append('hastatc', hastatc);
      formData.append('islemid', labistekid);
      formData.append('baslik', baslik);
      formData.append('aciklama', aciklama);
      formData.append('belgetipi', belgetipi);
      formData.append('islemtipi', islemtipi);

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
