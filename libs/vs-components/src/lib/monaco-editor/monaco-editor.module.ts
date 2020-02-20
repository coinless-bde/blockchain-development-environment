import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MonacoEditorComponent } from "./monaco-editor.component"

@NgModule({
    declarations: [MonacoEditorComponent],
    exports: [MonacoEditorComponent],
    imports: [CommonModule],
})
export class MonacoEditorModule {}
