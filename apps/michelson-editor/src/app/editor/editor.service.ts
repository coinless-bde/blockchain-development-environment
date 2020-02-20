import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { EffectHandler, EffectMetadata } from "ng-effects"
import { mapTo } from "rxjs/operators"

export interface DeployPayload {
    id: number
}

export interface AutosavePayload {
    id: number
    code: string
}

export interface UpdatePayload {
    id: number
    code: string
}

export interface SavePayload {
    id: number | null
    code: string
}

export interface CreatePayload {
    id: null
    code: string
}

export interface CreateResponse {
    id: number
}

export interface LoadResponse {
    code: string
}

@Injectable({
    providedIn: "root",
})
export class EditorService implements EffectHandler<string, { save: boolean }> {
    constructor(private http: HttpClient) {}

    public load(id: number) {
        return this.http.get<LoadResponse>("/api/" + id)
    }

    public create(payload: CreatePayload) {
        return this.http.post<CreateResponse>("/api/save", payload)
    }

    public autosave(payload: AutosavePayload) {
        return this.http.post("/api/auto_save", payload)
    }

    public update(payload: UpdatePayload) {
        return this.http.post("/api/update", payload).pipe(mapTo({ id: payload.id }))
    }

    public save(payload: SavePayload) {
        const { id } = payload
        return id === null ? this.create({ ...payload, id }) : this.update({ ...payload, id })
    }

    public deploy(payload: DeployPayload) {
        return this.http.post("/api/publish", payload)
    }

    public next(value: any, options: any, metadata: EffectMetadata<any>): void {}
}
