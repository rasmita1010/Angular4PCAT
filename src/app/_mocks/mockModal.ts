import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'bs-modal',
    template: '<div class="alertsuccess">{{modalMessage}}</div>'
})
export class MockModal {
    @Input() backdrop: string | boolean;
    modalMessage = '';
    open(size: string): Promise<void> {
        //let obj = new Promise<void>();

        return;
    };
    close(size: string): Promise<void> {
        return;
    }

};


//export declare class BsModalMockService {
//    private modals;
//    private $body;
//    onBackdropClose$: Observable<BsModalHideType>;
//    onKeyboardClose$: Observable<BsModalHideType>;
//    onModalStack$: Observable<Event>;
//    constructor();
//    add(modal: BsModalComponent): void;
//    remove(modal: BsModalComponent): void;
//    focusNext(): void;
//    dismissAll(): Promise<{}[]>;
//}
