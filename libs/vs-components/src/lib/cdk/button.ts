import { ElementRef, Injectable, Renderer2 } from "@angular/core"
import { Effect, State } from "ng-effects"
import { merge } from "rxjs"
import { EventMap, fromEvents, preventDefault, toggle } from "../utils"
import { ButtonLike } from "./interfaces"

const buttonEvents = {
    click: MouseEvent,
    pointerenter: PointerEvent,
    pointerleave: PointerEvent,
    pointerdown: PointerEvent,
    pointerup: PointerEvent,
    focus: FocusEvent,
    blur: FocusEvent,
    keydown: {
        enter: KeyboardEvent,
        space: KeyboardEvent,
    },
    keyup: {
        enter: KeyboardEvent,
        space: KeyboardEvent,
    },
}

@Injectable()
export class Button {
    private readonly events: EventMap<typeof buttonEvents>

    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2) {
        this.events = fromEvents(renderer, elementRef.nativeElement, buttonEvents)
    }

    @Effect("hover")
    public hover(state: State<ButtonLike>) {
        const events = this.events
        const on = events.pointerenter
        const off = merge(events.pointerleave, events.blur)
        const disable = state.disabled

        return toggle({ on, off, disable })
    }

    @Effect("focus")
    public focus(@State() state: State<ButtonLike>) {
        const events = this.events
        const on = events.focus
        const off = events.blur

        return toggle({ on, off })
    }

    @Effect("active")
    public active(state: State<ButtonLike>) {
        const {
            pointerup,
            pointerdown,
            pointerleave,
            blur,
            keydown: { enter, space },
        } = this.events
        const on = merge(pointerdown, enter, space)
        const off = merge(pointerup, pointerleave, blur, enter, space)
        const disable = state.disabled

        return toggle({ on, off, disable })
    }

    @Effect("press")
    public click(@State() state: State<ButtonLike>) {
        const events = this.events
        return merge(events.click, events.keydown.enter, events.keydown.space).pipe(
            preventDefault(),
        )
    }
}
