import { ChangeDetectionStrategy, Component, Input } from "@angular/core"
import { Connect, Effects } from "ng-effects"

@Component({
    selector: "bde-tree-node",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./tree-node.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects]
})
export class TreeNodeComponent {
    @Input()
    dataSource: any[]

    constructor(connect: Connect) {
        this.dataSource = []
        connect(this)
    }
}
