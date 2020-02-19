import { ChangeDetectionStrategy, Component, ElementRef } from "@angular/core"
import { Connect, Effect, HOST_EFFECTS, State } from "ng-effects"
import { editor } from "monaco-editor"
import { Observable } from "rxjs"
import * as IMonaco from "monaco-editor"
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

    createEditor(monaco: typeof IMonaco): IStandaloneCodeEditor {
        const langId = "michelson"
        const macros = "keyword"
        monaco.languages.register({
            id: langId,
            filenamePatterns: ["*.tz"],
            filenames: ["*.tz"],
            extension: [".tz"],
        })

        monaco.languages.setMonarchTokensProvider(langId, {
            defaultToken: "invalid",
            ignoreCase: false,
            keywords: [
                "DROP",
                "DUP",
                "SWAP",
                "DIG",
                "DUG",
                "PUSH",
                "SOME",
                "NONE",
                "UNIT",
                "IF_NONE",
                "PAIR",
                "CAR",
                "CDR",
                "LEFT",
                "RIGHT",
                "IF_LEFT",
                "NIL",
                "CONS",
                "IF_CONS",
                "SIZE",
                "EMPTY_SET",
                "EMPTY_MAP",
                "EMPTY_BIG_MAP",
                "MAP",
                "ITER",
                "MEM",
                "GET",
                "UPDATE",
                "IF",
                "LOOP",
                "LOOP_LEFT",
                "LAMBDA",
                "EXEC",
                "DIP",
                "FAILWITH",
                "CAST",
                "RENAME",
                "CONCAT",
                "SLICE",
                "PACK",
                "UNPACK",
                "ADD",
                "SUB",
                "MUL",
                "EDIV",
                "ABS",
                "ISNAT",
                "INT",
                "NEG",
                "LSL",
                "LSR",
                "OR",
                "AND",
                "XOR",
                "NOT",
                "COMPARE",
                "EQ",
                "NEQ",
                "LT",
                "GT",
                "LE",
                "GE",
                "SELF",
                "CONTRACT",
                "TRANSFER_TOKENS",
                "SET_DELEGATE",
                "CREATE_ACCOUNT",
                "CREATE_CONTRACT",
                "IMPLICIT_ACCOUNT",
                "NOW",
                "AMOUNT",
                "BALANCE",
                "CHECK_SIGNATURE",
                "BLAKE",
                "SHA",
                "SHA",
                "HASH_KEY",
                "STEPS_TO_QUOTA",
                "SOURCE",
                "SENDER",
                "ADDRESS",
                "CHAIN_ID",
            ],

            typeKeywords: [
                "key",
                "unit",
                "signature",
                "option",
                "list",
                "set",
                "operation",
                "contract",
                "pair",
                "or",
                "lambda",
                "map",
                "big_map",
                "chain_id",
                "pair",
                "int",
                "nat",
                "string",
                "bytes",
                "mutez",
                "bool",
                "key_hash",
                "timestamp",
                "address",
            ],

            // macros
            // https://tezos.gitlab.io/whitedoc/michelson.html#macros
            macros: [
                // Compare macros
                // CMP{EQ|NEQ|LT|GT|LE|GE}
                // 'CMP',
                "CMPEQ",
                "CMPNEQ",
                "CMPLT",
                "CMPLE",
                "CMPGT",
                "CMPGE",
                // IF{EQ|NEQ|LT|GT|LE|GE} bt bf
                "IF",
                "IFEQ",
                "IFNEQ",
                "IFLT",
                "IFLE",
                "IFGT",
                "IFGE",
                // IFCMP{EQ|NEQ|LT|GT|LE|GE} bt bf
                // 'IFCMP',
                "IFCMPEQ",
                "IFCMPNEQ",
                "IFCMPLT",
                "IFCMPLE",
                "IFCMPGT",
                "IFCMPGE",

                // Fail macros
                "FAIL",

                // Assertion macros
                "ASSERT",

                "ASSERT_EQ",
                "ASSERT_NEQ",
                "ASSERT_LT",
                "ASSERT_LE",
                "ASSERT_GT",
                "ASSERT_GE",

                "ASSERT_CMP_EQ",
                "ASSERT_CMP_NEQ",
                "ASSERT_CMP_LT",
                "ASSERT_CMP_LE",
                "ASSERT_CMP_GT",
                "ASSERT_CMP_GE",

                "ASSERT_NONE",
                "ASSERT_SOME",
                "ASSERT_LEFT",
                "ASSERT_RIGHT",

                // Syntactic Conveniences
                "DUP",

                // P(\left=A|P(\left)(\right))(\right=I|P(\left)(\right))R included in seperate statement, same for the other composite macros
                // and unp
                // and cr
                "IF_SOME",
                "IF_RIGHT",
                "SET_CAR",
                "SET_CDR",
                // and SET_C[AD]+R
                "MAP_CAR",
                "MAP_CDR",
                // and MAP_C[AD]+R
            ],

            // TODO: deprecation warnings
            // https://tezos.gitlab.io/whitedoc/michelson.html#deprecated-instructions

            data: ["Unit", "True", "False", "Pair", "Left", "Right", "Some", "None", "Elt"],

            escapes: /\\[nr\\"']/,

            // The main tokenizer for our languages
            tokenizer: {
                root: [
                    // composite macros
                    { include: "@compositeMacros" },

                    // instructions, macros
                    [
                        /[A-Z_]+/,
                        {
                            cases: {
                                "@keywords": "keyword",
                                "@macros": macros,
                                // '@default': 'identifier'
                            },
                        },
                    ],

                    { include: "@whitespace" },

                    // data
                    [/[A-Z][0-9_a-z]*/, { cases: { "@data": "operators" } }],
                    // types
                    [/[a-z][_a-z]+/, { cases: { "@typeKeywords": "type" } }],
                    // [/[@](|%|%%|[A-Za-z-_][A-Za-z-_0-9\.]*)/, 'type'],
                    // [/[A-Z][0-9]*/, { cases: { '@typeKeywords': 'keyword',
                    //                              '@keywords': 'keyword',
                    //                              '@default': 'identifier' } }],

                    // delimiters and operators
                    [/[{}()\[\]]/, "@brackets"],

                    // annotations
                    [/(@%|@%%|%@|[@:%][_a-zA-Z][_0-9a-zA-Z\.%@]*)/, "entity"],

                    // variables
                    [/[@:%][a-z_A-Z]+/, "identifier"],

                    // [/@symbols/, { cases: { '@operators': 'operator',
                    //                         '@default'  : '' } } ],

                    // numbers
                    [/0x[0-9a-fA-F]+/, "constant"],
                    [/-?[0-9]+/, "number"],

                    // delimiter
                    [";", "delimiter"],

                    // strings
                    [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
                    [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

                    // characters
                    [/'[^\\']'/, "string"],
                    [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
                    [/'/, "string.invalid"],
                ],

                comment: [
                    [/[^\/*]+/, "comment"],
                    [/\/\*/, "comment", "@push"], // nested comment
                    ["\\*/", "comment", "@pop"],
                    [/[\/*]/, "comment"],
                ],

                compositeMacros: [
                    [/P[PAIR]+R/, macros],
                    [/UNP[PAIR]+R/, macros],
                    [/C[AD]+R/, macros],
                    [/SET_C[AD]+R/, macros],
                    [/MAP_C[AD]+R/, macros],
                    [/DI+P/, macros],
                ],

                string: [
                    [/[^\\"]+/, "string"],
                    [/@escapes/, "string.escape"],
                    [/\\./, "string.escape.invalid"],
                    [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
                ],

                whitespace: [
                    [/[ \t\r\n]+/, "white"],
                    [/#.*$/, "comment"],
                    [/\/\*/, "comment", "@comment"],
                    [/\/\/.*$/, "comment"],
                ],
            },
        })

        // register the language here

        return monaco.editor.create(this.nativeElement, {
            value: `
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
`,
            language: "michelson",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: {
                enabled: false
            },
        })
    }
}
