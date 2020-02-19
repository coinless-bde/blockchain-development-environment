import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-sidebar",
    template: `
        <div class="header">
            <h5>Explorer</h5>
        </div>
        <div class="panel-header">
            <bde-codicon icon="chevron-down"></bde-codicon>
            <h4>History</h4>
        </div>
        <div class="panel-content">
            <button bde-flush-button class="item is-selected">
                <bde-codicon icon="primitive-dot"></bde-codicon>
                <span>Now</span>
            </button>
            <button bde-flush-button class="item">
                <bde-codicon></bde-codicon>
                <span>15 minutes ago</span>
            </button>
            <button bde-flush-button class="item">
                <bde-codicon></bde-codicon>
                <span>1 day ago</span>
            </button>
            <button bde-flush-button class="item">
                <bde-codicon></bde-codicon>
                <span>8 days ago</span>
            </button>
        </div>
    `,
    styleUrls: ["./editor-sidebar.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorSidebarComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
