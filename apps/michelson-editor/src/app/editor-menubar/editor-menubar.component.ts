import { ChangeDetectionStrategy, Component } from "@angular/core"
import { Connect, Effects, HostEmitter } from "ng-effects"
import { EditorMenubar, EditorMenubarLike } from "./editor-menubar"
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

            <div class="documentShare">
                <button bde-button (press)="copyUrl()">
                    <bde-codicon icon="files"></bde-codicon>
                    <span>Share</span>
                </button>
            </div>
        </div>

        <div class="network">
            <bde-select
                class="networkSelect"
                placeholder="Select network"
                [value]="activeNetwork"
                (valueChange)="changeActiveNetwork($event)"
            >
                <bde-option
                    *ngFor="let option of networks; let index = index"
                    [value]="index"
                    [disabled]="option.disabled"
                >{{ option.label }}</bde-option>
            </bde-select>
        </div>

        <div class="settings">
            <button bde-button class="settingsProfile">
                <img src="https://api.adorable.io/avatars/48/{{ username }}.png" alt=""/>
                <span>{{ username }}</span>
            </button>
            <button
                bde-button
                color="secondary"
                class="settingsPreviewToggle"
                (press)="splitPane = !splitPane"
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
    public networks: any[]
    public username: string
    public deploy: HostEmitter<number | null>
    public id: number | null
    public activeNetwork = 0
    public changeActiveNetwork: HostEmitter<number>

    constructor(connect: Connect, route: ActivatedRoute) {
        const { project, user, id } = route.snapshot.params
        this.username = user || "anonymous"
        this.networks = []
        this.projectName = project || ""
        this.splitPane = true
        this.deploy = new HostEmitter()
        this.changeActiveNetwork = new HostEmitter()
        this.id = id === undefined ? null : Number(id)

        connect(this)
    }

    copyUrl() {
        navigator.clipboard.writeText(window.location.href)
        window.alert("Share link added to clipboard.")
    }
}
