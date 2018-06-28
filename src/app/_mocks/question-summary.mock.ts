import { Constants } from '../_models/index';

export class MockQuestionData {
    MockQuestionSummaryData() {
        return {
            'DemoCodes': [
                { 'DemoCode': '1', 'QuestionText': 'Text1', 'AnswerType': 'Multiple Option', 'Status': 'APPROVED', 'DemoOfferCodes': ['11'] },
                { 'DemoCode': '2', 'QuestionText': 'Text1', 'AnswerType': 'Single Option', 'Status': 'DRAFT', 'DemoOfferCodes': ['21'] },
                { 'DemoCode': '3', 'QuestionText': 'Text1', 'AnswerType': 'Single Option', 'Status': 'ACTIVE', 'DemoOfferCodes': ['31', '32'] },
                { 'DemoCode': '4', 'QuestionText': 'Text1', 'AnswerType': 'Single Option', 'Status': 'PENDING', 'DemoOfferCodes': ['41'] }],
            'FilterParameters': []
        };
    }
}