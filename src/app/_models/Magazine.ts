import {MagazineChannel } from './magazinechannel';


export class Magazine {
    MagazineName: string;
    channelList: MagazineChannel[];
    isPublished: boolean;
    added: boolean;

    constructor(_magName: string, _channelList: MagazineChannel[], _isPublished?: boolean, _added?: boolean) {
        this.MagazineName = _magName;
        this.channelList = _channelList;
        this.isPublished = _isPublished;
        this.added = _added;
    }
}
