import { ChangeDetectionStrategy, Component, Renderer2, ViewChild } from "@angular/core"
import { changes, Connect, Context, Effect, Effects, State } from "ng-effects"
import { README } from "./default-documents/readme"
import { EXAMPLE } from "./default-documents/example"
import { MonacoEditorComponent } from "@coinless/vs-components"
import { AppState, appStore } from "../state"
import { Store } from "../../store/store"
import { filter, map, retry, switchMap, tap, withLatestFrom } from "rxjs/operators"
import { EditorService } from "../editor/editor.service"
import { fromEventPattern, Subject } from "rxjs"
import { JsonObject } from "../../store/interfaces"
import { ActivatedRoute, Router } from "@angular/router"

interface EditorContentState {
    id: number | null
    title: string
    code: string
    language: string
    readonly: boolean
}

export function coerceJson(value: any): value is JsonObject {
    return value
}

@Component({
    selector: "bde-editor-content",
    template: `
        <bde-editor-tabs [(selected)]="editorState">
            <bde-editor-tab class="tab" *ngFor="let tab of tabs" [value]="tab">
                <bde-codicon icon="list-selection"></bde-codicon>
                <span>{{ tab.title }}</span>
                <bde-codicon icon="close"></bde-codicon>
            </bde-editor-tab>
        </bde-editor-tabs>
        <bde-monaco-editor
            class="editor"
            [document]="editorState.code"
            [language]="editorState.language"
            (valueChanges)="editorState.code = $event; autoSave.next()"
        ></bde-monaco-editor>
    `,
    styleUrls: ["./editor-content.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects],
})
export class EditorContentComponent {
    public tabs: EditorContentState[] = [
        {
            id: null,
            title: "README.md",
            code: README,
            language: "markdown",
            readonly: true,
        },
        {
            id: null,
            title: "example.tz",
            code: EXAMPLE,
            language: "michelson",
            readonly: false,
        },
    ]

    public editorState: EditorContentState
    public saveAction: Subject<void>
    public autoSave: Subject<void>

    @ViewChild(MonacoEditorComponent)
    public monaco?: MonacoEditorComponent

    constructor(
        connect: Connect,
        private store: Store<AppState>,
        private editor: EditorService,
        private renderer: Renderer2,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        const file = this.route.snapshot.paramMap.get("file")
        this.editorState = this.tabs[file ? 1 : 0]
        this.saveAction = new Subject()
        this.autoSave = new Subject()
        connect(this)
    }

    // @Effect()
    // public autosave(state: State<EditorContentComponent>, context: Context<EditorContentComponent>) {
    //     state.autoSave.subscribe(() => {
    //         console.log('autosave!')
    //     })
    //     return state.autoSave.pipe(
    //         debounceTime(5000),
    //         switchMap(() => {
    //             console.log('context', context.editorState)
    //             const id = context.editorState.id
    //             return id === null ? NEVER : this.editor.autosave({ ...context.editorState, id })
    //         }),
    //         retry()
    //     )
    // }

    @Effect(Store)
    public storeEditorState(state: State<EditorContentComponent>) {
        return changes(state.editorState).pipe(
            appStore((store, value) => {
                store.editorState = coerceJson(value)
            }),
        )
    }

    @Effect({ markDirty: true })
    public loadFile(
        state: State<EditorContentComponent>,
        context: Context<EditorContentComponent>,
    ) {
        const file = this.route.snapshot.paramMap.get("file")
        if (file) {
            return this.editor.load(Number(file)).pipe(
                tap(res => {
                    context.tabs[1].code = res.code
                }),
            )
        }
    }

    @Effect()
    public updateId(
        state: State<EditorContentComponent>,
        context: Context<EditorContentComponent>,
    ) {
        return this.store
            .select(store => store.editor.id)
            .pipe(
                filter(id => id !== null),
                tap(id => {
                    context.editorState.id = id
                }),
            )
    }

    @Effect(Store)
    public save(state: State<EditorContentComponent>) {
        const renderer = this.renderer
        const save = fromEventPattern<KeyboardEvent>(listener)

        function listener(handler: (event: KeyboardEvent) => void) {
            return renderer.listen("document", "keydown.control.s", handler)
        }
        return save.pipe(
            tap(event => event.preventDefault()),
            withLatestFrom(state.editorState, (_, editorState) => editorState),
            switchMap(editor => {
                const file = Number(this.route.snapshot.paramMap.get("file"))
                editor.id = file || editor.id
                return this.editor.save(editor)
            }),
            map(res => res.id),
            tap(id => {
                const { project, user } = this.route.snapshot.params
                const url = this.router.createUrlTree([user, project || "untitled", id])
                this.router.navigateByUrl(url)
            }),
            appStore((store, id) => {
                store.editor.id = id
            }),
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
