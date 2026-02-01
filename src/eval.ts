import type { Readable, Writable } from "stream"
import type { Expression, Program, Statement } from "./lang.js"



type salFunction = (...args: any) => any
type functions = { [name: string]: salFunction }
type variables = { [name: string]: any }

export const createStdLib = (stdin: Readable, stdout: Writable, stderr: Writable) => ({
    print: (...args: any[]) => stdout.write(args.join(""))
});

export const evalProgram = (program: Program, funcs: functions) => {
    const vars = {}
    program.lines.forEach((line) => evalStatement(line, funcs, vars))
}

const evalStatement = (statement: Statement, funcs: functions, vars: variables) => {
    switch (statement.kind) {
        case "while":
            while (!!evalExpression(statement.condition, funcs, vars)) {
                statement.body.forEach((inner) => evalStatement(inner, funcs, vars))
            }
            break;
        case "assign":
            vars[statement.name] = evalExpression(statement.value, funcs, vars);
            break;
    }
}

function evalExpression(expression: Expression, funcs: functions, vars: variables): any {
    switch (expression.kind) {
        case "string":
            return expression.value
        case "number":
            return expression.value
        case "call":
            const func = funcs[expression.name];
            if (!func) {
                throw Error(`Function: ${expression.name} is undefined`)
            }
            return func(...expression.args.map((arg) => evalExpression(arg, funcs, vars)));
        case "var":
            return vars[expression.name];
        case "sum":
            let sum = 0;
            for (const addend of expression.addends) {
                sum += evalExpression(addend, funcs, vars);
            }
            return sum;
        case "product":
            let product = 1;
            for (const factor of expression.factors) {
                product *= evalExpression(factor, funcs, vars);
            }
            return product;
        case "quotient":
            return evalExpression(expression.numerator, funcs, vars) / evalExpression(expression.denominator, funcs, vars);
        case "not":
            return evalExpression(expression.arg, funcs, vars);
        case "bool":
            return expression.value;
        case "less":
            return evalExpression(expression.left, funcs, vars) < evalExpression(expression.right, funcs, vars);
        case "greater":
            return evalExpression(expression.left, funcs, vars) > evalExpression(expression.right, funcs, vars);
        case "equal":
            return evalExpression(expression.left, funcs, vars) == evalExpression(expression.right, funcs, vars);
        case "modulo":
            return evalExpression(expression.numerator, funcs, vars) % evalExpression(expression.denominator, funcs, vars);
    }
}