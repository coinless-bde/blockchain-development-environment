import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-preview",
    template: `
<!--        <img src="preview/logo.png" alt="" />-->
    `,
    styleUrls: ["./editor-preview.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorPreviewComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
