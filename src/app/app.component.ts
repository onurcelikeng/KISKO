import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavbarComponent } from '../pages/shared/navbar/navbar.component';
import { MessageService } from '../services/MessageService/index';
import { flatten } from '@angular/router/src/utils/collection';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';


  constructor(private messageService: MessageService) { 
  }


  ngOnInit(): void { 
    
    var OneSignal = window['OneSignal'] || [];
    OneSignal.push(["init", {
      appId: "ba1c19b2-209d-4800-b033-0c2faa93664a",
      autoRegister: true,
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true
      }
    }]);
    
    OneSignal.push(function () {
      OneSignal.push(["registerForPushNotifications"])
    });
    
    OneSignal.getUserId().then(function(userId) {
      sessionStorage.setItem("OneSignalUserId", userId);
    });
   
  }

}
