import { Component, OnInit, animate, style, state, transition, trigger } from '@angular/core';
import { Subject } from 'rxjs';

//modules
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

//models
import { SearchModel } from '../../../models/SearchModel';
import { QuestionModel } from '../../../models/QuestionModel';

//services
import { QuestionService } from '../../../services/QuestionService/question.service';
import { Router } from '@angular/router';

declare var swal: any;
declare const $: any;
declare interface DataTable {
  headerRow: string[];
  dataRows: any;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  animations: [
    trigger("fadeInOut", [
      state("open", style({opacity: 1})),
      state("closed", style({opacity: 0})),
      transition("open <=> closed", animate( "50ms" ))
    ])
  ],
  providers: [QuestionService]
})
export class QuestionsComponent implements OnInit {
  dtTrigger: Subject<DataTable> = new Subject(); 
  dtOptions: any = {}; 
  dataTable: DataTable = {
    headerRow: [''],
    dataRows: []
  };
  
  questionCredentials: QuestionModel = {
    soruyanitid: '',
    yanit: '',
    yanitlayantc: ''
  };

  searchCredentials: SearchModel = {
    value: ''
  };

  selectedQuestion = {
    soruyanitid: '',
    sorutarihi: '',
    soru: '',
    yanit: '',
    hastaadi: '',
    hastasoyadi: '',
    hastafoto: '',
    durum: '',
    puan: '0'
  };

  boxColor: string;
  isAnswerSelected: boolean;
  isAnswared: boolean;
  selectedRow : number;
  setClickedRow : Function;
  doctorName: string;
  doctorPhoto: string;
  selectedQuestionId: string;


  constructor(private questionService: QuestionService,
    private router: Router,
    private toastr: ToastrService) { 
    this.setClickedRow = function(index){
      this.selectedRow = index;
    }
  }


  ngOnInit(): void {
    let role = sessionStorage.getItem('currentRole');
    if(role != 'doktor') {
      this.router.navigate(['main/error']);
      return;
    } 
    
    this.configure();
    this.getAllQuestions();
  }

  configure(): void {
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
    
    this.doctorName = sessionStorage.getItem('nameSurname');
    this.doctorPhoto = sessionStorage.getItem('photo');
    this.boxColor = sessionStorage.getItem('boxColor');

    this.selectedQuestionId = null;
    this.isAnswerSelected = false;
    this.isAnswared = false;
  }

  getAllQuestions(): void {
    this.questionService.getAllQuestions().subscribe(data => {
      if(data) {
        if(data.returncode == 0) {

          for(var item of data.soruyanit) {
            var date = moment(item.sorutarihi);
            date.locale('tr');
            item.sorutarihi = moment(date).format('LLL');
          }

          this.dataTable.dataRows = data.soruyanit;
          this.dtTrigger.repeat();
  
          if(this.selectedQuestionId != null) {
            this.openQuestionDetail(this.selectedQuestionId);
            this.isAnswared = true;
          }
        }
      }
    });
  }

  sendAnswer(): void {
    if(this.questionCredentials.yanit == '') {
      this.toastr.warning('', 'Lütfen eksiksiz bilgi giriniz.');      
    } else {
      this.questionService.answertoQuestion(this.questionCredentials).subscribe(data => {
        if(data) {
          if(data.returncode == 0) {
            this.getAllQuestions();
            this.questionCredentials.yanit = "";
            this.toastr.success('', data.message);          
          } else {
            this.toastr.warning('', data.message);
          }
        }
      });
    }
  }

  search(event): void {
    if(event.keyCode == 13) {
      
    } else {

    }
  }


  //navigation
  openQuestionDetail(i): void {
    this.beginAnim();
    this.selectedQuestionId = i;
    this.isAnswerSelected = true;
    this.selectedQuestion = this.dataTable.dataRows[i];
    
    if(this.selectedQuestion.durum == "0") {
      this.isAnswared = false;
    } else {
      this.isAnswared = true;   
    }

    this.questionCredentials.soruyanitid = this.selectedQuestion.soruyanitid;
    this.questionCredentials.yanitlayantc = sessionStorage.getItem('tc');
  }

  closeQuestionDetail(): void {
    this.beginAnim();
    this.isAnswerSelected = false;
    this.selectedRow = -1;
  }

  state = 'closed';
  timeOutRef;

  beginAnim() {
     this.state = this.state === 'open' ? 'closed' : 'open';
 }

}
