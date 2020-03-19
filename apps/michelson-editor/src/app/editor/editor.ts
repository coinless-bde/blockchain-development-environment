import { Injectable } from "@angular/core"
import { Effect, State } from "ng-effects"
import { AppState} from "../editor-state/state"
import { Action, Dispatch, Events, ofType, select, Store } from "../../store/store"
import { AutoSaveFile, DeploySmartContract, LoadFile, SaveFile, UpdateActiveEditor } from "../editor-state/commands"
import { NEVER, Observable } from "rxjs"
import { EditorService } from "./editor.service"
import { catchError, ignoreElements, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators"
import {
    FileAutoSaved,
    FileAutoSaveError,
    FileLoaded,
    FileLoadError,
    FileSaved,
    FileSaveError, SmartContractDeployed, SmartContractDeployError,
} from "../editor-state/events"
import { ActivatedRoute, Router } from "@angular/router"
import { isTruthy } from "../utils"
import { errorType, type } from "../editor-state/types"

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
                    type(SmartContractDeployed),
                    errorType(SmartContractDeployError)
                )
            })
        )
    }

    @Action(SaveFile)
    saveFile(command: Observable<SaveFile>) {
        return command.pipe(
            switchMap(editor => {
                return this.editor.save(editor).pipe(
                    type(FileSaved),
                    errorType(FileSaveError)
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
                        type(FileAutoSaved),
                        errorType(FileAutoSaveError)
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
                type(FileLoaded),
                errorType(FileLoadError)
            ))
        )
    }
}
