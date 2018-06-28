export class ResetRequest {
    DemoCode: string;
    AnswerType: string;
    UserId: string;

    constructor(_demoCode: string, _answerType: string, _userId: string) {
        this.DemoCode = _demoCode;
        this.AnswerType = _answerType;
        this.UserId = _userId;
    }
}