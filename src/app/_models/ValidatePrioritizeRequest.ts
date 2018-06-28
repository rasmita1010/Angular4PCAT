export class ValidatePrioritizeRequest {
    ChannelId: number;
    MagCode: string;
    ChannelName: string;
    MagazineName: string;


    constructor(_channelId: number, _magCode: string, _channelName: string, _magazineName: string) {
        this.ChannelId = _channelId;
        this.MagCode = _magCode;
        this.ChannelName = _channelName;
        this.MagazineName = _magazineName;
    }
}
