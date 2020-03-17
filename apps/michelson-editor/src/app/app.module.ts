import { BrowserModule } from "@angular/platform-browser"
import { APP_INITIALIZER, NgModule } from "@angular/core"

import { AppComponent } from "./app.component"
import { RouterModule } from "@angular/router"
import { EditorComponent } from "./editor/editor.component"
import { EditorContentComponent } from "./editor-content/editor-content.component"
import { EditorSidebarComponent } from "./editor-sidebar/editor-sidebar.component"
import { EditorToolbarComponent } from "./editor-toolbar/editor-toolbar.component"
import { EditorMenubarComponent } from "./editor-menubar/editor-menubar.component"
import { EditorPreviewComponent } from "./editor-preview/editor-preview.component"
import { EditorTerminalComponent } from "./editor-terminal/editor-terminal.component"
import {
    ButtonModule,
    CodiconModule,
    FormFieldModule,
    InputModule,
    MonacoEditorModule,
    MonacoEditorService,
    SelectModule,
    TabsModule,
} from "@coinless/vs-components"
import { EditorTabsComponent } from "./editor-tabs/editor-tabs.component"
import { EditorTabComponent } from "./editor-tabs/editor-tab/editor-tab.component"
import { HttpClientModule } from "@angular/common/http"
import { StoreModule } from "../store/store"
import * as reducers from "./editor-state/reducers"
import { initialState } from "./editor-state/state"
import { EditorDeploymentComponent } from "./editor-deployment/editor-deployment.component"
import { ReactiveFormsModule } from "@angular/forms"
import { TreeModule } from "../../../../libs/vs-components/src/lib/tree/tree.module"
import { LabelModule } from "../../../../libs/vs-components/src/lib/label/label.module"

export function loadMonaco() {
    return () => new Promise(resolve => MonacoEditorService.loadMonaco(resolve))
}

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        EditorContentComponent,
        EditorSidebarComponent,
        EditorToolbarComponent,
        EditorMenubarComponent,
        EditorPreviewComponent,
        EditorTerminalComponent,
        EditorTabsComponent,
        EditorTabComponent,
        EditorDeploymentComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: "",
                    redirectTo: "/anonymous/",
                    pathMatch: "full",
                },
                {
                    path: ":user",
                    redirectTo: "/anonymous/",
                    pathMatch: "full",
                },
                {
                    path: ":user/:project",
                    component: EditorComponent,
                },
                {
                    path: ":user/:project/:file",
                    component: EditorComponent,
                },
            ],
            { initialNavigation: "enabled" },
        ),
        ButtonModule,
        SelectModule,
        CodiconModule,
        MonacoEditorModule,
        HttpClientModule,
        StoreModule.config(reducers, initialState),
        TabsModule,
        InputModule,
        FormFieldModule,
        ReactiveFormsModule,
        TreeModule,
        LabelModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: loadMonaco,
            deps: [],
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
