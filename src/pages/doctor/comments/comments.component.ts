import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/CommentService/comment.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers: [CommentService]
})
export class CommentsComponent implements OnInit {
  boxColor: string;
  currentDoctor: string;

  dtTrigger: Subject<DataTable> = new Subject();  
  dtOptions: any = {};   
  dataTable: DataTable = {
    headerRow: [],
    dataRows: []
  };


  constructor(private commentService: CommentService,
    private toastr: ToastrService,
    private router: Router) { }


  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 

    this.configure();
    this.getComments();
  }

  public configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    this.currentDoctor = sessionStorage.getItem('tc');
  }

  public getComments(): void {
    this.commentService.getComments().subscribe(data => {
      if(data.returncode == 0) {
        for(let item of data.medyayorum) {
          var date = moment(item.gondermetarihi);
          date.locale('tr');
          item.gondermetarihi = moment(date).format('LLL');
        }
        
        this.dataTable.dataRows = data.medyayorum;
      } else {
        this.dataTable  = { headerRow: [], dataRows: [] };
      }
    });
  }

  public change(id, status): void {
    if(status == '1') {
      status = 0
    } else {
      status = 1;
    }

    this.commentService.changeCommentStatus(id, status).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getComments();
      } else {
        this.toastr.warning('', data.message);
      }
    })
  }

  public deleteComment(id): void {
    this.commentService.deleteComment(id).subscribe(data => {
      if(data.returncode == 0) {
        this.toastr.success('', data.message);
        this.getComments();
      } else {
        this.toastr.warning('', data.message);
      }
    });
  }

  public async deleteRequest(id) {
    const result = await swal({
    title: '',
    text: "Yorumu silmek istediğinize emin misiniz",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        this.deleteComment(id);
      } catch (err){
      }
    }
  }

}
