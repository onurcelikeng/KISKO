import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  bodyClasses = 'skin-red sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  color: String;


  constructor() { 
  }


  ngOnInit(): void {
    this.color = sessionStorage.getItem("color");
    this.body.classList.add('sidebar-mini');
    this.body.classList.add('fixed');
    this.body.classList.add('wrapper');   
  }

}
