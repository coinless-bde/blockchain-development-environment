import { Component, OnInit } from "@angular/core"

@Component({
    selector: "bde-editor-menubar",
    template: `
        <div class="document">
            <div class="documentAuthor">@stupidawesome</div>
            <div class="documentSeparator">/</div>
            <h3 class="documentTitle">untitled</h3>
        </div>

        <div class="deploy">
            <button bde-button class="deployButton">Deploy</button>
        </div>

        <div class="network">
            <bde-select
                class="networkSelect"
                [(selected)]="selectedNetwork"
                placeholder="Select network"
            >
                <bde-select-label>{{ selectedNetwork }}</bde-select-label>
                <bde-option>----</bde-option>
                <bde-option *ngFor="let option of networkOptions" [value]="option">{{
                    option
                }}</bde-option>
            </bde-select>

            <div class="networkAddress">
                <i></i>
                <div>KT1GgUJwMQoFayRYNwamRAYCvHBLzgorLoGo</div>
            </div>
        </div>
    `,
    styleUrls: ["./editor-menubar.component.css"],
})
export class EditorMenubarComponent implements OnInit {
    networkOptions = ["1: Mainnet", "2: Babylon", "3: Carthage", "4: Zeronet", "5: Sandbox"]

    selectedNetwork = this.networkOptions[4]

    constructor() {}

    ngOnInit(): void {}
}
