import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
} from "@angular/core"
import { Connect, Effect, HOST_EFFECTS, State } from "ng-effects"
import * as Monaco from "monaco-editor"
import { editor } from "monaco-editor"
import { combineLatest, fromEventPattern, Observable } from "rxjs"
import { MICHELSON_TOKENS_PROVIDER } from "./michelson-language-definition"
import { isDefined } from "../utils"
import { filter, map, switchMap } from "rxjs/operators"
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
    providers: [HOST_EFFECTS],
})
export class MonacoEditorComponent {
    @Input()
    public document: string

    @Input()
    public language: string

    @Output()
    public valueChanges: EventEmitter<string>

    public instance?: IStandaloneCodeEditor

    public monaco?: typeof Monaco

    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef, connect: Connect) {
        this.nativeElement = elementRef.nativeElement
        this.valueChanges = new EventEmitter()
        this.document = ""
        this.language = "plaintext"
        this.instance = undefined
        this.monaco = undefined
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
            if (instance && document) {
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
                        monaco.editor.setModelLanguage(model, language)
                    }
                }
            },
        )
    }

    @Effect({ assign: true, whenRendered: true })
    public mountEditor({  }: State<MonacoEditorComponent>) {
        return new Observable<Partial<MonacoEditorComponent>>(subscriber => {
            const onGotAmdLoader = () => {
                // Load monaco
                window.require(["vs/editor/editor.main"], (monaco: any) => {
                    const instance = this.createEditor(monaco)

                    instance.onKeyUp(e => {
                        if (e.ctrlKey && e.keyCode === monaco.KeyCode.KEY_S) {
                            e.preventDefault()
                        }
                    })

                    subscriber.next({
                        instance,
                        monaco,
                    })
                })
            }
            // Load AMD loader if necessary
            if (!window.require) {
                const loaderScript = document.createElement("script")
                loaderScript.type = "text/javascript"
                loaderScript.src = "vs/loader.js"
                loaderScript.addEventListener("load", onGotAmdLoader)
                document.body.appendChild(loaderScript)
            } else {
                onGotAmdLoader()
            }
            return () => {
                if (this.instance) {
                    this.instance.dispose()
                }
            }
        })
    }

    private createEditor(monaco: any): IStandaloneCodeEditor {
        const langId = "michelson"

        // noinspection TypeScriptValidateJSTypes
        monaco.languages.register({
            id: langId,
            filenamePatterns: ["*.tz"],
            filenames: ["*.tz"],
            extension: [".tz"],
        })

        monaco.languages.setMonarchTokensProvider(langId, MICHELSON_TOKENS_PROVIDER)

        return monaco.editor.create(this.nativeElement, {
            value: ``,
            language: "michelson",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: {
                enabled: false,
            },
        })
    }
}
