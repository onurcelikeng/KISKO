import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class PatientService {
  private headers: Headers;


  constructor(public _http: Http) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Accept', 'application/json');
  }


  public getDoctorPatients(doctortc, orderType, type) {
    var saha = "";
    if(type == "1") {
      saha = "name";
    } else if(type == "2") {
      saha = "surname";
    } else if(type == "3") {
      saha = "tarih"
    };

    var siralamatipi = "";
    if(orderType == 'a') {
      siralamatipi = "asc";
    } else if(orderType == 'd') {
      siralamatipi = "desc";
    }

    var url = "http://kisko.net/apiv2/doktorhasta.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctortc +
        '&action=' + actionType + 
        '&saha=' + saha +
        '&siralamatipi=' + siralamatipi
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

  public getPatientVisits(hastatc, isDoctor, start, length) {
    var url = "http://kisko.net/apiv2/vizit.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 4;

    return Observable.create(observer => {
      var body: any;
      if(isDoctor) {
        body = (
          'token=' + token +
          '&hastatc=' + hastatc +
          '&doktortc=' + tc +
          '&action=' + actionType + 
          '&start=' + start +
          '&length=' + length
        );
      } else {
        body = (
          'token=' + token +
          '&hastatc=' + hastatc +
          '&action=' + actionType +
          '&start=' + start +
          '&length=' + length
        );
      }
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

  public getMuayeneDetail(id) {
    var url = "http://kisko.net/apiv2/muayene.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&muayeneid=' + id +
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

  public addPatient(hastatc) {
    var url = "http://kisko.net/apiv2/doktorhasta.php";
    var token = sessionStorage.getItem('token');
    var doctortc = sessionStorage.getItem('tc');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctortc +
        '&hastatc=' + hastatc +
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

  public addNewPatient(credentials) {
    var url = "http://kisko.net/apiv2/doktorhasta.php";
    var token = sessionStorage.getItem('token');
    var doctortc = sessionStorage.getItem('tc');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctortc +
        '&hastatc=' + credentials.tc + 
        '&name=' + credentials.name +
        '&surname=' + credentials.surname +
        '&birthdate=' + credentials.birthdate +       
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

  public searchPatients(doctortc, param) {
    var url = "http://kisko.net/apiv2/doktorhasta.php";
    var token = sessionStorage.getItem('token');
    var actionType = 5;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctortc +
        '&action=' + actionType +
        '&ara=' + param
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

  public searchPatient(doctortc, patienttc) {
    var url = "http://kisko.net/apiv2/doktorhasta.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + doctortc +
        '&hastatc=' + patienttc +
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

  public addManuelVisit(credentials) {
    var url = "http://kisko.net/apiv2/manuel_vizit.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&aciklama=' + credentials.description +
        '&tarih=' + credentials.date +
        '&doktor=' + credentials.doctor +
        '&kurum=' + credentials.place +
        '&hastatc=' + credentials.patientTc +
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

  public deleteManuelVisit(id) {
    var url = "http://kisko.net/apiv2/manuel_vizit.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&manuelvizitid=' + id +
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

  public updateManuelVisit(credentials, visitId) {
    var url = "http://kisko.net/apiv2/manuel_vizit.php";
    var token = sessionStorage.getItem('token');
    var actionType = 2;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&aciklama=' + credentials.description +
        '&tarih=' + credentials.date +
        '&doktor=' + credentials.doctor +
        '&kurum=' + credentials.place +
        '&hastatc=' + credentials.patientTc +
        '&manuelvizitid=' + visitId +
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

  public getLabRequests(muayeneId) {
    var url = "http://kisko.net/apiv2/lab_istek.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&muayeneid=' + muayeneId +
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

  public addMuayene(credentials) {
    var url = "http://kisko.net/apiv2/muayene.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;
    console.log(credentials);

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&doktortc=' + credentials.doctortc +
        '&hastatc=' + credentials.hastatc +
        '&tarih=' + credentials.date +
        '&oyku=' + credentials.oyku +
        '&bulgular=' + credentials.bulgu +
        '&tani=' + credentials.tani +
        '&yakinma=' + credentials.yakinma +
        '&aciklama=' + credentials.notlar +
        '&sonuc=' + credentials.sonuc +
        '&belgeid=' + credentials.docId +
        '&muayenetipi=' + credentials.muayeneType +
        '&kontrol=' + credentials.kontrolnotlari +
        '&kontroltarihi=' + credentials.kontrolTarihi +
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

  public updateMuayene(credentials) {
    var url = "http://kisko.net/apiv2/muayene.php";
    var token = sessionStorage.getItem('token');
    var tc = sessionStorage.getItem('tc');
    var actionType = 2;
      console.log(credentials);
    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&muayeneid=' + credentials.muayeneid + 
        '&doktortc=' + tc +
        '&hastatc=' + credentials.hastatc +
        '&tarih=' + credentials.date +
        '&oyku=' + credentials.oyku +
        '&bulgular=' + credentials.bulgu +
        '&tani=' + credentials.tani +
        '&yakinma=' + credentials.yakinma +
        '&aciklama=' + credentials.notlar +
        '&sonuc=' + credentials.sonuc +
        '&belgeid=' + credentials.docId +
        '&muayenetipi=' + credentials.muayeneType +
        '&kontrol=' + credentials.kontrolnotlari +
        '&kontroltarihi=' + credentials.kontrolTarihi +
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

  public deleteMuayene(muayeneId) {
    var url = "http://kisko.net/apiv2/muayene.php";
    var token = sessionStorage.getItem('token');
    var actionType = 3;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&muayeneid=' + muayeneId +
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

  public labRequest(credentials) {
    var url = "http://kisko.net/apiv2/lab_istek.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&kurumid=' + credentials.kurumid +
        '&muayeneid=' + credentials.muayeneid +
        '&istektipi=' + credentials.istektipi +
        '&aciklama=' + credentials.aciklama +
        '&doktortc=' + credentials.doktortc +    
        '&hastatc=' + credentials.hastatc +                
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

  public uploadDocument(credentials, file) {
    var url = "http://kisko.net/apiv2/belge.php";
    var token = sessionStorage.getItem('token');
    var actionType = "1";

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.delete('Content-Type');

    return Observable.create(observer => {
      const formData = new FormData();
      formData.append('belge', file, file.name);
      formData.append('baslik', file.name);
      formData.append('token', token);
      formData.append('action', actionType);
      formData.append('islemid', credentials.islemid);
      formData.append('islemtipi', credentials.islemtipi);
      formData.append('belgetipi', credentials.belgetipi);

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

  public getDocuments(islemid, islemtipi) {
    var url = "http://kisko.net/apiv2/belge.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&islemid=' + islemid +
        '&islemtipi=' + islemtipi +     
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

  public getPatientSaha(patientTc) {
    var url = "http://kisko.net/apiv2/saha.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&hastatc=' + patientTc +
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

  public getPatientSahaDetail(id) {
    var url = "http://kisko.net/apiv2/saha.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&sahaid=' + id +
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

  public getPatientOlcum(patientTc, sahaId) {
    var url = "http://kisko.net/apiv2/olcum.php";
    var token = sessionStorage.getItem('token');
    var actionType = 4;

    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&hastatc=' + patientTc +
        '&sahaid=' + sahaId +
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

  public addPatientOlcum(credentials) {
    var url = "http://kisko.net/apiv2/olcum.php";
    var token = sessionStorage.getItem('token');
    var actionType = 1;
    console.log(credentials);
    return Observable.create(observer => {
      let body = (
        'token=' + token +
        '&ekleyentc=' + credentials.ekleyentc +
        '&sahaid=' + credentials.sahaid +
        '&deger=' + credentials.degers +
        '&olcumzamani=' + credentials.olcumzamani +
        '&hastatc=' + credentials.hastatc +
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
