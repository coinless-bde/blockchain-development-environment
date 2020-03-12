import { Event } from "../../store/store"
import { CreateResponse } from "../editor/editor.service"

export class SavedEditorState extends Event("SavedEditorState")<any> {}

export class FileSaved extends Event("FileSaved")<CreateResponse> {}
