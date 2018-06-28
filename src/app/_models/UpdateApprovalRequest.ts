export class UpdateAprovalRequest {
    UpdatedAdressList: string;
    MagCode: string;
    constructor(_updatedList: string, _magCode: string, ) {
        this.UpdatedAdressList = _updatedList;
        this.MagCode = _magCode;
    }
}
