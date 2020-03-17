import { Directive } from "@angular/core"

@Directive({
  selector: '[bdePrefix]',
    host: {
      style: "grid-area: prefix"
    }
})
export class PrefixDirective {

  constructor() { }

}
