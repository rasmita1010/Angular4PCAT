export class DemoOfferScheduleDate {
  DemoCode: string;
  DemoOfferCode: string;
  ScheduleDate: Date;
  StatusId: number;
  CreatedBy: string;
  constructor(_demoCode: string, _demoOfferCode: string, _scheduleDate: Date, _statusID: number,_Createdby:string) {
    this.DemoCode = _demoCode;
    this.DemoOfferCode = _demoOfferCode;
    this.ScheduleDate = _scheduleDate;
    this.StatusId = _statusID;
    this.CreatedBy = _Createdby;
  }
}
