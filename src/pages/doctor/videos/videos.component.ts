import { Component, OnInit, ElementRef } from '@angular/core';
import { MediaService } from '../../../services/MediaService/media.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { fadeInAnimation } from '../../../helpers/animations/index';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  animations: [fadeInAnimation],
  providers: [MediaService]
})
export class VideosComponent implements OnInit {
  boxColor: string;
  currentdoctor: string;

  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [],
    dataRows: []
  };

  videos = [];
  selectedVideo: string;
  isVideoSelected: boolean;

  credentials = {
    mediaId: '',
    baslik: '',
    aciklama: '',
    medya: '',
    gonderentc: '',
    medyatipiid: '2'
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
    this.getVideos();
  }

  public configure():void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currentdoctor = sessionStorage.getItem('tc');

    this.isVideoSelected = false;
  }

  public getVideos():void {
    this.mediaService.getVideos(this.currentdoctor).subscribe(data => {
      if(data.returncode == 0) {
        for(let item of data.medya) {
          var date = moment(item.gondermetarihi);
          date.locale('tr');
          item.gondermetarihi = moment(date).format('LLL');
        }

        this.videos = data.medya;
        this.dataTable.dataRows = data.medya;
      } else {
        this.dataTable = { headerRow: [], dataRows: [] };
      }
    });
  }

  public getVideo(url): void {
    this.selectedVideo = url;
    this.isVideoSelected = true;
  }

  public uploadVideo(): void {
    this.credentials.gonderentc = this.currentdoctor;

    this.mediaService.uploadVideo(this.credentials).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.closeModal('videoUploadModal');
        this.getVideos();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public deleteVideo(id): void {
    this.mediaService.deleteVideo(id).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getVideos();
      } else {
        this.toastr.warning('', data.message);
      }
    });  
  }

  //Navigations
  public closeModal(param): void {
    var modalname = '#' + param;
    $(modalname).modal('hide'); 
  }

  public async deleteRequest(id) {
    const result = await swal({
    title: '',
    text: "Videoyu silmek istediğinize emin misiniz",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        this.deleteVideo(id);
      } catch (err){
      }
    }
  }

}
