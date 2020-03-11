import { ChangeDetectionStrategy, Component} from "@angular/core"
import { Connect, Effect, Effects, State } from "ng-effects"
import { MICHELSON_STACK_TOKENS_PROVIDER } from "./michelson-stack-grammar"
import * as Monaco from "monaco-editor"
import { editor } from "monaco-editor"
import { from } from "rxjs"
import { map } from 'rxjs/operators'

@Component({
    selector: "bde-editor-preview",
    template: `
<div [innerHTML]="content" > </div>
`,
    styleUrls: ["./editor-preview.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Effects],
})
export class EditorPreviewComponent {
    public content: string;

    constructor(connect: Connect) {
        Monaco.languages.register({
            id: "michelson",
            aliases: ["tz"],
        })

        // @ts-ignore
        Monaco.languages.setMonarchTokensProvider("michelson", MICHELSON_STACK_TOKENS_PROVIDER)

        this.content = `(Pair Unit (Pair Unit string))`

        connect(this)
    }

    @Effect("content")
    setContent(state: State<EditorPreviewComponent>) {
        return from(editor.colorize(this.content, "michelson", {tabSize: 4}))
    }
}
