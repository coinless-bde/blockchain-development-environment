import { Directive, Optional, TemplateRef } from "@angular/core"

interface LabelContext<TSelectedValue = any> {
    $implicit: TSelectedValue
}

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "bde-select-label, [bdeSelectLabel]",
})
export class SelectLabelDirective {}
