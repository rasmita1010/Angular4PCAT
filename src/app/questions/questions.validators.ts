import { AbstractControl, ValidatorFn } from '@angular/forms';

// validation function
export class QuestionValidators {
    static FieldsEmptyCheck(control: AbstractControl) {
        return (control.value.trim() === '') ? { isEmpty: true } : null;
    }

    static FieldsSelectedCheck(control: AbstractControl) {
        return (control.value == 0) ? { unSelected: true } : null;
    }
}
