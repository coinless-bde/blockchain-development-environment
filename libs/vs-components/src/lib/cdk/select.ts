import { Injectable } from "@angular/core"
import { changes, Effect, State } from "ng-effects"
import { every, filter, map, mapTo, mergeAll, mergeMap, repeat, take, withLatestFrom } from "rxjs/operators"
import { queryList } from "../utils"
import { SelectLike } from "./interfaces"
import { combineLatest, merge, Observable } from "rxjs"

@Injectable()
export class Select {
    @Effect("value")
    public optionSelected(state: State<SelectLike>) {
        return queryList(state.options).pipe(
            mergeAll(),
            mergeMap(option =>
                option.state.press.pipe(
                    withLatestFrom(option.state.value, (event, value) => value),
                ),
            ),
        )
    }

    @Effect("value")
    public optionChanges(state: State<SelectLike>) {
        return queryList(state.options).pipe(
            changes(),
            take(1),
            mergeAll(),
            mergeMap(option => option.state.selected),
            map(selected => selected === false),
            every(Boolean),
            mapTo(undefined),
            repeat(),
        )
    }

    @Effect("valueChange")
    public valueChanges(state: State<SelectLike>) {
        return changes(state.value)
    }

    @Effect("expanded")
    public toggleExpanded(state: State<SelectLike>) {
        const toggleExpanded = state.press.pipe(
            withLatestFrom(state.expanded, (event, expanded) => !expanded),
        )

        return merge(toggleExpanded, this.optionSelected(state).pipe(mapTo(false)))
    }

    @Effect("label", { detectChanges: true })
    public setLabel(state: State<SelectLike>): Observable<string | undefined> {
        const selectedLabel = queryList(state.options).pipe(
            mergeAll(),
            mergeMap(option =>
                combineLatest(option.state.selected, option.state.innerHTML).pipe(
                    map(([selected, innerHTML]) => (selected ? innerHTML : undefined)),
                    filter(value => value !== undefined),
                ),
            ),
        )
        const placeholderLabel = combineLatest(state.value, state.placeholder).pipe(
            map(([value, placeholder]) => (value === undefined ? placeholder : undefined)),
            filter(value => value !== undefined),
        )

        return merge(selectedLabel, placeholderLabel)
    }
}
