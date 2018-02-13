import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

//modules
import * as moment from 'moment';

//services
import { NotificationService } from './../../../services/NotificationService/notification.service';

declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [NotificationService]
})
export class NotificationsComponent implements OnInit {
  notificationDtTrigger: Subject<DataTable> = new Subject();
  notificationDtOptions: any = {};
  notificationDataTable: DataTable = {
    headerRow: [],
    dataRows: []
  };

  boxColor: String;
  notifications: any;
  pageIndex: number = 0;
  pageLength: number = 5;


  constructor(private notificationService: NotificationService, 
    private router: Router) { 
      
  }
  

  ngOnInit(): void {
    this.configure();
    this.getMyNotifications(); 
  }

  configure(): void {
    this.boxColor = sessionStorage.getItem('boxColor');
    
    this.notificationDtOptions = {
      bLengthChange:false,
      searching:false,
      header:false,
      info:false,
      infoEmpty:false,
      pageLength:25,
      sort:false,
      paginate:false
    };
  }

  getMyNotifications(): void {
    this.notificationService.getMyNotifications(this.pageIndex, this.pageLength).subscribe(data => {
      if(data) {
        if(data.returncode == '0') {
          this.notifications = data.notificationlist;

          for(let notification of this.notifications) {
            var date = moment(notification.date);
            date.locale('tr');
            notification.date = moment(date).fromNow();
          }

          this.notificationDataTable.dataRows = this.notifications;
          this.notificationDtTrigger.repeat();
        }
      }
    });
  }

  filterNotifications(typeId): void {
    if(typeId == 0) {
      this.getMyNotifications();
    } else {
      var list: any = [];
      for(let notification of this.notifications) {
        if(notification.typeid == typeId) {
          list.push(notification);
        }
      }

      this.notificationDataTable.dataRows = list;
      this.notificationDtTrigger.repeat();
    }
  }

  pagination(param): void {
    if(param == "next") {
      this.pageIndex = this.pageIndex + this.pageLength;
    } else if(param == "back") {
      this.pageIndex = this.pageIndex - this.pageLength;
    }

    this.getMyNotifications();
  }

}
