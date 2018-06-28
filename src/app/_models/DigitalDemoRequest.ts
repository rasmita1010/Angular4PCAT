import { DigitalDemos } from './DigitalDemos';

export class DigitalDemoRequest {
    Demo: DigitalDemos;
    isAdd: boolean;

    constructor(_demo: DigitalDemos,
        _isAdd: boolean) {
        this.Demo = _demo;
        this.isAdd = _isAdd;
    }
}
