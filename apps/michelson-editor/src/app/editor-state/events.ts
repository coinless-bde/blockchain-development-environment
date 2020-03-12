import { Event } from "../../store/store"
import { CreateResponse } from "../editor/editor.service"

export class FileSaved extends Event("FileSaved")<CreateResponse> {}
export class FileSaveError extends Event("FileSaveError")<any> {}

export class FileAutoSaved extends Event("FileAutoSaved") {}
export class FileAutoSaveError extends Event("FileAutoSaveError")<any> {}

export class FileLoaded extends Event("FileLoaded")<{ id: number, code: string }> {}
export class FileLoadError extends Event("FileLoadError")<any> {}
