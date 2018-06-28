export class DemoCode {
    Code: string;
    QuestionText: string;
    AnswerType: string;
    AnsweredQuestionText: string;
    IsCDBModel: boolean;
    QuestionIdentifier: string;
    RecentAnswerCount: number;
    StatusId: number;
    CreatedBy: string;
    CreatedDate: Date;
    UpdatedBy: string;
    UpdatedDate: Date;
    Status: string;

    constructor(_code: string,
        _questionText: string,
        _answerType: string,
        _answeredQuestionText: string,
        _isCDBModel: boolean,
        _questionIdentifier: string,
        _recentAnswerCount: number,
        _statusId: number,
        _createdBy: string,
        _createdDate: Date,
        _updatedBy: string,
        _updatedDate: Date,
        _status: string) {

        this.Code = _code;
        this.QuestionText = _questionText;
        this.AnswerType = _answerType;
        this.AnsweredQuestionText = _answeredQuestionText;
        this.IsCDBModel = _isCDBModel;
        this.QuestionIdentifier = _questionIdentifier;
        this.RecentAnswerCount = _recentAnswerCount;
        this.StatusId = _statusId;
        this.CreatedBy = _createdBy;
        this.CreatedDate = _createdDate;
        this.UpdatedBy = _updatedBy;
        this.UpdatedDate = _updatedDate;
        this.Status = _status;

    }
}
