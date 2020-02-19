import { NgModule } from "@angular/core"
import { SelectComponent } from "./select.component"
import { OptionComponent } from "./option.component"
import { OverlayModule } from "@angular/cdk/overlay"
import { SelectLabelDirective } from "./select-label.directive"
import { CommonModule } from "@angular/common"
import { CodiconModule } from "../codicon/codicon.module"

@NgModule({
    declarations: [SelectComponent, OptionComponent, SelectLabelDirective],
    imports: [OverlayModule, CommonModule, CodiconModule],
    exports: [SelectComponent, OptionComponent, SelectLabelDirective],
})
export class SelectModule {}
