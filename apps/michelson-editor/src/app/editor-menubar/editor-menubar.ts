import { Injectable } from "@angular/core"
import { changes, Context, Effect, State } from "ng-effects"
import { Actions, Store } from "../../store/store"
import { AppState, appStore } from "../state"
import { catchError, switchMap, tap, withLatestFrom } from "rxjs/operators"
import { EditorService } from "../editor/editor.service"
import { combineLatest, NEVER, Subject } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"

export interface EditorMenubarLike {
    splitPane: boolean
    deploy: Subject<void>
    projectName: string
    username: string
}

@Injectable()
export class EditorMenubar {
    constructor(
        private store: Store<AppState>,
        private actions: Actions,
        private editor: EditorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    @Effect<any>(Store, { whenRendered: true })
    public togglePreview(state: State<EditorMenubarLike>) {
        return changes(state.splitPane).pipe(
            appStore((store, value) => {
                store.splitPane.expanded = value
            }),
        )
    }

    @Effect("splitPane")
    public splitPane(_: State<EditorMenubarLike>) {
        return this.store.select(store => store.splitPane.expanded)
    }

    @Effect()
    public deploy(state: State<EditorMenubarLike>, context: Context<EditorMenubarLike>) {
        return context.deploy.pipe(
            withLatestFrom(this.store.select(store => store.editor), (_, editor) => editor),
            switchMap(() => {
                const id = Number(this.activatedRoute.snapshot.paramMap.get("file"))
                if (id) {
                    return this.editor.deploy({ id }).pipe(
                        catchError(error => {
                            console.error(error)
                            window.alert("Error in deployment, see console for details")
                            return NEVER
                        }),
                        tap(() => {
                            window.alert("Deployment succeeded!")
                        }),
                    )
                }
                return NEVER
            }),
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
