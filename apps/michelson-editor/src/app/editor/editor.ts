import { Injectable } from "@angular/core"
import { Context, Effect, State } from "ng-effects"
import { AppState, mapToErrorEvent, mapToEvent } from "../editor-state/state"
import { Action, Dispatch, Events, ofType, select, Store } from "../../store/store"
import { AutoSaveFile, DeploySmartContract, LoadFile, SaveFile, UpdateActiveEditor } from "../editor-state/commands"
import { NEVER, Observable } from "rxjs"
import { EditorService } from "./editor.service"
import { catchError, filter, ignoreElements, map, mergeMap, switchMap, take, tap, withLatestFrom } from "rxjs/operators"
import {
    FileAutoSaved,
    FileAutoSaveError,
    FileLoaded,
    FileLoadError,
    FileSaved,
    FileSaveError,
} from "../editor-state/events"
import { ActivatedRoute, Router } from "@angular/router"
import { isTruthy } from "../utils"

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

    @Dispatch(UpdateActiveEditor)
    readUrl() {
        const activeEditor = this.store.pipe(
            select(store => store.activeEditor)
        )
        return this.route.params.pipe(
            withLatestFrom(activeEditor, (params, editor) => ({...editor, id: params.file ? Number(params.file) : null })),
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
                return this.editor.save(editor).pipe(
                    mapToEvent(FileSaved),
                    mapToErrorEvent(FileSaveError)
                )
            }),
        )
    }

    @Action(AutoSaveFile)
    autoSaveFile(command: Observable<AutoSaveFile>) {
        return command.pipe(
            mergeMap(editorState => {
                const id = editorState.id
                return typeof id === "number"
                    ? this.editor.autosave({ ...editorState, id }).pipe(
                        mapToEvent(FileAutoSaved),
                        mapToErrorEvent(FileAutoSaveError)
                    )
                    : NEVER
            }),
        )
    }

    @Effect()
    redirectOnSave() {
        return this.events.pipe(
            ofType(FileSaved),
            withLatestFrom(this.route.params),
            switchMap(([file, { project, user, file: fileId }]) => {
                if (file.id !== fileId) {
                    const url = this.router.createUrlTree([user, project || "untitled", file.id])
                    return this.router.navigateByUrl(url)
                }
                return NEVER
            })
        )
    }

    @Dispatch(LoadFile)
    public loadFile() {
        return this.store.pipe(
            select(store => store.activeEditor.id),
            isTruthy(),
            map(id => ({ id }))
        )
    }

    @Action(LoadFile)
    public fetchFile(command: Observable<LoadFile>) {
        return command.pipe(
            mergeMap(({ id }) => this.editor.load(id).pipe(
                mapToEvent(FileLoaded),
                mapToErrorEvent(FileLoadError)
            ))
        )
    }
}
