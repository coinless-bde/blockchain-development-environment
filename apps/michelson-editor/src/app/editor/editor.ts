import { Injectable } from "@angular/core"
import { Effect, State } from "ng-effects"
import { AppState } from "../state"
import { Store } from "../../store/store"

export interface EditorLike {
    splitPane: boolean
}

@Injectable()
export class Editor {
    constructor(private store: Store<AppState>) {}

    @Effect("splitPane")
    splitPane(_: State<EditorLike>) {
        return this.store.select(store => store.splitPane.expanded)
    }
}
