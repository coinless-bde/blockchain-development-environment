import { ElementRef, Injectable, OnDestroy, Renderer2, ViewContainerRef } from "@angular/core"
import { Context, Effect, State } from "ng-effects"
import { merge, Subject } from "rxjs"
import { disable, EventMap, fromEvents, toggle } from "../utils"

enum ButtonEvents {
    "click",
    "pointerenter",
    "pointerleave",
    "pointerdown",
    "pointerup",
    "focus",
    "blur",
}

export interface ButtonLike {
    hover: boolean
    focus: boolean
    active: boolean
    disabled: boolean
    pressed: Subject<MouseEvent>
}

@Injectable()
export class Button {
    private readonly events: EventMap<typeof ButtonEvents>
    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef<HTMLElement>) {
        const { nativeElement } = elementRef
        this.events = fromEvents(nativeElement, ButtonEvents)
        this.nativeElement = nativeElement
    }

    @Effect("hover")
    public hover(state: State<ButtonLike>) {
        const events = this.events
        const on = events.pointerenter
        const off = merge(events.pointerleave, events.blur)

        return toggle(on, off).pipe(disable(state.disabled))
    }

    @Effect("focus")
    public focus({  }: State<ButtonLike>) {
        const events = this.events
        const on = events.focus
        const off = events.blur

        return toggle(on, off)
    }

    @Effect("active")
    public active(state: State<ButtonLike>) {
        const events = this.events
        const on = events.pointerdown
        const off = merge(events.pointerup, events.pointerleave)

        return toggle(on, off).pipe(disable(state.disabled))
    }

    @Effect()
    public click({}, context: Context<ButtonLike>) {
        return this.events.click.subscribe(event => {
            if (!context.disabled) {
                context.pressed.next(event)
            }
        })
    }
}
