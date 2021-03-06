import { keyword_completions, root_completions, type_completions } from "./completions"
import * as Monaco from "monaco-editor"
import { editor } from "monaco-editor"

const macros = "keyword"

export const MICHELSON_TOKENS_PROVIDER = {
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
        "SHA256",
        "HASH_KEY",
        "STEPS_TO_QUOTA",
        "SOURCE",
        "SENDER",
        "ADDRESS",
        "CHAIN_ID",
    ],

    prime: [
        "code",
        "parameter",
        "storage",
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

            // data
            [/[A-Z][0-9a-z]+/, { cases: { "@data": "type" } }],

            // instructions, macros
            [
                /[A-Z_]+[0-9]*/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@macros": macros,
                        // '@default': 'identifier'
                    },
                },
            ],

            { include: "@whitespace" },

            // types
            [/[a-z][_a-z]+/, { cases: { "@typeKeywords": "type", "@prime": "operators" } }],

            // [/[@](|%|%%|[A-Za-z-_][A-Za-z-_0-9\.]*)/, 'type'],
            // [/[A-Z][0-9]*/, { cases: { '@typeKeywords': 'keyword',
            //                              '@keywords': 'keyword',
            //                              '@default': 'identifier' } }],

            // delimiters and operators
            [/[{}()\[\]]/, "@brackets"],

            // annotations
            [/(@%%|@%|%@|[@:%][_a-zA-Z][_0-9a-zA-Z\.%@]*)/, "entity"],

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
}

export const MICHELSON_HOVER_PROVIDER = {
    provideHover: function (model: editor.ITextModel, position: Monaco.IPosition) {
        const word: any = model.getWordAtPosition(position)
        if (!word) {
            return
        }
        const range = new Monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
        // @ts-ignore
        const all = root_completions.concat(keyword_completions).concat(type_completions);
        // @ts-ignore
        const str = all.find(x => x.label == word.word)
        if (str) {
            return {
                range,
                contents: [{ value: str.documentation }],
            }
        }
    }
}

export const MICHELSON_ONTYPE_PROVIDER = {
    autoFormatTriggerCharacters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    provideOnTypeFormattingEdits: function (model: editor.ITextModel, position: Monaco.IPosition, ch: string) {
        const textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
        const range = new Monaco.Range(position.lineNumber, position.column - 1, position.lineNumber, position.column)

        const code_match = textUntilPosition.match("code");
        if (code_match) {
            const operator_match = textUntilPosition.match(/[{;]\s*\w+$/);
            if (operator_match) {
                model.applyEdits([{
                    range,
                    text: ch.toUpperCase()
                }])
            }
        }
        // backend call here
    }
}

export const MICHELSON_COMPLETION_PROVIDER = {
    provideCompletionItems: function(model: editor.ITextModel, position: Monaco.IPosition) {
        const textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
        const code_match = textUntilPosition.match("code");
        let suggestions: { label: string; documentation: string; insertText: string; }[] = [];
        const word: any = model.getWordAtPosition(position)
        if (code_match) {
            if(textUntilPosition.match(/[{;]\s*\w+$/)) {
                suggestions = keyword_completions
            } else if (textUntilPosition.match(/[A-Z]+ [a-z]+$/)) {
                suggestions = type_completions
            }

        } else {
            suggestions = textUntilPosition.match(/[a-z]+ [a-z]*$/) ?
                type_completions: root_completions;
        }
        return {
            suggestions: suggestions
        };
    }
}
