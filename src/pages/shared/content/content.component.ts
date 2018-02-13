import { Component, OnInit } from '@angular/core';
declare var AdminLTE: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    AdminLTE.init();
  }

}
