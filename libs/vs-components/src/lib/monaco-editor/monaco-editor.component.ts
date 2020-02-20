import { ChangeDetectionStrategy, Component, ElementRef, Input } from "@angular/core"
import { Connect, Effect, HOST_EFFECTS, State } from "ng-effects"
import * as Monaco from "monaco-editor"
import { editor } from "monaco-editor"
import { combineLatest, Observable } from "rxjs"
import { MICHELSON_TOKENS_PROVIDER } from "./michelson-language-definition"
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
    public document = ""

    @Input()
    public language = "plaintext"

    public instance?: IStandaloneCodeEditor

    public monaco?: typeof Monaco

    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef, connect: Connect) {
        this.nativeElement = elementRef.nativeElement
        this.instance = undefined
        this.monaco = undefined
        connect(this)
    }

    @Effect()
    loadDocument(state: State<MonacoEditorComponent>) {
        return combineLatest(state.document, state.instance).subscribe(([document, instance]) => {
            if (instance) {
                instance.setValue(document)
            }
        })
    }

    @Effect()
    setLanguage(state: State<MonacoEditorComponent>) {
        return combineLatest(state.language, state.instance, state.monaco).subscribe(
            ([language, instance, monaco]) => {
                console.log("set!", language, instance, monaco)
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
    mountEditor({  }: State<MonacoEditorComponent>) {
        return new Observable<Partial<MonacoEditorComponent>>(subscriber => {
            const onGotAmdLoader = () => {
                // Load monaco
                window.require(["vs/editor/editor.main"], (monaco: any) => {
                    subscriber.next({
                        instance: this.createEditor(monaco),
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

    createEditor(monaco: any): IStandaloneCodeEditor {
        const langId = "michelson"

        // noinspection TypeScriptValidateJSTypes
        monaco.languages.register({
            id: langId,
            aliases: ["tz"],
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
