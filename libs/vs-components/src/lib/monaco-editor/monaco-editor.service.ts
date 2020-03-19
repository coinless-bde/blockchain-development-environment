import { Inject, Injectable, InjectionToken } from "@angular/core"
import * as IMonaco from "monaco-editor"
import {
    MICHELSON_COMPLETION_PROVIDER,
    MICHELSON_HOVER_PROVIDER, MICHELSON_ONTYPE_PROVIDER,
    MICHELSON_TOKENS_PROVIDER,
} from "./michelson-language-definition"

interface Window {
    require: any
}

declare var window: Window

let globalMonaco: typeof IMonaco

export type IMonaco = typeof IMonaco

export const MONACO = new InjectionToken<typeof IMonaco>("MONACO", { providedIn: "root", factory: () => {
    if (globalMonaco) {
        return globalMonaco
    } else {
        throw new Error("Monaco editor not loaded")
    }
}})

function registerLanguages(monaco: IMonaco) {
    const langId = "michelson"

    monaco.languages.register({
        id: langId,
        aliases: ["tz"],
    })

    monaco.languages.registerCompletionItemProvider(langId, MICHELSON_COMPLETION_PROVIDER as any)
    monaco.languages.setMonarchTokensProvider(langId, MICHELSON_TOKENS_PROVIDER as any)
    monaco.languages.registerHoverProvider(langId, MICHELSON_HOVER_PROVIDER as any)
    monaco.languages.registerOnTypeFormattingEditProvider(langId, MICHELSON_ONTYPE_PROVIDER as any)
}

@Injectable({ providedIn: "root" })
export class MonacoEditorService {
    constructor(@Inject(MONACO) private monaco: typeof IMonaco) {}

    static loadMonaco(callback: (value: any) => void) {
        const onGotAmdLoader = () => {
            // Load monaco
            window.require(["vs/editor/editor.main"], (required: any) => {
                globalMonaco = required
                registerLanguages(required)
                callback(globalMonaco)
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
    }

    createEditor(domElement: HTMLElement, options?: IMonaco.editor.IStandaloneEditorConstructionOptions) {
        return this.monaco.editor.create(domElement, options)
    }
}
