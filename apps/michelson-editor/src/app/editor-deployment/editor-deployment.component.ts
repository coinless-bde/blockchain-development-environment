import { ChangeDetectionStrategy, Component } from "@angular/core"
import { Connect, Effects } from "ng-effects"

@Component({
    selector: "bde-editor-deployment",
    template: `
        <div>

        </div>
        <div>
            <div class="tabs">
                <button bde-flush-button class="tab">History</button>
                <button bde-flush-button class="tab">Settings</button>
            </div>
            <div class="settings">
                <ul class="settingsList">
                    <li>Basic</li>
                    <li>Advanced</li>
                </ul>
                <div class="settingsContent">
                    <h3>Basic</h3>

                    <div class="formField">
                        <label>Network</label>
                        <p>The network the smart contract will be deployed to.</p>
                        <bde-select>
                            <bde-option>1. Zeronet</bde-option>
                        </bde-select>
                    </div>

                    <div class="formField">
                        <label>Storage</label>
                        <p>The initial state of the storage.</p>
                        <bde-monaco-editor></bde-monaco-editor>
                    </div>

                    <h3>Advanced</h3>

                    <div class="formField">
                        <label>Contract Fee</label>
                        <p>Lorem ipsum</p>
                        <input />
                    </div>

                    <div class="formField">
                        <label>Storage Cap</label>
                        <p>Lorem ipsum</p>
                        <input />
                    </div>

                    <div class="formField">
                        <label>Gas Cap</label>
                        <p>Lorem ipsum</p>
                        <input />
                    </div>

                </div>
            </div>
        </div>
    `,
    styleUrls: ["./editor-deployment.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects]
})
export class EditorDeploymentComponent {
    constructor(connect: Connect) {
        connect(this)
    }
}
