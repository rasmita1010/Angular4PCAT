export class MagazineChannelDelete {
    DemoOffer: string;
    MagazineName: string;
    ChannelId: number;
    DemoCode: string;
    UserName: string;
    constructor(_demoOffer: string, _magName: string, _channelId: number, _demoCode: string, _userName:string) {
        this.DemoOffer = _demoOffer;
        this.MagazineName = _magName;
        this.ChannelId = _channelId;
        this.DemoCode = _demoCode;
        this.UserName = _userName;
    }
}
