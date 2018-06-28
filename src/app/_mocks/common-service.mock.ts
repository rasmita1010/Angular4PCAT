import { Observable } from 'rxjs/Rx';
import { Output, EventEmitter } from '@angular/core';

export class MockCommonService {

    updateApprovalList(magCode): Observable<any> {
        let result = "Success";
        return Observable.of(result);
    }

    getDigitalData(): Observable<any> {
        let result = [
            {
                'DemoCode': 'SGR',
                'Description': 'ASF',
                'DemoOfferCodes': [
                    'AZCS',
                    'weff'
                ]
            },
            {
                'DemoCode': 'cal',
                'Description': 'Description',
                'DemoOfferCodes': [
                    'calc',
                    '1tst'
                ]
            },
            {
                'DemoCode': 'set',
                'Description': 'Test',
                'DemoOfferCodes': [
                    '11@2'
                ]
            },
            {
                'DemoCode': '321',
                'Description': '98756',
                'DemoOfferCodes': [
                    '7871',
                    '65@#',
                    '4rt5'
                ]
            }
        ];
        return Observable.of(result);
    }

    GetNotifications(notifRequest: any): Observable<any> {
        let result = { 'PendingNotifications': [{ 'DemoCode': 'FFP', 'QuestionText': 'Who is your favorite football player', 'MagazineAssociations': [{ 'DemoOfferCode': 'AFFQ', 'Magazines': ['GF', 'SU'] }], 'LinkedChannels': 2, 'AnswerType': 'Single Option', 'DemoOfferCount': 3, 'Comments': [{ 'CommentId': 86, 'DemoCode': 'FFP', 'CommentText': 'test comment', 'CommentBy': 'user1', 'UserName': 'User 1', 'CommentDate': '2017-10-25T05:30:30.847Z' }, { 'CommentId': 85, 'DemoCode': 'FFP', 'CommentText': 'Demo Offer Code AFFP modified.\nMagazine Channels are associated for Demo Offer Code AFFP.\nMagazine Channels are associated for Demo Offer Code AFFQ.\nMagazine Channels are modified for Demo Offer Code AFFP.\nMagazine Channels are modified for Demo Offer Code AFFQ.\nNew Demo Offer Code AFFP created.\nNew Demo Offer Code AFFQ created.\nSubmitting Changes for Approval', 'CommentBy': 'User 1', 'UserName': 'user1', 'CommentDate': '2017-10-25T05:07:43.127Z' }], 'SubmittedGroupId': 83, 'LinkedMagazines': 2 }, { 'DemoCode': 'SPT', 'QuestionText': 'Which is your favorite sport', 'MagazineAssociations': [{ 'DemoOfferCode': 'SPTA', 'Magazines': ['EW', 'GF', 'SI'] }, { 'DemoOfferCode': 'SPTB', 'Magazines': ['GF', 'SI'] }, { 'DemoOfferCode': 'asd', 'Magazines': ['GF'] }, { 'DemoOfferCode': 'gkgr', 'Magazines': ['SI'] }], 'LinkedChannels': 5, 'AnswerType': 'Multiple Option', 'DemoOfferCount': 4, 'Comments': [{ 'CommentId': 535, 'DemoCode': 'SPT', 'CommentText': 'Demo Choices modified against Demo Offer Code SPTA.\nDemo Offer Code SPTA modified.\nMagazine Channels are associated for Demo Offer Code asd.\nMagazine Channels are associated for Demo Offer Code gkgr.\nMagazine Channels are associated for Demo Offer Code SPTA.\nMagazine Channels are associated for Demo Offer Code SPTB.\nMagazine Channels are modified for Demo Offer Code SPTA.\nNew Demo Offer Code asd is created.\nNew Demo Offer Code gkgr is created.\nNew Demo Offer Code SPTA created.\nNew Demo Offer Code SPTB created.\nSchedule date modified against Demo Offer Code SPTA.\nSchedule date modified against Demo Offer Code SPTB.\nTEst#$$%%^%^', 'CommentBy': 'User 2', 'UserName': 'user2', 'CommentDate': '2017-12-08T12:04:05.67Z' }, { 'CommentId': 91, 'DemoCode': 'SPT', 'CommentText': 'Add COmments', 'CommentBy': 'User 1', 'UserName': 'user1', 'CommentDate': '2017-10-25T09:44:14.437Z' }], 'SubmittedGroupId': 108, 'LinkedMagazines': 3 }], 'ReturnedNotifications': [{ 'DemoCode': 'MAR', 'QuestionText': 'Testing Demo Offer of \'Marking\' !@#%%^^& \'\'\'\'???<>', 'MagazineAssociations': [{ 'DemoOfferCode': 'MARK', 'Magazines': ['GF', 'EW'] }, { 'DemoOfferCode': 'MARB', 'Magazines': ['EW'] }], 'LinkedChannels': 3, 'AnswerType': 'Marking', 'DemoOfferCount': 2, 'Comments': [{ 'CommentId': 141, 'DemoCode': 'MAR', 'CommentText': 'Rejected for validation\n', 'CommentBy': 'User 2', 'UserName': 'user2', 'CommentDate': '2017-11-02T03:44:51.477Z' }, { 'CommentId': 140, 'DemoCode': 'MAR', 'CommentText': 'Magazine Channels are associated for Demo Offer Code MARB.\nMagazine Channels are associated for Demo Offer Code MARK.\nMagazine Channels are modified for Demo Offer Code MARB.\nMagazine Channels are modified for Demo Offer Code MARK.\nNew Demo Offer Code MARB created.\nNew Demo Offer Code MARK created.\nSchedule date modified against Demo Offer Code MARB.\nSchedule date modified against Demo Offer Code MARK.\nvalid\n', 'CommentBy': 'User 2', 'UserName': 'user2', 'CommentDate': '2017-11-02T03:44:11.54Z' }], 'SubmittedGroupId': 15, 'LinkedMagazines': 2 },] };
        return Observable.of(result);
    }
}


export class MockPreferenceService {

    @Output() errorHandled$ = new EventEmitter();

    authPost(url: string, body: any): Observable<any> {
        return Observable.of(body);
    }

    authGetRequest(url, params): Observable<any> {
        return Observable.of(params);
    }


}