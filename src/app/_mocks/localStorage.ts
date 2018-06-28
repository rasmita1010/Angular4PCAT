export class MockLocalStorage {
    getItem(key: string): any {
        if (key === 'userDetails') {
            return { 'Company': 'MID', 'Department': 'Time Inc', 'DisplayName': 'Time Inc Admin', 'EMailAddress': 'admin@timeinc.com', 'FirstName': 'Time', 'LastName': 'Admin', 'PhoneNumber': '123456', 'roles': ['ADMIN', 'READONLY', 'TCS CLIENT SERVICES'], 'token': 'true', 'username': 'admint', 'resources': [{ 'Account': null, 'Description': 'Entertainment Weekly', 'Permission': null, 'ResourceName': 'EW', 'ResourceType': 'Titles', 'Source': null }, { 'Account': null, 'Description': 'Golf', 'Permission': null, 'ResourceName': 'GF', 'ResourceType': 'Titles', 'Source': null }, { 'Account': null, 'Description': 'Sports Illustrated', 'Permission': null, 'ResourceName': 'SI', 'ResourceType': 'Titles', 'Source': null }] }
        } else if (key === 'channels') {
            return [{ 'ChannelId': 1, 'ChannelName': 'Customer Service Portal', 'ChannelCode': 'CSP' }, { 'ChannelId': 2, 'ChannelName': 'GreenScreen', 'ChannelCode': 'GS' }, { 'ChannelId': 3, 'ChannelName': 'Insert Card', 'ChannelCode': 'IC' }, { 'ChannelId': 4, 'ChannelName': 'Messenger', 'ChannelCode': 'MSGR' }, { 'ChannelId': 5, 'ChannelName': 'SUBS', 'ChannelCode': 'SUBS' }, { 'ChannelId': 6, 'ChannelName': 'WES', 'ChannelCode': 'WES' }];
        } else if (key === 'answerTypes') {
            return [{ 'AnswerId': 1, 'AnswerType': 'Single Option' }, { 'AnswerId': 2, 'AnswerType': 'Multiple Option' }, { 'AnswerId': 3, 'AnswerType': 'Free text' }, { 'AnswerId': 4, 'AnswerType': 'Date' }, { 'AnswerId': 5, 'AnswerType': 'Date Range' }, { 'AnswerId': 6, 'AnswerType': 'Numeric Range' }, { 'AnswerId': 7, 'AnswerType': 'Opt-in/Opt-out' }, { 'AnswerId': 8, 'AnswerType': 'Marking' }];
        } else if (key === 'Status') {
            return [{ 'StatusId': 1, 'StatusType': 'DRAFT' }, { 'StatusId': 2, 'StatusType': 'PENDING' }, { 'StatusId': 3, 'StatusType': 'APPROVED' }, { 'StatusId': 4, 'StatusType': 'ACTIVE' }, { 'StatusId': 5, 'StatusType': 'RETURNED' }, { 'StatusId': 6, 'StatusType': 'DELETED' }, { 'StatusId': 7, 'StatusType': 'ACTIVE-IN EDIT' }, { 'StatusId': 8, 'StatusType': 'ARCHIVED' }];
        } else if (key === 'PaginationValue') {
            return 5;
        } else if (key === 'DemoCode') {
            return 'CIT';
        } else if (key === 'PaginationDemoSummary') {
            return 5;
        } else if (key === 'LS_FILTRED_DEMO_OFFER') {
            return 'GENA';
        }

    }

    setItem(key: string): void { }
}


export class MockMarketingLocalStorage {
    getItem(key: string): any {
        if (key === 'userDetails') {
            return { 'Company': 'MID', 'Department': 'Mindtree', 'DisplayName': 'Test User', 'EMailAddress': 'testuser@mindtree.timeinc.com', 'FirstName': 'Test', 'LastName': 'User', 'PhoneNumber': '123456', 'roles': ['TITLE MARKETING MANAGERS'], 'token': 'true', 'username': 'testuser', 'resources': [{ 'Account': null, 'Description': 'Entertainment Weekly', 'Permission': null, 'ResourceName': 'EW', 'ResourceType': 'Titles', 'Source': null }, { 'Account': null, 'Description': 'Golf', 'Permission': null, 'ResourceName': 'GF', 'ResourceType': 'Titles', 'Source': null }, { 'Account': null, 'Description': 'Sports Illustrated', 'Permission': null, 'ResourceName': 'SI', 'ResourceType': 'Titles', 'Source': null }] }
        } else if (key === 'PaginationDemoSummary') {
            return 5;
        }
    }

    setItem(key: string): void { }
}

export class MockReadOnlyLocalStorage {
    getItem(key: string): any {
        if (key === 'userDetails') {
            return { 'Company': 'MID', 'Department': 'Mindtree', 'DisplayName': 'Test User', 'EMailAddress': 'testuser@mindtree.timeinc.com', 'FirstName': 'Test', 'LastName': 'User', 'PhoneNumber': '123456', 'roles': ['READONLY'], 'token': 'true', 'username': 'testuser', 'resources': [{ 'Account': null, 'Description': 'Entertainment Weekly', 'Permission': null, 'ResourceName': 'EW', 'ResourceType': 'Titles', 'Source': null }, { 'Account': null, 'Description': 'Golf', 'Permission': null, 'ResourceName': 'GF', 'ResourceType': 'Titles', 'Source': null }, { 'Account': null, 'Description': 'Sports Illustrated', 'Permission': null, 'ResourceName': 'SI', 'ResourceType': 'Titles', 'Source': null }] }
        }
    }

    setItem(key: string): void { }
}
