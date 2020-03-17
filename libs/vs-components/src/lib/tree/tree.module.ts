import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TreeComponent } from "./tree.component"
import { TreeNodeComponent } from "./tree-node/tree-node.component"
import { TreeNodeDefDirective } from "./tree-node-def.directive"


@NgModule({
    declarations: [TreeComponent, TreeNodeComponent, TreeNodeDefDirective],
    exports: [
        TreeComponent,
        TreeNodeComponent,
        TreeNodeDefDirective
    ],
    imports: [
        CommonModule,
    ],
})
export class TreeModule { }
