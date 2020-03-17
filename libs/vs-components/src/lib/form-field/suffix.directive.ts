import { Directive } from "@angular/core"

@Directive({
  selector: '[bdeSuffix]',
    host: {
        style: "grid-area: suffix"
    }
})
export class SuffixDirective {

  constructor() { }

}
