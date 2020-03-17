import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    Injectable,
    Input,
    QueryList,
    TemplateRef,
} from "@angular/core"
import { Connect, Effect, Effects, HostRef, State } from "ng-effects"
import { queryList } from "../utils"
import { filter, map, mergeAll, mergeMap, observeOn, switchMapTo } from "rxjs/operators"
import { asapScheduler, combineLatest } from "rxjs"
import { ButtonLike } from "../cdk/interfaces"

export interface TabsLike {
    tabs?: QueryList<HostRef<TabLike>>,
    tabpanels?: QueryList<HostRef<TabPanelLike>>
    activeTab: string
    activePanel?: TemplateRef<void>
}
export abstract class TabsLike {}

export interface TabLike extends ButtonLike {
    selected: boolean
    controls: string
}
export abstract class TabLike {}

export interface TabPanelLike {
    id: string
    template: TemplateRef<void>
}
export abstract class TabPanelLike {}

@Injectable()
export class Tabs {
    @Effect("activeTab")
    selectTab(state: State<TabsLike>) {
        return queryList(state.tabs).pipe(
            mergeAll(),
            mergeMap(tab => tab.state.press.pipe(
                switchMapTo(tab.state.controls),
            ))
        )
    }

    @Effect("activePanel")
    renderActivePanel(state: State<TabsLike>) {
        return queryList(state.tabpanels).pipe(
            mergeAll(),
            mergeMap(tabpanel => combineLatest(tabpanel.state.template, tabpanel.state.id, state.activeTab).pipe(
                map(([template, id, activeTab]) => id === activeTab ? template : undefined),
                filter(value => value !== undefined),
            )),
            observeOn(asapScheduler)
        )
    }
}

export const TabsRef = {
    provide: TabsLike,
    useExisting: HostRef
}

@Component({
    selector: "bde-tabs",
    template: `
        <div class="tabs">
            <ng-content select="bde-tab"></ng-content>
        </div>
        <div class="tabPanel">
            <ng-container *ngTemplateOutlet="activePanel"></ng-container>
        </div>
    `,
    styleUrls: ["./tabs.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects, Tabs, TabsRef]
})
export class TabsComponent implements TabsLike {
    @Input()
    activeTab: string

    @ContentChildren(TabPanelLike)
    tabpanels?: QueryList<HostRef<TabPanelLike>>

    @ContentChildren(TabLike)
    tabs?: QueryList<HostRef<TabLike>>

    activePanel?: TemplateRef<void>

    constructor(connect: Connect) {
        this.activeTab = ""
        this.activePanel = undefined
        this.tabpanels = undefined
        this.tabs = undefined

        connect(this)
    }
}
