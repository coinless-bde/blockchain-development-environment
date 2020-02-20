import { ChangeDetectionStrategy, Component } from "@angular/core"
import { HOST_EFFECTS } from "ng-effects"
import { README } from "./default-documents/readme"
import { EXAMPLE } from "./default-documents/example"

@Component({
    selector: "bde-editor-content",
    template: `
        <bde-editor-tabs [(selected)]="selectedValue">
            <bde-editor-tab class="tab" *ngFor="let tab of tabs" [value]="tab">
                <bde-codicon icon="list-selection"></bde-codicon>
                <span>{{ tab.title }}</span>
                <bde-codicon icon="close"></bde-codicon>
            </bde-editor-tab>
        </bde-editor-tabs>
        <bde-monaco-editor
            [document]="selectedValue.document"
            [language]="selectedValue.language"
        ></bde-monaco-editor>
    `,
    styleUrls: ["./editor-content.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [HOST_EFFECTS],
})
export class EditorContentComponent {
    public tabs = [
        {
            title: "README.md",
            document: README,
            language: "markdown",
        },
        {
            title: "example.tz",
            document: EXAMPLE,
            language: "michelson",
        },
    ]
    public selectedValue = this.tabs[0]
}
