export class ApproveReturnRequest {
    UserId: string;
    CommentText: string;
    UserName: string;
    SubmittedGroupIds: number[];
    ApproverEmail: string;
    constructor(_userId: string, _commentText: string, _userName: string, _sumittedGrpIds: number[], _approverEmail: string) {
        this.UserId = _userId;
        this.UserName = _userName;
        this.SubmittedGroupIds = _sumittedGrpIds;
        this.CommentText = _commentText;
        this.ApproverEmail = _approverEmail;
    }
}
