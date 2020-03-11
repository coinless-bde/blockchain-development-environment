import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

export interface TypecheckPayload {
    code: string
}

export interface SymbolcheckPayload {
    symbol: string,
    code: string
}

export interface TypecheckResponse {
    feedback: string
}

export interface SymbolcheckResponse {
    feedback: string
}

@Injectable({
    providedIn: "root",
})

export class PreviewService {
    constructor(private http: HttpClient) {}

    public typecheck(payload: TypecheckPayload) {
        return this.http.post<TypecheckResponse>("/api/typecheck", payload)
    }

    public checkSymbol(payload: SymbolcheckPayload) {
        return this.http.post<SymbolcheckResponse>("/api/symbolcheck", payload)
    }
}
