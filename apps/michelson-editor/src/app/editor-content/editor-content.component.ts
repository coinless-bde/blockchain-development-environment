import { ChangeDetectionStrategy, Component, Renderer2, ViewChild } from "@angular/core"
import { Connect, Effects, HostEmitter, State } from "ng-effects"
import { MonacoEditorComponent } from "@coinless/vs-components"
import { AppState, EditorState } from "../editor-state/state"
import { Dispatch, Select, Store } from "../../store/store"
import { debounceTime, filter, map, retry, tap, withLatestFrom } from "rxjs/operators"
import { EditorService } from "../editor/editor.service"
import { combineLatest, fromEventPattern, Subject } from "rxjs"
import { AutoSaveFile, SaveFile, UpdateActiveEditor } from "../editor-state/commands"
import { isTruthy } from "../utils"

@Component({
    selector: "bde-editor-content",
    template: `
        <bde-editor-tabs [(value)]="selected">
            <bde-editor-tab class="tab" *ngFor="let tab of tabs; let index = index" [value]="index">
                <bde-codicon icon="list-selection"></bde-codicon>
                <span>{{ tab.title }}</span>
                <bde-codicon icon="close"></bde-codicon>
            </bde-editor-tab>
        </bde-editor-tabs>
        <ng-container [ngSwitch]="selected">
            <ng-container *ngSwitchCase="2">
                <bde-editor-deployment></bde-editor-deployment>
            </ng-container>
            <ng-container *ngSwitchDefault>
                <bde-monaco-editor
                    class="editor"
                    [value]="editorState.code"
                    [language]="editorState.language"
                    (valueChange)="valueChanges($event)"
                ></bde-monaco-editor>
            </ng-container>
        </ng-container>
    `,
    styleUrls: ["./editor-content.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects],
})
export class EditorContentComponent {
    public tabs: EditorState[]
    public editorState: EditorState
    public saveAction: Subject<void>
    public autoSave: Subject<void>
    public valueChanges: HostEmitter<string>
    public selected: number

    @ViewChild(MonacoEditorComponent)
    public monaco?: MonacoEditorComponent

    constructor(
        connect: Connect,
        private store: Store<AppState>,
        private editor: EditorService,
        private renderer: Renderer2,
    ) {
        this.tabs = []
        this.selected = 2
        this.editorState = this.tabs[this.selected]
        this.saveAction = new Subject()
        this.autoSave = new Subject()
        this.valueChanges = new HostEmitter()
        connect(this)
    }

    @Dispatch(AutoSaveFile)
    public autosave(state: State<EditorContentComponent>) {
        return this.persistValueChanges(state).pipe(
            debounceTime(5000)
        )
    }

    @Dispatch(UpdateActiveEditor)
    public persistValueChanges(state: State<EditorContentComponent>) {
        return this.valueChanges.pipe(
            withLatestFrom(state.editorState, (code, editorState) => ({ ...editorState, code })),
        )
    }

    @Dispatch(UpdateActiveEditor)
    public storeEditorState(state: State<EditorContentComponent>) {
        return combineLatest(state.selected, state.tabs).pipe(
            map(([index, tabs]) => tabs[index]),
            isTruthy()
        )
    }

    @Select()
    public select(): Select<AppState, EditorContentComponent> {
        return {
            editorState: state => state.activeEditor,
            tabs: state => state.openTabs
        }
    }

    @Dispatch(SaveFile)
    public save(state: State<EditorContentComponent>) {
        const renderer = this.renderer
        const save = fromEventPattern<KeyboardEvent>(listener)

        function listener(handler: (event: KeyboardEvent) => void) {
            return renderer.listen("document", "keydown.control.s", handler)
        }

        return save.pipe(
            tap(event => event.preventDefault()),
            withLatestFrom(state.editorState, (_, editorState) => editorState),
            filter(editorState => !editorState.readonly),
            retry(),
        )
    }
}
