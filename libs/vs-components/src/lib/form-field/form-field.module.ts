import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormFieldComponent } from "./form-field.component"
import { PrefixDirective } from "./prefix.directive"
import { SuffixDirective } from "./suffix.directive"


@NgModule({
    declarations: [FormFieldComponent, PrefixDirective, SuffixDirective],
    exports: [
        FormFieldComponent,
        SuffixDirective,
    ],
    imports: [
        CommonModule,
    ],
})
export class FormFieldModule { }
