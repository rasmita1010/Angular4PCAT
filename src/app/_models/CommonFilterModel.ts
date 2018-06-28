export class CommonFilterModel {

    TypeName: string;
    TypeID: number;
    IsSelected: boolean;

    constructor( _typeName: string, _typeID: number, _isselected: boolean) {
        this.TypeName = _typeName;
        this.TypeID = _typeID;
        this.IsSelected = _isselected;
    }
}
