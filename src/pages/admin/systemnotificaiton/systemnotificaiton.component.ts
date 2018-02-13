import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NotificationService } from './../../../services/NotificationService/notification.service';
import { SearchModel } from '../../../models/SearchModel';

declare const $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-systemnotificaiton',
  templateUrl: './systemnotificaiton.component.html',
  styleUrls: ['./systemnotificaiton.component.css'],
  providers: [NotificationService]
})
export class SystemnotificaitonComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject();
  dtOptions: any = {};
  dataTable: DataTable = {
    headerRow: [ 'Gönderen', 'İçerik', 'Tarih' ],
    footerRow: [],
    dataRows: []
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  boxColor: String;


  constructor(private notificationService: NotificationService, 
    private router: Router) { }
  

  ngOnInit() {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'admin') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getAllNotifications();
  }

  configure() {
    this.dtOptions = {
      bLengthChange:false,
      searching:false,
      header:false,
      info:false,
      infoEmpty:false,
      pageLength:25,
      sort:false,
      paginate:false
    };

    this.boxColor = sessionStorage.getItem('boxColor');    
  }

  getAllNotifications() {
    this.notificationService.getAllNotificaitons().subscribe(data => {
      if(data) {
        this.dataTable.dataRows = data.notificationlist;
        this.dtTrigger.repeat();
      }
    });
  }

  search(event) {
    /*if(event.keyCode == 13) {
      this.notificationService.searchNotification(this.searchCredentials.value).subscribe(data => {
        if(data) {
          this.dataTable.dataRows = data.notification;
          this.dtTrigger.repeat();
        }
      });
    } else {
    }*/
  }
}
