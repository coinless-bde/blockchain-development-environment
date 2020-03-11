export const MICHELSON_STACK_TOKENS_PROVIDER = {
    defaultToken: "invalid",
    ignoreCase: false,
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

    data: ["Unit", "True", "False", "Pair", "Left", "Right", "Some", "None", "Elt"],

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // data
            [/[A-Z][0-9a-z]+/, { cases: { "@data": "type" } }],

            { include: "@whitespace" },

            // types
            [/[a-z][_a-z]+/, { cases: { "@typeKeywords": "type"} }],

            // delimiters and operators
            [/[()]/, "@brackets"],

            // annotations
            [/(@%%|@%|%@|[@:%][_a-zA-Z][_0-9a-zA-Z\.%@]*)/, "entity"],
        ],

        whitespace: [
            [/[ \t\r\n]+/, "white"],
        ],
    },
}
