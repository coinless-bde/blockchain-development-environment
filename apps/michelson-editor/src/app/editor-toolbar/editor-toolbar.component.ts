import { Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-toolbar",
    template: `
        <p>
            editor-toolbar works!
        </p>
    `,
    styleUrls: ["./editor-toolbar.component.css"],
})
export class EditorToolbarComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
