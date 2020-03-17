import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from "@angular/core"
import { Connect, Context, Effect, Effects, Observe, State } from "ng-effects"
import { editor } from "monaco-editor"
import { combineLatest, fromEventPattern, Observable } from "rxjs"
import {
    MICHELSON_COMPLETION_PROVIDER,
    MICHELSON_HOVER_PROVIDER,
    MICHELSON_ONTYPE_PROVIDER,
    MICHELSON_TOKENS_PROVIDER,
} from "./michelson-language-definition"
import { isDefined } from "../utils"
import { filter, map, switchMap, throttleTime } from "rxjs/operators"
import { IMonaco, MONACO } from "./monaco-editor.service"
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor

interface Window {
    require: any
}

declare var window: Window

@Component({
    selector: "bde-monaco-editor",
    template: ``,
    styleUrls: ["./monaco-editor.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [Effects],
    host: {
        class: "bdeMonacoEditor"
    }
})
export class MonacoEditorComponent {
    @Input()
    public document: string

    @Input()
    public language: string

    @Output()
    public valueChanges: EventEmitter<string>

    public instance?: IStandaloneCodeEditor

    public monaco: IMonaco

    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef, @Inject(MONACO) monaco: IMonaco, connect: Connect) {
        this.nativeElement = elementRef.nativeElement
        this.valueChanges = new EventEmitter()
        this.document = ""
        this.language = "plaintext"
        this.instance = undefined
        this.monaco = monaco
        connect(this)
    }

    @Effect()
    public didChangeModelContent(state: State<MonacoEditorComponent>) {
        return state.instance
            .pipe(
                filter(isDefined),
                switchMap(instance => {
                    function listen(handler: (event: any) => void) {
                        instance.onDidChangeModelContent(handler)
                    }

                    return fromEventPattern(listen).pipe(map(() => instance.getValue()))
                }),
            )
            .subscribe(this.valueChanges)
    }

    @Effect()
    public loadDocument(state: State<MonacoEditorComponent>) {
        return combineLatest(state.document, state.instance).subscribe(([document, instance]) => {
            if (instance && document && document !== instance.getValue()) {
                instance.setValue(document)
            }
        })
    }

    @Effect()
    public setLanguage(state: State<MonacoEditorComponent>) {
        return combineLatest(state.language, state.instance, state.monaco).subscribe(
            ([language, instance, monaco]) => {
                if (instance && monaco) {
                    const model = instance.getModel()
                    if (model) {
                        const currentLanguage = model.getModeId()
                        if (language !== currentLanguage) {
                            monaco.editor.setModelLanguage(model, language)
                        }
                    }
                }
            },
        )
    }

    @Effect({ whenRendered: true })
    public mountEditor(@Context() context: MonacoEditorComponent) {
        context.instance = this.createEditor(this.monaco)
    }

    private createEditor(monaco: any): IStandaloneCodeEditor {
        const langId = "michelson"

        monaco.languages.register({
            id: langId,
            aliases: ["tz"],
        })

        monaco.languages.registerCompletionItemProvider(langId, MICHELSON_COMPLETION_PROVIDER)
        monaco.languages.setMonarchTokensProvider(langId, MICHELSON_TOKENS_PROVIDER)
        monaco.languages.registerHoverProvider(langId, MICHELSON_HOVER_PROVIDER)
        monaco.languages.registerOnTypeFormattingEditProvider(langId, MICHELSON_ONTYPE_PROVIDER)

        return monaco.editor.create(this.nativeElement, {
            value: ``,
            language: langId,
            theme: "vs-dark",
            automaticLayout: true,
            minimap: {
                enabled: false,
            },
            // renderWhitespace: "all",
            useTabStops: true,
            tabCompletion: "on",
            formatOnType: true,
            acceptSuggestionOnCommitCharacter: true,
        })
    }

    @Effect()
    resize(@Observe() observer: Observable<any>) {
        return observer.pipe(
            throttleTime(0)
        ).subscribe(() => {
            if (this.instance) {
                this.instance.layout()
            }
        })
    }
}
