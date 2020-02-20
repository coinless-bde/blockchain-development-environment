import { ElementRef, Injectable, Renderer2 } from "@angular/core"
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
    "keydown.enter" = "keydown",
    "keydown.space" = "keydown",
    "keyup.enter" = "keyup",
    "keyup.space" = "keyup",
}

export interface ButtonLike {
    hover: boolean
    focus: boolean
    active: boolean
    disabled: boolean
    pressed: Subject<PressedEvent>
}

export type PressedEvent = MouseEvent | KeyboardEvent

@Injectable()
export class Button {
    private readonly events: EventMap<typeof ButtonEvents>
    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2) {
        const { nativeElement } = elementRef
        this.events = fromEvents(nativeElement, ButtonEvents, renderer)
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
        const on = merge(events.pointerdown, events["keydown.enter"], events["keydown.space"])
        const off = merge(
            events.pointerup,
            events.pointerleave,
            events.blur,
            events["keyup.enter"],
            events["keyup.space"],
        )

        return toggle(on, off).pipe(disable(state.disabled))
    }

    @Effect()
    public click({}, context: Context<ButtonLike>) {
        const events = this.events
        const pressed = merge(events.click, events["keydown.enter"], events["keydown.space"])
        return pressed.subscribe(event => {
            event.preventDefault()
            if (!context.disabled) {
                context.pressed.next(event)
            }
        })
    }
}
