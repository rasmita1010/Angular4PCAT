import { DemoChoiceDetails } from './DemoChoiceDetails';

export class DemoOfferDetails {
    DemoCode: string;
    DemoOfferCode: string;
    ScheduleDate: any;
    ApprovedDate: Date;
    LastPublishDate: Date;
    StatusId: number;
    Status: string;
    MinValue: number;
    MaxValue: number;
    Interval: number;
    MinDate: any;
    MaxDate: any;
    PremiumOffer: string;
    DigitalOffer: string;
    ControlType: string;
    SourceType: string;
    RecordType: string;
    CreatedBy: string;
    UpdatedBy: string;
    CreatedDate: Date;
    UpdatedDate: Date;
    PreviousStatusId: number;
    PreviousStatus: string;
    SubmittedGroupId: number;
    DemoOffer_Choice: DemoChoiceDetails[];
    DisplayText: string;

    constructor(_demoCode: string,
        _demoOfferCode: string,
        _scheduleDate: Date,
        _approvedDate: Date,
        _lastPublishDate: Date,
        _statusId: number,
        _status: string,
        _minValue: number,
        _maxValue: number,
        _interval: number,
        _minDate: any,
        _maxDate: any,
        _premiumOffer: string,
        _digitalOffer: string,
        _controlType: string,
        _sourceType: string,
        _recordType: string,
        _createdBy: string,
        _updatedBy: string,
        _createdDate: Date,
        _updatedDate: Date,
        _previousStatusId: number,
        _previousStatus: string,
        _submittedGroupId: number,
        _demoOffer_Choice: DemoChoiceDetails[],
        _displayText?: string) {
        this.DemoCode = _demoCode;
        this.DemoOfferCode = _demoOfferCode;
        this.ScheduleDate = _scheduleDate;
        this.ApprovedDate = _approvedDate;
        this.LastPublishDate = _lastPublishDate;
        this.StatusId = _statusId;
        this.Status = _status;
        this.MinValue = _minValue;
        this.MaxValue = _maxValue;
        this.Interval = _interval;
        this.MinDate = _minDate;
        this.MaxDate = _maxDate;
        this.PremiumOffer = _premiumOffer;
        this.DigitalOffer = _digitalOffer;
        this.ControlType = _controlType;
        this.SourceType = _sourceType;
        this.RecordType = _recordType;
        this.CreatedBy = _createdBy;
        this.UpdatedBy = _updatedBy;
        this.CreatedDate = _createdDate;
        this.UpdatedDate = _updatedDate;
        this.PreviousStatusId = _previousStatusId;
        this.PreviousStatus = _previousStatus;
        this.SubmittedGroupId = _submittedGroupId;
        this.DemoOffer_Choice = _demoOffer_Choice;
        this.DisplayText = _displayText;
    }
}
