import * as Commands from "./commands"
import * as Events from "./events"
import { ExtractTypes } from "./interfaces"

export type Actions = Commands | Events
export type Commands = ExtractTypes<typeof Commands>
export type Events = ExtractTypes<typeof Events>
