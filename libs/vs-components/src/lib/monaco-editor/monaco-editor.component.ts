import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from "@angular/core"
import { Connect, Context, Effect, Effects, HostEmitter, Observe, State } from "ng-effects"
import { editor } from "monaco-editor"
import { combineLatest, fromEventPattern, Observable } from "rxjs"
import { isDefined } from "../utils"
import { debounceTime, filter, map, switchMap, throttleTime } from "rxjs/operators"
import { IMonaco, MONACO } from "./monaco-editor.service"
import { FormFieldLike } from "../cdk/interfaces"
import { FormField } from "../cdk/form-field"
import { NG_VALUE_ACCESSOR } from "@angular/forms"
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor

@Component({
    selector: "bde-monaco-editor",
    template: ``,
    styleUrls: ["./monaco-editor.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [Effects, FormField, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: MonacoEditorComponent,
        multi: true
    }],
    host: {
        class: "bdeMonacoEditor"
    }
})
export class MonacoEditorComponent implements FormFieldLike {
    @Input()
    public value: string

    @Input()
    disabled: boolean

    @Input()
    public language: string

    @Output()
    public valueChange: HostEmitter<string>

    public instance?: IStandaloneCodeEditor

    public monaco: IMonaco

    public registerOnChange: HostEmitter<(value: any) => any>
    public registerOnTouched: HostEmitter<Function>
    public setDisabledState: HostEmitter<boolean>
    public writeValue: HostEmitter<any>

    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef, @Inject(MONACO) monaco: IMonaco, connect: Connect) {
        this.nativeElement = elementRef.nativeElement
        this.valueChange = new HostEmitter(true)
        this.value = ""
        this.disabled = false
        this.language = "plaintext"
        this.instance = undefined
        this.monaco = monaco
        this.registerOnChange = new HostEmitter()
        this.registerOnTouched = new HostEmitter()
        this.setDisabledState = new HostEmitter()
        this.writeValue = new HostEmitter()

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
                debounceTime(50),
            )
            .subscribe(this.valueChange)
    }

    @Effect()
    public loadDocument(state: State<MonacoEditorComponent>) {
        return combineLatest(state.value, state.instance).subscribe(([document, instance]) => {
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
        context.instance = context.monaco.editor.create(this.nativeElement, {
            value: ``,
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
            throttleTime(50)
        ).subscribe(() => {
            if (this.instance) {
                this.instance.layout()
            }
        })
    }
}
