import { Effect, HostRef, State } from "ng-effects"
import { map, subscribeOn } from "rxjs/operators"
import { ElementRef, Inject, Injectable } from "@angular/core"
import { OptionLike, SelectLike } from "./interfaces"
import { asapScheduler, combineLatest, Observable } from "rxjs"

@Injectable()
export class Option {
    constructor(
        @Inject(SelectLike) private select: HostRef<SelectLike>,
        private elementRef: ElementRef<HTMLElement>,
    ) {}

    @Effect("selected")
    selectValueChanges(@State() state: State<OptionLike>) {
        return combineLatest(state.value, this.select.state.value).pipe(
            map(([value, selected]) => selected === value),
            subscribeOn(asapScheduler),
        )
    }

    @Effect("innerHTML", { whenRendered: true })
    labelChanges(@State() state: State<OptionLike>) {
        const nativeElement = this.elementRef.nativeElement
        return new Observable<string>(subscriber => {
            const readInnerHtml = () => subscriber.next(nativeElement.innerHTML)
            const observer = new MutationObserver(readInnerHtml)
            observer.observe(nativeElement, { subtree: true, characterData: true })
            readInnerHtml()
            return function() {
                observer.disconnect()
            }
        })
    }
}
