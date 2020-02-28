import { Context, Effect } from "ng-effects"
import { map, startWith } from "rxjs/operators"
import { OptionLike, SelectLike } from "./interfaces"
import { Injectable } from "@angular/core"
import { asapScheduler, scheduled } from "rxjs"

@Injectable()
export class Option {
    constructor(private select: SelectLike) {}

    @Effect("selected")
    optionSelected(@Context() context: Context<OptionLike>) {
        return scheduled(
            this.select.selectedChange.pipe(
                startWith(this.select.selected),
                map(value => value === context.value),
            ),
            asapScheduler,
        )
    }

    @Effect()
    selectOption(@Context() context: Context<OptionLike>) {
        return context.pressed.pipe(map(() => context.value)).subscribe(context.select)
    }
}
