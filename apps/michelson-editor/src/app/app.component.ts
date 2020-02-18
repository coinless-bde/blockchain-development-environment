import { Component } from "@angular/core"

@Component({
    selector: "bde-root",
    template: `
        <bde-editor></bde-editor>
    `,
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    title = "michelson-editor"
}
