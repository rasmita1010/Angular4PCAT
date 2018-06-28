import { Magazine } from './Magazine';

export class DemoOfferMagazineChannel {
    demoOffer: string;
    magazineList: Magazine[];
    availableMagazines: any[];

    constructor(_demoOffer: string, _magazineList: Magazine[], _availableMag: any[]) {
        this.demoOffer = _demoOffer;
        this.magazineList = _magazineList;
        this.availableMagazines = _availableMag;
    }
}
