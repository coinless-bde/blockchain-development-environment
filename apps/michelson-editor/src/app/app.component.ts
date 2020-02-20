import { ChangeDetectionStrategy, Component } from "@angular/core"

@Component({
    selector: "bde-root",
    template: `
        <router-outlet></router-outlet>
    `,
    styleUrls: ["./app.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = "michelson-editor"
}
