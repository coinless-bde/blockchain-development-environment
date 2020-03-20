import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { map, mapTo } from "rxjs/operators"

export interface DeployPayload {
    fileId?: number
    code?: string
    networkId: number
    storage: string
    contractFee: number
    storageCap: number
    gasCap: number
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
    id?: number | null
    code: string
}

export interface CreatePayload {
    id?: null
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
export class EditorService {
    constructor(private http: HttpClient) {}

    public load(id: number) {
        return this.http.get<LoadResponse>("/api/" + id).pipe(
            map(({ code }) => ({
                id,
                code
            }))
        )
    }

    public create(payload: CreatePayload) {
        return this.http.post<CreateResponse>("/api/save", payload).pipe(
            map(res => ({
                id: res.id,
                code: payload.code
            }))
        )
    }

    public autosave(payload: AutosavePayload) {
        return this.http.post("/api/auto_save", payload, {
            responseType: "text"
        })
    }

    public update(payload: UpdatePayload) {
        return this.http.post("/api/update", payload, {
            responseType: "text"
        }).pipe(mapTo({ id: payload.id, code: payload.code }))
    }

    public save(payload: SavePayload) {
        const { id } = payload
        return typeof id === "number" ? this.update({ ...payload, id }) : this.create({ ...payload, id })
    }

    public deploy(payload: DeployPayload) {
        return this.http.post<{ hash: string }>("/api/publish", payload)
    }
}
