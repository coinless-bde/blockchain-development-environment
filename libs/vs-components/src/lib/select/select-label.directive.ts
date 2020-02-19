import { Directive } from "@angular/core"

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "bde-select-label, [bdeSelectLabel]",
})
export class SelectLabelDirective {}
