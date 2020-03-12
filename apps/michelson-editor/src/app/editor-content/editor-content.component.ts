import { ChangeDetectionStrategy, Component, Renderer2, ViewChild } from "@angular/core"
import { Connect, Context, Effect, Effects, HostEmitter, State } from "ng-effects"
import { README } from "./default-documents/readme"
import { EXAMPLE } from "./default-documents/example"
import { MonacoEditorComponent } from "@coinless/vs-components"
import { AppState, EditorState } from "../editor-state/state"
import { Dispatch, Select, select, Store } from "../../store/store"
import { debounceTime, filter, map, retry, tap, withLatestFrom } from "rxjs/operators"
import { EditorService } from "../editor/editor.service"
import { combineLatest, fromEventPattern, Subject } from "rxjs"
import { ActivatedRoute } from "@angular/router"
import { AutoSaveFile, SaveFile, UpdateActiveEditor } from "../editor-state/commands"
import { isTruthy } from "../utils"

@Component({
    selector: "bde-editor-content",
    template: `
        <bde-editor-tabs [(selected)]="selected">
            <bde-editor-tab class="tab" *ngFor="let tab of tabs; let index = index" [value]="index">
                <bde-codicon icon="list-selection"></bde-codicon>
                <span>{{ tab.title }}</span>
                <bde-codicon icon="close"></bde-codicon>
            </bde-editor-tab>
        </bde-editor-tabs>
        <bde-monaco-editor
            class="editor"
            [document]="editorState.code"
            [language]="editorState.language"
            (valueChanges)="valueChanges($event)"
        ></bde-monaco-editor>
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
        private route: ActivatedRoute,
    ) {
        this.tabs = []
        this.selected = 0
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
            selected: state => state.activeEditor.id ? 1 : 0,
            tabs: state => state.openFiles
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
            retry(),
        )
    }

    @Effect()
    public resize() {
        this.store.subscribe(() => {
            setTimeout(() => {
                if (this.monaco && this.monaco.instance) {
                    this.monaco.instance.layout()
                }
            })
        })
    }
}
