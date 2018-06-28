import { Tuple } from './Tuple';
export class PrioritySchedule {
    ChannelId: number;
    Mag_Code: string;
    MagazineName: string;
    ScheduleDate: Date;
    PublishDate: Date;
    DemoOfferOrder: Tuple[];


    constructor(_channelId: number, _magCode: string, _magName: string, _schedulerDate: Date, _publishDate: Date, _demoOfferOrder: Tuple[]) {
        this.ChannelId = _channelId;
        this.Mag_Code = _magCode;
        this.MagazineName = _magName;
        this.ScheduleDate = _schedulerDate;
        this.PublishDate = _publishDate;
        this.DemoOfferOrder = _demoOfferOrder;
    }
}
