import { Injectable } from "@angular/core"
import { FormModel } from "../../../store/forms"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ChangeDeploymentConfig } from "../commands"

@Injectable({ providedIn: "root" })
export class DeployForm implements FormModel {
    model: FormGroup

    constructor(fb: FormBuilder) {
        this.model = fb.group({
            fileId: fb.control(null),
            code: fb.control(null),
            networkId: fb.control(0),
            storage: fb.control("", [Validators.required]),
            contractFee: fb.control("0"),
            storageCap: fb.control("0"),
            gasCap: fb.control("0"),
        })
    }
}

export const deploy = {
    model: DeployForm,
    dispatch: ChangeDeploymentConfig
}
