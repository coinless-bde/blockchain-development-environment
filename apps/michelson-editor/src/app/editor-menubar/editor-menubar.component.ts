import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-menubar",
    template: `
        <div class="document">
            <div class="documentAuthor">@stupidawesome</div>
            <div class="documentSeparator">/</div>
            <span class="documentTitle is-hidden" #output>{{ title || "untitled" }}</span>
            <input
                class="documentTitle"
                spellcheck="false"
                autocomplete="false"
                maxlength="80"
                placeholder="untitled"
                [value]="title"
                [style.width.px]="output.clientWidth"
                (input)="title = $any($event).target.value.trim()"
                #input
            />

            <div class="documentDeploy">
                <button bde-button color="primary" class="deployButton">Deploy</button>
            </div>
        </div>

        <div class="network">
            <bde-select
                class="networkSelect"
                placeholder="Select network"
                [(selected)]="selectedNetwork"
            >
                <bde-select-label>{{ selectedNetwork }}</bde-select-label>
                <bde-option *ngFor="let option of networkOptions" [value]="option">{{
                    option
                }}</bde-option>
            </bde-select>

            <div class="networkAddress">
                <button bde-button>
                    <bde-codicon icon="files"></bde-codicon>
                    <span>KT1GgUJwMQoFayRYNwamRAYCvHBLzgorLoGo</span>
                </button>
            </div>
        </div>

        <div class="settings">
            <button bde-button class="settingsProfile">
                <img src="/assets/avatar/1.png" alt="" />
                <span>stupidawesome</span>
            </button>
            <button bde-button color="secondary" class="settingsPreviewToggle">
                <bde-codicon icon="symbol-boolean"></bde-codicon>
                <span>Close</span>
            </button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./editor-menubar.component.css"],
})
export class EditorMenubarComponent implements OnInit {
    title = ""

    networkOptions = ["1: Mainnet", "2: Babylon", "3: Carthage", "4: Zeronet", "5: Sandbox"]

    selectedNetwork = this.networkOptions[4]

    constructor() {}

    ngOnInit(): void {}
}
