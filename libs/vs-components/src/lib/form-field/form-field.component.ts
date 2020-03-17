import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    HostBinding,
    Injectable,
    ViewEncapsulation,
} from "@angular/core"
import { Connect, Effects } from "ng-effects"
import { NgControl } from "@angular/forms"
import { PrefixDirective } from "./prefix.directive"
import { SuffixDirective } from "./suffix.directive"

@Injectable()
export class FormField {
    constructor() {
    }
}

export interface FormFieldLike {
    control?: NgControl
}

@Component({
    selector: "bde-form-field",
    template: `
        <ng-content select="bde-label"></ng-content>
        <ng-content></ng-content>
        <ng-content select="[bdeInput], bde-select, bde-monaco-editor"></ng-content>
        <ng-content select="bde-error"></ng-content>
    `,
    styleUrls: ["./form-field.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects, FormField],
    encapsulation: ViewEncapsulation.None,
    host: {
        "class": "bdeFormField",
        "[class.ng-untouched]": "control?.untouched",
        "[class.ng-touched]": "control?.touched",
        "[class.ng-pristine]": "control?.pristine",
        "[class.ng-dirty]": "control?.dirty",
        "[class.ng-valid]": "control?.valid",
        "[class.ng-invalid]": "control?.invalid",
        "[class.ng-pending]": "control?.pending",
    },
})
export class FormFieldComponent implements FormFieldLike {
    @ContentChild(NgControl)
    control?: NgControl

    @ContentChild(PrefixDirective)
    @HostBinding("class.is-prefixed")
    prefix?: PrefixDirective

    @ContentChild(SuffixDirective)
    @HostBinding("class.is-suffixed")
    suffix?: SuffixDirective

    constructor(connect: Connect) {
        this.prefix = undefined
        this.suffix = undefined
        this.control = undefined
        connect(this)
    }
}
