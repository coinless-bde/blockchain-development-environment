import { ChangeDetectionStrategy, Component} from "@angular/core"
import { Connect, Effect, Effects, State } from "ng-effects"
import { DomSanitizer } from '@angular/platform-browser';
import { MICHELSON_TOKENS_PROVIDER } from "@coinless/vs-components"
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
export class EditorPreviewComponent implements OnInit {
    content: String;
    sanitizer: DomSanitizer;

    constructor(connect: Connect, sanitizer: DomSanitizer) {
        monaco.languages.register({
            id: "michelson",
            aliases: ["tz"],
        })

        monaco.languages.setMonarchTokensProvider("michelson", MICHELSON_TOKENS_PROVIDER)

        this.sanitizer = sanitizer
        this.content = `(Pair Unit (Pair Unit string))`

        connect(this)
    }

    @Effect("content")
    setContent(state: State<EditorPreviewComponent>) {
        return from(editor.colorize(this.content, "michelson", {tabsize: 4}))
            .pipe(map(this.sanitizer.bypassSecurityTrustHtml))
    }
}
