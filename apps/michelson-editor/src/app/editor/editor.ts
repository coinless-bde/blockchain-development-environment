import { Injectable } from "@angular/core"
import { Effect, State } from "ng-effects"
import { AppState, mapToEvent } from "../editor-state/state"
import { Action, Events, ofType, select, Store } from "../../store/store"
import { DeploySmartContract, SaveFile } from "../editor-state/commands"
import { NEVER, Observable } from "rxjs"
import { EditorService } from "./editor.service"
import { catchError, ignoreElements, switchMap, tap, withLatestFrom } from "rxjs/operators"
import { FileSaved, SavedEditorState } from "../editor-state/events"
import { ActivatedRoute, Router } from "@angular/router"

export interface EditorLike {
    splitPane: boolean
}

@Injectable()
export class Editor {
    constructor(private store: Store<AppState>, private editor: EditorService, private events: Events, private route: ActivatedRoute, private router: Router) {}

    @Effect("splitPane")
    splitPane(_: State<EditorLike>) {
        return this.store.pipe(
            select(store => store.panes.expanded)
        )
    }

    @Action(DeploySmartContract)
    deploy(command: Observable<DeploySmartContract>) {
        return command.pipe(
            switchMap((id) => {
                return this.editor.deploy(id).pipe(
                    catchError(error => {
                        console.error(error)
                        window.alert("Error in deployment, see console for details")
                        return NEVER
                    }),
                    tap(() => {
                        window.alert("Deployment succeeded!")
                    }),
                )
            }),
            ignoreElements()
        )
    }

    @Action(SaveFile)
    saveFile(command: Observable<SaveFile>) {
        return command.pipe(
            switchMap(editor => {
                return this.editor.save(editor)
            }),
            mapToEvent(FileSaved)
        )
    }

    @Effect()
    redirectOnSave() {
        return this.events.pipe(
            ofType(FileSaved),
            withLatestFrom(this.route.params),
            switchMap(([file, {project, user }]) => {
                const url = this.router.createUrlTree([user, project || "untitled", file.id])
                return this.router.navigateByUrl(url)
            })
        )
    }
}
