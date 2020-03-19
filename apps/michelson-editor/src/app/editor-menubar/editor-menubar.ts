import { Injectable } from "@angular/core"
import { changes, Effect, HostEmitter, latest, State } from "ng-effects"
import { Commands, Dispatch, Select, Store } from "../../store/store"
import { AppState, NetworkState } from "../editor-state/state"
import { map, tap } from "rxjs/operators"
import { EditorService } from "../editor/editor.service"
import { combineLatest } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { ChangeNetwork, TogglePreview } from "../editor-state/commands"
import { EditorDeploymentComponent } from "../editor-deployment/editor-deployment.component"

export interface EditorMenubarLike {
    splitPane: boolean
    deploy: HostEmitter<number | null>
    projectName: string
    username: string
    networks: NetworkState[]
    activeNetwork: number
    changeActiveNetwork: HostEmitter<number>
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

    @Dispatch(ChangeNetwork)
    changeNetwork(state: State<EditorMenubarLike>) {
        return state.changeActiveNetwork.pipe(
            map(id => ({ id }))
        )
    }

    @Select()
    public splitPane(): Select<AppState, EditorMenubarLike> {
        return {
            splitPane: state => state.panes.expanded,
            networks: state => state.networks,
            activeNetwork: state => state.activeNetwork
        }
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
