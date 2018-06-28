export class DemoCodeComment {
    CommentId: number;
    DemoCode: string;
    CommentText: string;
    CommentBy: string;
    UserName: string;
    CommentDate: Date;

    constructor(_commentId: number,
        _democode: string,
        _commenttext: string,
        _commentby: string,
        _username: string,
        _commentdate: Date) {
        this.CommentId = _commentId;
        this.DemoCode = _democode;
        this.CommentText = _commenttext;
        this.CommentBy = _commentby;
        this.UserName = _username;
        this.CommentDate = _commentdate;
    }
}
