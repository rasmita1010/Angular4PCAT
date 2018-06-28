import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Constants } from '../_models/index';

@Pipe({ name: 'FreeUserPipe', pure: false })
export class FreeUserPipe implements PipeTransform {
    transform(tableRow: any, searchText: string): any {
        return (typeof tableRow !== 'undefined') ? tableRow.filter((item) => {
            if (item === null || item === undefined) {
                item = '';
            }
            if (_.includes(item.toLowerCase(), searchText.toLowerCase()) || _.includes(item.toLowerCase(), searchText.toLowerCase())) {
                return item;
            }
        }) : true;
    }
}

// Pipe for highlighting searched words in Home Page
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    constants = Constants;

    transform(value: string, searchText: any): string {
        let searchArray: any;
        searchArray = searchText.split(' ');
        searchArray = searchArray.splice(this.constants.EXCLUDE_LIST);
      //  searchArray = searchArray.filter(item => !this.constants.EXCLUDE_LIST.includes(item));
        searchArray = searchArray.join('|');
        const regex = new RegExp(searchArray, 'gi');
        return searchText ? value.replace(regex, (matchText) => `<span class="highlight">${matchText}</span>`) : value;
    }
}

// Pipe for filtering searched words in Question summary page
@Pipe({ name: 'FreeTextSearchPipe' })
export class FreeTextSearchPipe implements PipeTransform {
    transform(tableRow: any, searchText: string): any {
        return (typeof tableRow !== 'undefined') ? tableRow.filter((item) => {
            if (item.QuestionText === null || item.QuestionText === undefined) {
                item = '';
            }
            if (_.includes(item.QuestionText.toLowerCase(), searchText.toLowerCase())) {
                return item;
            }
        }) : true;
    }
}

// Pipe to Search Demo offer Codes
@Pipe({ name: 'DemoOfferCodePipe', pure: false })
export class DemoOfferCodePipe implements PipeTransform {
    transform(demoOfferData: any, searchedCode: string): any {
        return (typeof demoOfferData !== 'undefined') ? demoOfferData.filter((item) => {
            if (item.ParentDemoOfferCode === null || item.ParentDemoOfferCode === undefined) {
                item = '';
            }
            if (_.includes(item.ParentDemoOfferCode.toLowerCase(), searchedCode.toLowerCase())) {
                return item;
            }
        }) : true;
    }
}

@Pipe({ name: 'DemoOfferSearchPipe' })
export class DemoOfferSearchPipe implements PipeTransform {
    transform(demoOfferData: any, searchedCode: string): any {
        return (typeof demoOfferData !== 'undefined') ? demoOfferData.filter((item) => {
            if (item.DemoOfferCode === null || item.DemoOfferCode === undefined) {
                item = '';
            }
            if (_.includes(item.DemoOfferCode.toLowerCase(), searchedCode.toLowerCase())) {
                return item;
            }
        }) : true;
    }
}

@Pipe({ name: 'PendingScheduleSearchPipe', pure: false })
export class PendingScheduleSearchPipe implements PipeTransform {
    transform(demoOfferData: any, searchedCode: string): any {
        return (typeof demoOfferData !== 'undefined') ? demoOfferData.filter((item) => {
            if (item.DemoCode === null || item.DemoOfferCode === undefined) {
                item = '';
            }
            if ((_.includes(item.DemoCode.toLowerCase(), searchedCode.toLowerCase()))
                || (_.includes(item.DemoOfferCode.toLowerCase(), searchedCode.toLowerCase()))
                || (_.includes(item.QuestionText.toLowerCase(), searchedCode.toLowerCase()))
                || (_.includes(item.Status.toLowerCase(), searchedCode.toLowerCase()))) {
                return item;
            }
        }) : true;
    }
}

@Pipe({ name: 'CompletedScheduleSearchPipe', pure: false })
export class CompletedScheduleSearchPipe implements PipeTransform {
    transform(demoOfferData: any, searchedCode: string): any {
        return (typeof demoOfferData !== 'undefined') ? demoOfferData.filter((item) => {
            if (item.DemoCode === null || item.DemoOfferCode === undefined) {
                item = '';
            }
            if ((_.includes(item.DemoCode.toLowerCase(), searchedCode.toLowerCase()))
                || (_.includes(item.DemoOfferCode.toLowerCase(), searchedCode.toLowerCase()))
                || (_.includes(item.QuestionText.toLowerCase(), searchedCode.toLowerCase()))) {
                return item;
            }
        }) : true;
    }
}


@Pipe({ name: 'SourceRecordName', pure: false })
export class SourceRecordName implements PipeTransform {
    constants = Constants;
    transform(value: string, type?: string): string {
        if (!value) {
            return null;
        }
        if (type === 'source') {
            const cdbSource = this.constants.CDB_SOURCE_TYPES.filter(item => item.id === value);
            if (cdbSource.length > 0) {
                return cdbSource[0].name;
            } else {
                const otherSource = this.constants.OTHER_SOURCE_TYPES.filter(item => item.id === value);
                return otherSource.length > 0 ? otherSource[0].name : null;
            }
        } else if (type === 'record') {
            const records = this.constants.RECORD_TYPES.filter(item => item.id === value);
            return records.length > 0 ? records[0].name : null;
        }
        return null;
    }
}

