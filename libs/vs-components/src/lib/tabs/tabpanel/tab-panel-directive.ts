import { Directive, Input, TemplateRef } from "@angular/core"
import { TabPanelLike } from "../tabs.component"
import { Connect, Effects, HostRef } from "ng-effects"

const TabPanelRef = {
    provide: TabPanelLike,
    useExisting: HostRef
}

@Directive({
    selector: "[bdeTabPanel]",
    providers: [Effects, TabPanelRef],
})
export class TabPanelDirective implements TabPanelLike {
    @Input("bdeTabPanel")
    id: string

    template: TemplateRef<void>

    constructor(template: TemplateRef<void>, connect: Connect) {
        this.id = ""
        this.template = template

        connect(this)
    }
}
