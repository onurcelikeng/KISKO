import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../../../services/MediaService/media.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  providers: [MediaService]
})
export class ArticlesComponent implements OnInit {
  boxColor: string;
  currentdoctor: string;

  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [],
    dataRows: []
  };
  
  isProgressBar: boolean;

  documentFiles: File;

  media: {};

  credentials = {
    mediaId: '',
    baslik: '',
    aciklama: '',
    gonderentc: '',
    medyatipiid: '1'
  };


  constructor(private mediaService: MediaService,
    private toastr: ToastrService,
    private element: ElementRef,
    private router: Router) { }

  
  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 

    this.configure();
    this.getArticles();
  }

  public configure():void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currentdoctor = sessionStorage.getItem('tc');

    this.isProgressBar = false;
  }

  public getArticles(): void {
    this.mediaService.getArticles(this.currentdoctor).subscribe(data => {
      if(data.returncode == 0) {
        for(let item of data.medya) {
          var date = moment(item.gondermetarihi);
          date.locale('tr');
          item.gondermetarihi = moment(date).format('LLL');
        }

        this.dataTable.dataRows = data.medya;
      } else {
        this.dataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public getArticle(id): void {
    this.mediaService.getArticle(id).subscribe(data => {
      if(data.returncode == 0) {
        //window.open(data.medya[0].url);
        
        this.media = Observable.of({
          aciklama: data.medya[0].aciklama,
          baslik: data.medya[0].baslik,
          url: data.medya[0].url,
          gondermetarihi: data.medya[0].gondermetarihi,
          begenme: data.medya[0].begenme,
          goruntuleme: data.medya[0].goruntuleme
        }).delay(100);
      }
    })
  }

  public deleteArticle(id): void {
    this.mediaService.deleteArticle(id).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getArticles();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public uploadArticle(): void {
    this.isProgressBar = true;
    this.credentials.gonderentc = this.currentdoctor;

    this.mediaService.uploadArticle(this.credentials, this.documentFiles).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('articleUploadModal');
        this.getArticles();
      } else {
        this.toastr.warning('', data.message);
      }

      this.isProgressBar = false;
    });
  }

  public fileChange(event): void {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.documentFiles = file;
      var image = this.element.nativeElement.querySelector('#preview img');
      image.file = file;
      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result;}; })(image);
      reader.readAsDataURL(file);
    }
  }

  public closeModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

  public openDocumentUrl(url): void {
    window.open(url);
  }

  public async deleteRequest(id) {
    const result = await swal({
    title: '',
    text: "Makaleyi silmek istediğinize emin misiniz",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        this.deleteArticle(id);
      } catch (err){
      }
    }
  }
  
}
