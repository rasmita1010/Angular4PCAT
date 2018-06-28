export class MagazineChannel {
    DemoOfferCode: string;
    Mag_Code: string;
    MagazineName: string;
    ChannelId: number;
    IsVisible: boolean;
    SortOrder: number;
    IsPublished: boolean;
    UpdatedBy: string;
    UpdatedDate: Date;
    ChannelName: string;
    DemoOfferChannelId: number;
    ChangeType: string;
    DemoCode: string;
    ChannelCode: string;


    constructor(_demoOfferCode: string, _magCode: string, _magName: string, _channelId: number, _visiblity: boolean,
        _sortOrder: number, _isPublished: boolean, _updatedBy: string, _updatedDate: Date, _chananelName: string, _demoOfferChannelId: number, _changeType: string, _demoCode: string, _channelCode: string) {
        this.MagazineName = _magName;
        this.ChannelId = _channelId;
        this.IsVisible = _visiblity;
        this.DemoOfferCode = _demoOfferCode;
        this.Mag_Code = _magCode;
        this.SortOrder = _sortOrder;
        this.IsPublished = _isPublished;
        this.UpdatedBy = _updatedBy;
        this.UpdatedDate = _updatedDate;
        this.ChannelName = _chananelName;
        this.DemoOfferChannelId = _demoOfferChannelId;
        this.ChangeType = _changeType;
        this.DemoCode = _demoCode;
        this.ChannelCode = _channelCode;
    }
}
