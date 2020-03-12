import { Injectable } from "@angular/core"
import { changes, Context, Effect, HostEmitter, latest, State } from "ng-effects"
import { Commands, Dispatch, Select, Store } from "../../store/store"
import { AppState } from "../editor-state/state"
import { tap } from "rxjs/operators"
import { EditorService } from "../editor/editor.service"
import { combineLatest } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { DeploySmartContract, TogglePreview } from "../editor-state/commands"
import { truthy } from "../utils"

export interface EditorMenubarLike {
    splitPane: boolean
    deploy: HostEmitter<{ id: number | null }>
    projectName: string
    username: string
}

@Injectable()
export class EditorMenubar {
    constructor(
        private store: Store<AppState>,
        private actions: Commands,
        private editor: EditorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    @Dispatch(TogglePreview)
    public togglePreview(state: State<EditorMenubarLike>) {
        return latest({
            expanded: changes(state.splitPane)
        })
    }

    @Select()
    public splitPane(): Select<AppState, EditorMenubarLike> {
        return {
            splitPane: state => state.panes.expanded
        }
    }

    @Dispatch(DeploySmartContract)
    public deploy(state: State<EditorMenubarLike>, context: Context<EditorMenubarLike>) {
        return context.deploy.pipe(
            truthy()
        )
    }

    @Effect()
    public projectName(state: State<EditorMenubarLike>) {
        const file = this.activatedRoute.snapshot.paramMap.get("file")
        return combineLatest([state.projectName, state.username]).pipe(
            tap(([project, user]) => {
                this.router.navigateByUrl(
                    file ? `/${user}/${project}/${file}` : `/${user}/${project}`,
                    { replaceUrl: true },
                )
            }),
        )
    }
}
