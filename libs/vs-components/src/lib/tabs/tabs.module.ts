import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TabComponent } from "./tab/tab.component"
import { TabPanelDirective } from "./tabpanel/tab-panel-directive"
import { TabsComponent } from "./tabs.component"


@NgModule({
    declarations: [TabsComponent, TabComponent, TabPanelDirective],
    exports: [
        TabsComponent,
        TabComponent,
        TabPanelDirective,
    ],
    imports: [
        CommonModule,
    ],
})
export class TabsModule { }
