import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"

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
    MonacoEditorModule,
    SelectModule,
} from "@coinless/vs-components"
import { EditorTabsComponent } from "./editor-tabs/editor-tabs.component"
import { EditorTabComponent } from "./editor-tabs/editor-tab/editor-tab.component"
import { withInitialState } from "../store/store"
import { AppState, initialState } from "./state"
import { HttpClientModule } from "@angular/common/http"

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
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: "",
                    component: EditorComponent,
                },
                {
                    path: ":user",
                    component: EditorComponent,
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
    ],
    providers: [withInitialState<AppState>(initialState)],
    bootstrap: [AppComponent],
})
export class AppModule {}
