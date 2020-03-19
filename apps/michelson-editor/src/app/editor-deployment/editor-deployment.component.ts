import { ChangeDetectionStrategy, Component, Injectable } from "@angular/core"
import { Connect, Context, Effect, Effects, HostEmitter, State } from "ng-effects"
import { FormBuilder, FormGroup } from "@angular/forms"
import { AppState, DeployStatus, NetworkState } from "../editor-state/state"
import { Dispatch, Select, select, Store } from "../../store/store"
import { DeploySmartContract, UpdateDeployState } from "../editor-state/commands"
import { filter, map } from "rxjs/operators"

@Injectable()
export class EditorDeployment {
    @Select()
    mapStateToProps(): Select<AppState, EditorDeploymentComponent> {
        return {
            deployStatus: (state => state.deployStatus),
            networks: (state => state.networks),
        }
    }

    @Effect()
    mapStateToForm(@Context() context: Context<EditorDeploymentComponent>) {
        return this.store.pipe(
            select(store => store.deploy),
        ).subscribe(model => {
            context.model.patchValue(model, { emitEvent: false })
        })
    }

    @Dispatch(UpdateDeployState)
    updateDeployState(@Context() context: Context<EditorDeploymentComponent>) {
        return context.model.valueChanges
    }

    @Dispatch(DeploySmartContract)
    deploySmartContract(state: State<EditorDeploymentComponent>) {
        return state.deploy.pipe(
            filter(([model, deployStatus]) => model.valid && deployStatus.state !== "loading"),
            map(([model]) => model.value)
        )
    }

    constructor(private store: Store<AppState>) {
    }
}

@Component({
    selector: "bde-editor-deployment",
    template: `
        <div class="deployment">
            <h2 class="heading">Deploy Smart Contract</h2>
            <ul class="summary">
                <li class="summaryItem">
                    <span class="summaryLabel">Network</span>
                    <span class="summaryValue">Zeronet</span>
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
                    <span class="summaryValue">Configured</span>
                </li>
                <li class="summaryItem">
                    <span class="summaryLabel">Status</span>
                    <span class="summaryValue {{deployStatus.state}}" [ngSwitch]="deployStatus.state">
                        <ng-template ngSwitchCase="initial">Ready to deploy</ng-template>
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
    activeNetwork: number
    networks: NetworkState[]
    deploy: HostEmitter<[FormGroup, DeployStatus]>
    deployStatus: DeployStatus

    constructor(fb: FormBuilder, connect: Connect) {
        this.model = fb.group({
            fileId: fb.control(null),
            code: fb.control(null),
            networkId: fb.control(0),
            storage: fb.control(""),
            contractFee: fb.control("0"),
            storageCap: fb.control("0"),
            gasCap: fb.control("0"),
        })
        this.activeNetwork = 0
        this.networks = []
        this.deploy = new HostEmitter()
        this.deployStatus = DeployStatus.Initial()

        connect(this)
    }
}
