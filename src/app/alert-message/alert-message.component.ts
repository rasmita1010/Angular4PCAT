import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { PreferenceDataService } from '../_services/index';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {

  modalMessage = '';
  @ViewChild('modalValidate')
  modalValidate: BsModalComponent;

  constructor(private _preferenceService: PreferenceDataService) {
    _preferenceService.errorHandled$.subscribe(error => {
      if (this.modalMessage === '') {
        const exception = error.json();
        this.modalMessage = error.status ? (error.statusText + ' - ' + (exception.ExceptionMessage || 'An error has occured')) : 'An unexpected error has occurred. Please contact the system administrator.';
        this.modalValidate.open();
        setTimeout(() => {
          this.modalValidate.close();
          this.modalMessage = '';
        }, 3000);
      }
    });
  }

  ngOnInit() {
  }

}
