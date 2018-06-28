export class PrioritizeChoiceRequest {
    ScheduledDate: Date;
    DemoChoices: any[];

    constructor(_scheduledDate: Date, _lstDemoChoices: any[]) {
        this.ScheduledDate = _scheduledDate;
        this.DemoChoices = _lstDemoChoices;
    }
}