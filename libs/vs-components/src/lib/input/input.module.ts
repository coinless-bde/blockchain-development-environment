import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { InputDirective } from "./input.directive"

@NgModule({
    declarations: [InputDirective],
    exports: [
        InputDirective,
    ],
    imports: [
        CommonModule,
    ],
})
export class InputModule { }