@Pipe({ name: 'MagazineDemoOfferCode' })
export class MagazineDemoOfferCode implements PipeTransform {
    transform(demoOfferChannel: any, SearchText: string): any {
        return (typeof demoOfferChannel !== 'undefined') ? demoOfferChannel.filter((item) => {
            if (item.demoOffer === null || item.demoOffer === undefined) {
                item = '';
            }
            if (_.includes(item.demoOffer.toLowerCase(), SearchText.toLowerCase())) {
                return item;
            }
        }) : true;
    }
}

@Pipe({ name: 'Display' })
export class DisplayPipe implements PipeTransform {
    transform(value: string, args?: any): any {
        if (value !== null) {
            if (value.length > 10) {
                return value.substr(0, 10) + '...';
            } else {
                return value;
            }
        }   
    }
}

@Pipe({ name: 'ForcedChainPipe', pure: false })
export class ForcedChainPipe implements PipeTransform {
    transform(demoOfferData: any, searchText: string): any {
        return (typeof demoOfferData !== 'undefined') ? demoOfferData.filter((item) => {
            if (item.DemoOfferCode === null || item.DemoOfferCode === undefined) {
                item = '';
            }
            if ((_.includes(item.DemoOfferCode.toLowerCase(), searchText.toLowerCase()))
                || (_.includes(item.QuestionText.toLowerCase(), searchText.toLowerCase()))
                || (_.includes(item.DemoChoiceText.toLowerCase(), searchText.toLowerCase()))) {
                return item;
            }
        }) : true;
    }
}
@Pipe({ name: 'ChoiceChainPipe', pure: false })
export class ChoiceChainPipe implements PipeTransform {
    transform(demoOfferData: any, searchText: string): any {
        return (typeof demoOfferData !== 'undefined') ? demoOfferData.filter((item) => {
            if (item.DemoCode === null || item.QuestionText === undefined) {
                item = '';
            }
            if ((_.includes(item.DemoCode.toLowerCase(), searchText.toLowerCase()))) {
                return item;
            } else if (_.includes(item.QuestionText.toLowerCase(), searchText.toLowerCase())) {
                return item;
            } else if (this.checkPresence(item.Choices.map(ch => ch.DemoChoiceText.toLowerCase()), searchText.toLowerCase())) {
                return item;
            } else {
                if (this.checkPresence(item.Choices.map(ch => ch.DemoChoiceCode.toLowerCase()), searchText.toLowerCase())) {
                    return item;
                }
            }
        }) : true;
    }

    checkPresence(choicelst, searchText) {
        return choicelst.some(choice => {
            if (_.includes(choice.toLowerCase(), searchText)) {
                return true;
            }
        });
    }
}

// Pipe for filtering searched words in Question summary page
@Pipe({ name: 'DigitalDemoSearchPipe', pure: false })
export class DigitalDemoSearchPipe implements PipeTransform {
    transform(tableRow: any, searchText: string): any {
        return (typeof tableRow !== 'undefined') ? tableRow.filter((item) => {
            if (item.DemoCode === null || item.DemoCode === undefined || item.Description === null || item.Description === undefined) {
                item = '';
            }
            if ((_.includes(item.DemoCode.toLowerCase(), searchText.toLowerCase()))
                || (_.includes(item.Description.toLowerCase(), searchText.toLowerCase()))
                || (this.checkPresence(item.DemoOfferCodes, searchText.toLowerCase()))) {
                return item;
            }
        }) : true;
    }
    checkPresence(offerList, searchText) {
        return offerList.some(offer => {
            if (_.includes(offer.toLowerCase(), searchText)) {
                return true;
            }
        });
    }


}

@Pipe({ name: 'FormatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(value: any) {
        if (value != null && value != undefined && value != "") {
            var parts = value.match(/(\d+)/g);
            let dt = new Date(parts[0], parts[1] - 1, parts[2]);
            let result = ('0' +(dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2) + '-' + dt.getFullYear();
            return result;
        }
        return value;
    }
}

@Pipe({ name: 'FormatDateMonth' })
export class FormatDateMonthPipe implements PipeTransform {
    transform(value: any) {
        if (value != null && value != undefined && value != "") {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];            
                let dt = new Date(value);
                let result = ('0' + dt.getDate()).slice(-2) + ' ' + monthNames[dt.getMonth()] + ' ' + dt.getFullYear();
                return result;
        }
        return value;
    }

}

@Pipe({ name: 'FormatDateTime' })
export class FormatDateTimePipe implements PipeTransform {
    transform(value: any) {
        if (value != null && value != undefined && value != "") {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            let dt = new Date(value);
            let hour = dt.getHours();
            const amPm = hour > 11 ? 'pm' : 'am';
            hour = hour > 12 ? hour - 12 : hour;
            let result = ('0' + dt.getDate()).slice(-2) + ' ' + monthNames[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + [('0' + hour).slice(-2),
                ('0' + dt.getMinutes()).slice(-2),
                ('0' + dt.getSeconds()).slice(-2)].join(':') + ' ' + amPm;
            return result;
        }
        return value;
    }

}