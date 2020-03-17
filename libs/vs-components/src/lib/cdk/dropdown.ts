import { ElementRef, Injectable, OnDestroy, Renderer2, ViewContainerRef } from "@angular/core"
import { Effect, State } from "ng-effects"
import { DropdownLike } from "./interfaces"
import { filter, map, mapTo, switchMapTo } from "rxjs/operators"
import { fromEvents, query } from "../utils"
import { TemplatePortal } from "@angular/cdk/portal"
import { Overlay, OverlayRef } from "@angular/cdk/overlay"
import { merge } from "rxjs"

@Injectable()
export class Dropdown implements OnDestroy {
    private overlay: OverlayRef
    private viewContainer: ViewContainerRef

    constructor(overlay: Overlay, viewContainer: ViewContainerRef, elementRef: ElementRef) {
        const positionStrategy = overlay
            .position()
            .flexibleConnectedTo(elementRef)
            .withPositions([
                {
                    originX: "start",
                    originY: "bottom",
                    overlayX: "start",
                    overlayY: "top",
                },
                {
                    originX: "start",
                    originY: "top",
                    overlayX: "start",
                    overlayY: "bottom",
                },
            ])
        this.viewContainer = viewContainer
        this.overlay = overlay.create({
            hasBackdrop: true,
            positionStrategy,
        })
    }

    @Effect("expanded")
    public backdropClick(_: State<DropdownLike>) {
        const { element, injector } = this.viewContainer
        const events = fromEvents(
            element.nativeElement,
            { "keydown.esc": "keydown" },
            injector.get(Renderer2),
        )

        return merge(this.overlay.backdropClick(), events["keydown.esc"]).pipe(mapTo(false))
    }

    @Effect()
    public renderOverlay(state: State<DropdownLike>) {
        return state.expanded.pipe(
            filter(Boolean),
            switchMapTo(query(state.template)),
            map(template => this.overlay.attach(new TemplatePortal(template, this.viewContainer))),
        )
    }

    @Effect()
    public closeOverlay(state: State<DropdownLike>) {
        return state.expanded.subscribe(expanded => {
            if (!expanded) {
                this.overlay.detach()
            }
        })
    }

    public ngOnDestroy() {
        this.overlay.dispose()
    }
}
