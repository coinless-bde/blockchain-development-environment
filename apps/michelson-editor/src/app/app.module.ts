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
import { ButtonModule, CodiconModule, SelectModule } from "@coinless/vs-components"
import { EditorTabsComponent } from "./editor-tabs/editor-tabs.component"
import { EditorTabComponent } from "./editor-tabs/editor-tab/editor-tab.component"
import { MonacoEditorModule } from "../../../../libs/vs-components/src/lib/monaco-editor/monaco-editor.module"

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
        RouterModule.forRoot([], { initialNavigation: "enabled" }),
        ButtonModule,
        SelectModule,
        CodiconModule,
        MonacoEditorModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
