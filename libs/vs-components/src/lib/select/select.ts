import { Injectable, QueryList } from "@angular/core"
import { changes, Context, Effect, State } from "ng-effects"
import { map, mapTo, mergeAll, switchMap, tap } from "rxjs/operators"
import { queryList } from "../utils"
import { OptionLike, SelectLike } from "./interfaces"
import { Observable } from "rxjs"
import { ButtonLike } from "../.."

export function optionSelected<T>(
    source: Observable<QueryList<OptionLike<T>> | undefined>,
): Observable<T> {
    return queryList(source).pipe(
        switchMap(options => options.map(option => option.select)),
        mergeAll(),
    )
}

@Injectable()
export class Select {
    constructor() {}

    @Effect("selected", { whenRendered: true })
    public selectOption(state: State<SelectLike>) {
        return optionSelected(state.options)
    }

    @Effect({ whenRendered: true })
    public selectedChange(state: State<SelectLike>, context: Context<SelectLike>) {
        return changes(state.selected).subscribe(context.selectedChange)
    }

    @Effect("expanded")
    public toggleExpanded(state: State<SelectLike>) {
        return optionSelected(state.options).pipe(mapTo(false))
    }

    @Effect("expanded")
    public buttonToggle(
        state: State<ButtonLike & SelectLike>,
        context: Context<ButtonLike & SelectLike>,
    ) {
        return context.pressed.pipe(map(() => !context.expanded))
    }
}
