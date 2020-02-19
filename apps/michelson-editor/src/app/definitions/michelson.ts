import { oop, TextHighlightRules } from "monaco-ace-tokenizer"

export const MichelsonHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [
            {
                include: "#bytes",
            },
            {
                include: "#string",
            },
            {
                include: "#number",
            },
            {
                include: "#comment",
            },
            {
                include: "#multicomment",
            },
            {
                include: "#block",
            },
            {
                include: "#data",
            },
            {
                include: "#instruction",
            },
            {
                include: "#type",
            },
            {
                include: "#macros",
            },
            {
                include: "#annotations",
            },
        ],
        "#string": [
            {
                token: "string.quoted.michelson",
                regex: /"/,
                push: [
                    {
                        token: "string.quoted.michelson",
                        regex: /"/,
                        next: "pop",
                    },
                    {
                        token: "string.quoted.michelson",
                        regex: /\\./,
                    },
                    {
                        defaultToken: "string.quoted.michelson",
                    },
                ],
            },
        ],
        "#number": [
            {
                token: "string.michelson",
                regex: /\b-?[0-9]+\b/,
            },
        ],
        "#bytes": [
            {
                token: "string.michelson",
                regex: /\b0x[0-9A-Ea-e]*\b/,
            },
        ],
        "#comment": [
            {
                token: "comment.language.michelson",
                regex: /#/,
                push: [
                    {
                        token: "comment.language.michelson",
                        regex: /\n/,
                        next: "pop",
                    },
                    {
                        token: "constant.character.escape.michelson",
                        regex: /wordPattern/,
                    },
                    {
                        defaultToken: "comment.language.michelson",
                    },
                ],
            },
        ],
        "#multicomment": [
            {
                token: "comment.language.michelson",
                regex: /\/\*/,
                push: [
                    {
                        token: "comment.language.michelson",
                        regex: /\*\//,
                        next: "pop",
                    },
                    {
                        token: "constant.character.escape.michelson",
                        regex: /wordPattern/,
                    },
                    {
                        defaultToken: "comment.language.michelson",
                    },
                ],
            },
        ],
        "#block": [
            {
                token: "keyword.control.michelson",
                regex: /\b(?:parameter|storage|code?)\b/,
            },
        ],
        "#data": [
            {
                token: "variable.other.enummember.michelson",
                regex: /\b(?:Unit|True|False|Pair|Left|Right|Some|None|Elt)\b/,
            },
        ],
        "#instruction": [
            {
                token: "support.function.michelson",
                regex: /\b(?:DROP|DUP|SWAP|PUSH|SOME|NONE|UNIT|IF_NONE|PAIR|CAR|CDR|LEFT|RIGHT|IF_LEFT|IF_RIGHT|NIL|CONS|IF_CONS|SIZE|EMPTY_SET|EMPTY_MAP|MAP|ITER|MEM|GET|UPDATE|IF|LOOP|LOOP_LEFT|LAMBDA|EXEC|DIP|FAILWITH|CAST|RENAME|CONCAT|SLICE|PACK|UNPACK|ADD|SUB|MUL|EDIV|ABS|NEG|LSL|LSR|OR|AND|XOR|NOT|COMPARE|EQ|NEQ|LT|GT|LE|GE|SELF|CONTRACT|TRANSFER_TOKENS|SET_DELEGATE|CREATE_CONTRACT|IMPLICIT_ACCOUNT|NOW|AMOUNT|BALANCE|CHECK_SIGNATURE|BLAKE2B|SHA256|SHA512|HASH_KEY|STEPS_TO_QUOTA|SOURCE|SENDER|ADDRESS|DIG|DUG|EMPTY_BIG_MAP|APPLY|CHAIN_ID)\b/,
            },
        ],
        "#type": [
            {
                token: "entity.name.type.michelson support.type.michelson",
                regex: /\b(?:option|list|set|contract|pair|or|lambda|map|big_map)\b/,
            },
            {
                token: "entity.name.type.michelson support.type.michelson",
                regex: /\b(?:key|unit|signature|operation|address|int|nat|string|bytes|mutez|bool|key_hash|timestamp|chain_id)\b/,
            },
        ],
        "#macros": [
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\b(?:IF_SOME|FAIL|ASSERT|ASSERT_NONE|ASSERT_SOME|ASSERT_LEFT|ASSERT_RIGHT|UNPAIR|(?:SET|MAP)_C[AD]+R)\b/,
            },
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\b(?:DII+P|C[AD]{2,}R|DUU+P|P[PAI]{3,}R|UNP[PAI]{3,}R)\b/,
            },
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\bCMP(?:EQ|NEQ|LT|GT|LE|GE)\b/,
            },
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\bIF(?:EQ|NEQ|LT|GT|LE|GE)\b/,
            },
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\bIFCMP(?:EQ|NEQ|LT|GT|LE|GE)\b/,
            },
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\bASSERT_(?:EQ|NEQ|LT|LE|GT|GE)\b/,
            },
            {
                token: "variable.function.michelson meta.preprocessor.numeric.michelson",
                regex: /\bASSERT_CMP(?:EQ|NEQ|LT|LE|GT|GE)\b/,
            },
        ],
        "#annotations": [
            {
                token: "entity.other.attribute-name.michelson",
                regex: /(?<=\s)%[A-z_0-9%@]*/,
            },
            {
                token: "entity.other.attribute-name.michelson",
                regex: /(?<=\s)@[A-z_0-9%]+\b/,
            },
            {
                token: "entity.other.attribute-name.michelson",
                regex: /(?<=\s):[A-z_0-9]+\b/,
            },
        ],
    }

    this.normalizeRules()
}

MichelsonHighlightRules.metaData = {
    scopeName: "source.michelson",
    name: "michelson",
}

oop.inherits(MichelsonHighlightRules, TextHighlightRules)
