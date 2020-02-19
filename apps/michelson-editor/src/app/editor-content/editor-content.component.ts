import { ChangeDetectionStrategy, Component, ElementRef } from "@angular/core"
import { Connect, Effect, HOST_EFFECTS, State } from "ng-effects"
import { editor } from "monaco-editor"
import { Observable } from "rxjs"
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor

interface Window {
    require: any
}

declare var window: Window

@Component({
    selector: "bde-editor-content",
    template: ``,
    styleUrls: ["./editor-content.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [HOST_EFFECTS],
})
export class EditorContentComponent {
    editor?: IStandaloneCodeEditor

    private readonly nativeElement: HTMLElement

    constructor(elementRef: ElementRef, connect: Connect) {
        this.nativeElement = elementRef.nativeElement
        this.editor = void 0
        connect(this)
    }

    @Effect("editor", { whenRendered: true })
    mountEditor({  }: State<EditorContentComponent>) {
        return new Observable<IStandaloneCodeEditor>(subscriber => {
            const onGotAmdLoader = () => {
                // Load monaco
                window.require(["vs/editor/editor.main"], (monaco: any) => {
                    subscriber.next(this.createEditor(monaco))
                })
            }
            // Load AMD loader if necessary
            if (!window.require) {
                const loaderScript = document.createElement("script")
                loaderScript.type = "text/javascript"
                loaderScript.src = "vs/loader.js"
                loaderScript.addEventListener("load", onGotAmdLoader)
                document.body.appendChild(loaderScript)
            } else {
                onGotAmdLoader()
            }
            return () => {
                if (this.editor) {
                    this.editor.dispose()
                }
            }
        })
    }

    createEditor(monaco: any): IStandaloneCodeEditor {
        const langId = "michelson"
        monaco.languages.register({
            id: langId,
        })

        // register the language here

        return monaco.editor.create(this.nativeElement, {
            value: `
parameter (or
             (or
                (pair %initiate
                   (address %participant)
                   (pair
                      (pair (bytes %hashed_secret) (timestamp %refund_time))
                      (mutez %payoff)))
                (bytes %add :hashed_secret))
             (or
                (bytes %redeem :secret)
                (bytes %refund :hashed_secret)));
storage (pair
           (big_map
              bytes
              (pair
                 (pair (address %initiator) (address %participant))
                 (pair
                    (pair (mutez %amount) (timestamp %refund_time))
                    (mutez %payoff))))
           unit);
code {
       NIL @operations operation; SWAP;
       UNPAPAIR @% @% @%; DIP {DUP};
       IF_LEFT
         {
           IF_LEFT
             {
               UNPAIR @% @%;
               DUP; CONTRACT @participant unit; IF_SOME {DROP} { PUSH string "wrong participant address"; FAILWITH };
               SWAP; UNPPAIIR @% @% @%;
               DUP; SIZE; PUSH nat 32; IFCMPEQ {} {PUSH string "hash size is not correct"; FAILWITH };
               DIP
                 {
                   DUP; NOW; IFCMPLT {} { PUSH string "wrong refund_time"; FAILWITH };
                   DIP { DUP }; SWAP;
                   AMOUNT @amount; SUB;
                   SENDER;
                   DUP; CONTRACT @initiator unit; IF_SOME {DROP} { PUSH string "wrong sender address"; FAILWITH };
                   DIP { PPAIIR; SWAP; }; PPAIIR; SOME @xcat;
                   SWAP;
                 };
               DUP; DIP { MEM; NOT; IF {} {PUSH string "swap for this hash is already initiated"; FAILWITH} };
             }
             {
               DUP;
               DIP
                 {
                   GET; IF_SOME {} { PUSH string "no swap for such hash"; FAILWITH };
                   UNPAIR @% @%;
                   DIP
                     {
                       UNPPAIIR @% @% @%; SWAP;
                       DUP; NOW; IFCMPLT {} { PUSH string "refund_time has already come"; FAILWITH }; SWAP;
                       AMOUNT @amount; ADD;
                     };
                   PAPPAIIR; SOME @xcat;
                 };
             };
           UPDATE; PAIR @new_storage; SWAP; PAIR;
         }
         {
           IF_LEFT
             {
               PUSH mutez 0; AMOUNT; IFCMPEQ {} {PUSH string "can not accept tez"; FAILWITH };
               DUP; SIZE; PUSH nat 32; IFCMPEQ {} {PUSH string "secret size is not correct"; FAILWITH };
               SHA256; SHA256 @hash; DUP; DIP {SWAP};
               DIIP
                 {
                   GET; IF_SOME {} { PUSH string "no swap for such secret"; FAILWITH };
                   DUP; UNPAIR @% @%; CDR @%; CONTRACT @participant unit; IF_SOME {} { PUSH string "recipient does not exist"; FAILWITH };
                   SWAP; CAAR @%;
                   DIIP
                     {
                       SENDER;
                       CONTRACT @sender unit; IF_SOME {} { PUSH string "wrong sender address"; FAILWITH };
                       SWAP; CDR @%; UNPPAIIR @% @% @%; DROP;
                       NOW; IFCMPLT {} { PUSH string "refund_time has already come"; FAILWITH };
                       DUP; PUSH mutez 0;
                       IFCMPLT
                         {
                           UNIT; TRANSFER_TOKENS;
                           DIP {SWAP}; CONS;
                         }
                         {
                           DROP; DROP; SWAP
                         };
                     };
                   UNIT; TRANSFER_TOKENS;
                 };
             }
             {
               PUSH mutez 0; AMOUNT; IFCMPEQ {} {PUSH string "can not accept tez"; FAILWITH };
               DUP;
               DIP
                 {
                   GET; IF_SOME {} { PUSH string "no swap for such hash"; FAILWITH };
                   DUP; CAAR @%; CONTRACT @initiator unit; IF_SOME {} { PUSH string "recipient does not exist"; FAILWITH }; SWAP;
                   CDR; UNPPAIIR @% @% @%; SWAP;
                   NOW; IFCMPGE {} { PUSH string "refund_time has not come"; FAILWITH };
                   ADD;
                   UNIT; TRANSFER_TOKENS; SWAP;
                   DIIP {SWAP};
                 };
             };
           NONE @none (pair (pair address address) (pair (pair mutez timestamp) mutez));
           SWAP; UPDATE @cleared_map; SWAP; DIP { SWAP; DIP {PAIR} };
           CONS; PAIR;
         }
     }
`,
            language: "michelson",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: false,
        })
    }
}
