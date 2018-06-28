import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../_models/index';
import { QuestionService } from '../_services/questions/question.service';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';


@Component({
  selector: 'app-question-search',
  templateUrl: './question-search.component.html',
  styleUrls: ['./question-search.component.css']
})
export class QuestionSearchComponent implements OnInit {
  // Declarations
  constants = Constants;
  searchText: string;
  questions: any;
  displayMsg: string;
  @ViewChild('progressBar')
  progressBar: BsModalComponent;
  constructor(private _service: QuestionService, private router: Router) { }

  ngOnInit() {
  }

  // searchEvent() to get the keywords typed and to check if the keywords have enter or space keycode
  searchEvent(event: any) {
    if (event.target.value !== '') {
      this.searchText = event.target.value.trim().toLowerCase();
      if (event.keyCode === this.constants.KEY_CODE_ENTER || event.keyCode === this.constants.KEY_CODE_SPACE) {
        this.searchKeywords(); // calling searchKeywords() if searched keywords contain enter or space key pressed
      }
    } else {
      this.questions = null;
      this.searchText = null;
      this.displayMsg = null;
    }
    if (event.keyCode === this.constants.KEY_CODE_ENTER && event.target.value === '') {
      this.displayMsg = this.constants.SEARCH_KEYWORD_EMPTY;
    }
  }

  // searchKeywords() to make service request for getting searched democodes
  searchKeywords() {
    if (!(this.searchText === '' || this.searchText === undefined)) {
      let searchArray: any;
      searchArray = this.searchText.split(' ');
      //  searchArray = searchArray.filter(item => !this.constants.EXCLUDE_LIST.includes(item)); // Removing common keywords from searched text
      searchArray = searchArray.splice(this.constants.EXCLUDE_LIST);
      if (searchArray.length > 0) {
        this.displayMsg = null;
        this.progressBar.open();
        this._service.getQuestionsOnSearch(searchArray).subscribe(
          (data) => {
            if (data.length <= 0) {
              setTimeout(() => {
                this.progressBar.close();
              }, 1000);
              this.displayMsg = this.constants.SEARCH_KEYWORD_EMPTY_RESULT;
            } else {
              setTimeout(() => {
                this.progressBar.close();
              }, 1000);
              this.questions = data;
            }
          }, error => {
            setTimeout(() => { this.progressBar.close(); }, 1000);
          }
        );
      }
    } else {
      this.displayMsg = this.constants.SEARCH_KEYWORD_EMPTY;
    }

  }

  // OnDemoCodeSelect() to storing DemoCode selected and navigate it to DemoCode view
  OnDemoCodeSelect(demoCode: string) {
    let filteredDemoOffer = '';
    sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(filteredDemoOffer));
    sessionStorage.setItem(this.constants.LS_DEMO_CODE, JSON.stringify(demoCode));
    this.router.navigate(['./dashboard/questions/view']);
  }

  createNewQuestion() {
    let filteredDemoOffer = '';
    sessionStorage.setItem(this.constants.LS_FILTRED_DEMO_OFFER, JSON.stringify(filteredDemoOffer));
    this.router.navigate(['./dashboard/questions/Create']);
  }

}

