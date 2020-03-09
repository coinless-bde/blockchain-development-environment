import { ChangeDetectionStrategy, Component } from "@angular/core"
import { Connect, Effects, effects } from "ng-effects"
import { EditorMenubar, EditorMenubarLike } from "./editor-menubar"
import { Subject } from "rxjs"
import { ActivatedRoute } from "@angular/router"

@Component({
    selector: "bde-editor-menubar",
    template: `
        <div class="document">
            <div class="documentAuthor">{{ username }}</div>
            <div class="documentSeparator">/</div>
            <span class="documentTitle is-hidden" #output>{{ projectName || "untitled" }}</span>
            <input
                class="documentTitle"
                spellcheck="false"
                autocomplete="false"
                maxlength="80"
                placeholder="untitled"
                [value]="projectName"
                [style.width.px]="output.clientWidth"
                (input)="projectName = $any($event).target.value.trim()"
                #input
            />

            <div class="documentDeploy">
                <button bde-button color="primary" class="deployButton" (pressed)="deploy.next()">
                    Deploy
                </button>
            </div>
        </div>

        <div class="network">
            <bde-select
                class="networkSelect"
                placeholder="Select network"
                [(selected)]="selectedNetwork"
            >
                <bde-select-label>{{ selectedNetwork }}</bde-select-label>
                <bde-option
                    *ngFor="let option of networkOptions"
                    [value]="option"
                    [disabled]="option.disabled"
                    >{{ option.label }}</bde-option
                >
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
                <img src="https://api.adorable.io/avatars/48/{{ username }}.png" alt="" />
                <span>{{ username }}</span>
            </button>
            <button
                bde-button
                color="secondary"
                class="settingsPreviewToggle"
                (pressed)="splitPane = !splitPane"
            >
                <bde-codicon icon="symbol-boolean"></bde-codicon>
                <span>{{ splitPane ? "Close" : "Open" }}</span>
            </button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./editor-menubar.component.css"],
    providers: [Effects, EditorMenubar],
})
export class EditorMenubarComponent implements EditorMenubarLike {
    public splitPane: boolean
    public projectName: string
    public networkOptions = [
        {
            label: "1: Mainnet (Coming soon)",
            disabled: true,
        },
        {
            label: "2: Babylon (deprecated)",
            disabled: false,
        },
        {
            label: "3: Carthage",
            disabled: false,
        },
        {
            label: "4: Zeronet (Coming soon)",
            disabled: true,
        },
        {
            label: "5: Sandbox (Coming soon)",
            disabled: true,
        },
    ]
    public selectedNetwork = this.networkOptions[2]
    public username: string
    public deploy: Subject<void>

    constructor(connect: Connect, route: ActivatedRoute) {
        const { project, user } = route.snapshot.params
        this.username = user || "anonymous"
        this.projectName = project || ""
        this.splitPane = true
        this.deploy = new Subject()
        connect(this)
    }
}
