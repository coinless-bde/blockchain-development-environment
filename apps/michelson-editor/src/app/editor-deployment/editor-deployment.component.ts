import { ChangeDetectionStrategy, Component, Injectable } from "@angular/core"
import { Connect, Effects, HostEmitter, State } from "ng-effects"
import { FormGroup } from "@angular/forms"
import { AppState, DeployStatusState, NetworkState } from "../editor-state/state"
import { Dispatch, Select } from "../../store/store"
import { DeploySmartContract } from "../editor-state/commands"
import { filter, map } from "rxjs/operators"
import { DeployForm } from "../editor-state/forms/deploy"
import { DeployStatus } from "../editor-state/state/deploy-status"

@Injectable()
export class EditorDeployment {
    @Select()
    mapStateToProps(): Select<AppState, EditorDeploymentComponent> {
        return {
            deployStatus: (state => state.deployStatus),
            networks: (state => state.networks),
        }
    }

    @Dispatch(DeploySmartContract)
    deploySmartContract(state: State<EditorDeploymentComponent>) {
        return state.deploy.pipe(
            filter(([model, deployStatus]) => model.valid && deployStatus.state !== "loading"),
            map(([model]) => model.value)
        )
    }

    constructor() {}
}

@Component({
    selector: "bde-editor-deployment",
    template: `
        <div class="deployment">
            <h2 class="heading">Deploy Smart Contract</h2>
            <ul class="summary">
                <li class="summaryItem">
                    <span class="summaryLabel">Network</span>
                    <span class="summaryValue">{{networks[model.controls.networkId.value].label}}</span>
                </li>
                <li class="summaryItem">
                    <span class="summaryLabel">File</span>
                    <span class="summaryValue">example.tz</span>
                </li>
                <li class="summaryItem">
                    <span class="summaryLabel">Validation</span>
                    <span class="summaryValue initial">Passed</span>
                </li>
                <li class="summaryItem">
                    <span class="summaryLabel">Storage</span>
                    <span class="summaryValue" [class.error]="!model.controls.storage.value">
                        {{ model.controls.storage.value ? "Configured" : "Not Configured"}}
                    </span>
                </li>
                <li class="summaryItem">
                    <span class="summaryLabel">Status</span>
                    <span class="summaryValue {{deployStatus.state}}" [class.invalid]="model.invalid" [ngSwitch]="deployStatus.state">
                        <ng-template ngSwitchCase="initial">
                            {{ model.valid ? "Ready to Deploy" : "Invalid Configuration" }}
                        </ng-template>
                        <ng-template ngSwitchCase="loading">Deploying</ng-template>
                        <ng-template ngSwitchCase="success">Deployed</ng-template>
                        <ng-template ngSwitchCase="error">Error</ng-template>
                    </span>
                </li>
            </ul>

            <bde-form-field class="select">
                <bde-label>Select a file</bde-label>
                <bde-select>
                    <bde-option [value]="1" [selected]="true">example.tz</bde-option>
                </bde-select>
                <button class="deploy" bde-button bdeSuffix color="primary" (press)="deploy(model, deployStatus)">Deploy</button>
            </bde-form-field>
        </div>
        <div class="section">
            <bde-tabs activeTab="2">
                <bde-tab class="tab" controls="1">History</bde-tab>
                <ng-template bdeTabPanel="1">
                    <br/>
                    Coming soon.
                </ng-template>

                <bde-tab controls="2">Settings</bde-tab>
                <ng-template bdeTabPanel="2">
                    <div class="settings">
                        <bde-tree [dataSource]="['Basic', 'Advanced']" class="settingsList">
                            <bde-tree-node *bdeTreeNodeDef="let data">{{data}}</bde-tree-node>
                        </bde-tree>
                        <form class="settingsContent" [formGroup]="model">
                            <h3>Basic</h3>

                            <bde-form-field class="formField">
                                <bde-label>Network</bde-label>
                                <p>The network the smart contract is deployed to.</p>
                                <bde-select
                                    class="networkSelect"
                                    placeholder="Select network"
                                    formControlName="networkId"
                                >
                                    <bde-option
                                        *ngFor="let option of networks; let index = index"
                                        [value]="index"
                                        [disabled]="option.disabled"
                                    >{{ option.label }}</bde-option>
                                </bde-select>
                            </bde-form-field>

                            <bde-form-field class="formField">
                                <bde-label>Storage</bde-label>
                                <p>The initial state of the smart contract storage.</p>
                                <bde-monaco-editor
                                    class="formFieldMonacoEditor"
                                    formControlName="storage"
                                ></bde-monaco-editor>
                            </bde-form-field>

                            <h3>Advanced</h3>

                            <bde-form-field class="formField">
                                <bde-label>Contract Fee</bde-label>
                                <p>The fee for running the contract. Contracts with higher fees get prioritized
                                    execution.</p>
                                <input bdeInput formControlName="contractFee"/>
                                <p class="tzSuffix" bdeSuffix>ꜩ</p>
                            </bde-form-field>

                            <bde-form-field class="formField">
                                <bde-label>Storage Cap</bde-label>
                                <p>The maximum spend for initial storage.</p>
                                <input bdeInput formControlName="storageCap"/>
                                <p class="tzSuffix" bdeSuffix>nano ꜩ</p>
                            </bde-form-field>

                            <bde-form-field class="formField">
                                <bde-label>Gas Cap</bde-label>
                                <p>The maximum spend for initialization.</p>
                                <input bdeInput formControlName="gasCap"/>
                                <p class="tzSuffix" bdeSuffix>nano ꜩ</p>
                            </bde-form-field>
                        </form>
                    </div>
                </ng-template>
            </bde-tabs>
        </div>
    `,
    styleUrls: ["./editor-deployment.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects, EditorDeployment],
})
export class EditorDeploymentComponent {
    model: FormGroup
    networks: NetworkState[]
    deploy: HostEmitter<[FormGroup, DeployStatusState]>
    deployStatus: DeployStatusState

    constructor(form: DeployForm, connect: Connect) {
        this.model = form.model
        this.networks = []
        this.deploy = new HostEmitter()
        this.deployStatus = DeployStatus.Initial()

        connect(this)
    }
}
