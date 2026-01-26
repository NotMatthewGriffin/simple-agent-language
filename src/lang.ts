type Program = {
    lines: Statement[]
};

type While = {kind: "while", condition: Expression, body: Statement[]}
type Assign = {kind: "assign", name: string, value: Expression}

type Statement = While | Assign


type Call = {
    kind: "call"
    name: string,
    args: Expression[]
}
type Sum = {
    kind: "sum",
    addends: Expression[]
}
type Product = {
    kind: "product",
    factors: Expression[]
}
type Quotient = {
    kind: "quotient",
    numerator: Expression,
    denominator: Expression,
}
type Not = {
    kind: "not",
    arg: Expression
}
type VarRef = {
    kind: "var",
    name: string
}
type Less = {
    kind: "less",
    left: Expression,
    right: Expression,
}
type Greater = {
    kind: "greater",
    left: Expression,
    right: Expression
}
type LiteralNumber = {
    kind: "number",
    value: number
}
type LiteralString = {
    kind: "string",
    value: string
}
type LiteralBool = {
    kind: "bool",
    value: boolean
}
type Literal = LiteralNumber | LiteralString | LiteralBool
type Expression = Call | Sum | Product | Quotient | Not | Literal | VarRef | Less | Greater

export type { Program, While, Assign, Statement, Call, Sum, Product, Quotient, Not, VarRef, LiteralString, LiteralNumber, LiteralBool, Expression }