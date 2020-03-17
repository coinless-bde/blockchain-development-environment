import { ChangeDetectionStrategy, Component, ContentChild, Injectable, Input, TemplateRef } from "@angular/core"
import { TreeNodeDefDirective } from "./tree-node-def.directive"
import { TreeControl } from "@angular/cdk/tree"

@Injectable()
export class Tree {

}

export class TreeLike {}


@Component({
    selector: "bde-tree",
    template: `
        <ng-container *ngFor="let data of dataSource; template: treeNodeDef"></ng-container>
    `,
    styleUrls: ["./tree.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent implements TreeLike {
    @Input()
    dataSource: any[]

    @Input()
    treeControl?: TreeControl<any>

    @ContentChild(TreeNodeDefDirective, { read: TemplateRef })
    treeNodeDef?: TemplateRef<any>

    constructor() {
        this.dataSource = []
        this.treeControl = undefined
        this.treeNodeDef = undefined
    }
}
