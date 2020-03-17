import { ChangeDetectionStrategy, Component, HostBinding, Inject, Injectable, Input, Output } from "@angular/core"
import { Connect, Effect, Effects, HostEmitter, HostRef, State } from "ng-effects"
import { TabLike, TabsLike } from "../tabs.component"
import { asapScheduler, combineLatest } from "rxjs"
import { map, observeOn } from "rxjs/operators"
import { Button } from "../../cdk/button"
import { PressEvent } from "../../cdk/interfaces"

@Injectable()
export class Tab {
    constructor(@Inject(TabsLike) private tabs: HostRef<TabsLike>) {
    }

    @Effect("selected")
    isSelectedTab(state: State<TabLike>) {
        return combineLatest(this.tabs.state.activeTab, state.controls).pipe(
            map(([activeTab, controls]) => activeTab === controls),
            observeOn(asapScheduler)
        )
    }
}

const TabRef = {
    provide: TabLike,
    useExisting: HostRef,
}

@Component({
    selector: "bde-tab",
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ["./tab.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects, Button, Tab, TabRef],
})
export class TabComponent implements TabLike {
    @Input()
    controls: string

    @Input()
    @HostBinding("class.is-disabled")
    disabled: boolean

    @HostBinding("class.is-active")
    active: boolean

    @HostBinding("class.is-focus")
    focus: boolean

    @HostBinding("class.is-hover")
    hover: boolean

    @HostBinding("class.is-selected")
    selected: boolean

    @Output()
    press: HostEmitter<PressEvent>

    constructor(connect: Connect) {
        this.active = true
        this.controls = ""
        this.disabled = false
        this.focus = false
        this.hover = false
        this.press = new HostEmitter()
        this.selected = false

        connect(this)
    }
}
