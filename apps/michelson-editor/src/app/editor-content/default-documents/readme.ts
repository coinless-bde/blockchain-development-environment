export const README = `#BDE
>Blockchain Development Environment

Hi and welcome, in this editor you will find everything you need to write smart
contracts for the Tezos blockchain in Michelson. Michelson is the Tezos smart
contract language.

We are currently in an early release version but you can already enjoy a couple
of interesting features which will save you from having to run a tezos node to
use Michelson, for example: our API can validate Michelson for you. Simple click
on the example.tz file and click the "typecheck" button.

## Michelson

Michelson is a stack based language running on the Tezos blockchain, its
inspired by Forth and Lisp. We support basic editor functionality for Michelson.

### Examples

\`\`\`tz
DROP;
PUSH string "Hello Tezos!";
NIL operation; PAIR;
\`\`\`

from camlcase-dev their extremely awesome series on Michelson, check it out,
its really good [link]\
(https://gitlab.com/camlcase-dev/michelson-tutorial/tree/master/01)

the other example 'example.tz' from baking-bad [link]\
(https://github.com/baking-bad/vscode-michelson-syntax/blob/master/examples/example1.tz)

### Editor

This editor is made using Monaco, with a custom monarch grammar.`
