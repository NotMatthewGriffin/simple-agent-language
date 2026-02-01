import { test, expect } from "@jest/globals";
import { Readable, Writable } from "node:stream";
import { createStdLib, evalProgram } from "../src/index.js";
import type { Program } from "../src/index.js";

describe("evalProgram returns correct result", () => {
    // Create a mock stdout to capture output
    let output = "";
    const mockStdout = new Writable({
        write(chunk, encoding, callback) {
            output += chunk.toString();
            callback();
            return true;
        }
    });

    const mockStderr = new Writable({
        write(chunk, encoding, callback) {
            callback();
            return true;
        }
    });

    const mockStdin = Readable.from([]);

    let mockStdLib = createStdLib(mockStdin, mockStdout, mockStderr);
    beforeEach(() => {
        output = "";
    })



    test("fibonacci program calculates 7th fibonacci number", () => {
        const fibonacciProgram: Program = {
            lines: [
                { kind: "assign", value: { kind: "number", value: 7 }, name: "n" },
                { kind: "assign", value: { kind: "number", value: 0 }, name: "a" },
                { kind: "assign", value: { kind: "number", value: 1 }, name: "b" },
                {
                    kind: "while", condition: { kind: "greater", left: { kind: "var", name: "n" }, right: { kind: "number", value: 0 } }, body: [
                        { kind: "assign", name: "temp", value: { kind: "sum", addends: [{ kind: "var", name: "a" }, { kind: "var", name: "b" }] } },
                        { kind: "assign", name: "a", value: { kind: "var", name: "b" } },
                        { kind: "assign", name: "b", value: { kind: "var", name: "temp" } },
                        { kind: "assign", name: "n", value: { kind: "sum", addends: [{ kind: "var", name: "n" }, { kind: "number", value: -1 }] } },
                    ]
                },
                { kind: "assign", value: { kind: "call", name: "print", args: [{ kind: "var", name: "a" }] }, name: "_" }
            ]
        };



        // Run the program
        evalProgram(fibonacciProgram, mockStdLib);

        // The 7th fibonacci number is 13 (0, 1, 1, 2, 3, 5, 8, 13)
        expect(output).toBe("13");
    })

    test("Output is empty without program", () => {
        expect(output).toBe("");
    })

    test("Hello world program prints", () => {
        const expectedOutput = "hello world";
        const program: Program = {
            lines: [
                { kind: "assign", name: "_", value: { kind: "call", name: "print", args: [{ kind: "string", value: expectedOutput }] } }
            ]
        };

        evalProgram(program, mockStdLib);

        expect(output).toBe(expectedOutput);
    });

    test("Even Odd program prints correctly", () => {
        const expectedOutput = "even odd even odd even ";
        const program: Program = {
            lines: [
                { kind: "assign", name: "n", value: { kind: "number", value: 0 } },
                {
                    kind: "while", condition: { kind: "less", left: { kind: "var", name: "n" }, right: { kind: "number", value: 5 } }, body: [
                        {
                            kind: "assign", name: "evenOrOdd", value: {
                                kind: "ternary",
                                condition: {
                                    kind: "equal",
                                    left: { kind: "modulo", numerator: { kind: "var", name: "n" }, denominator: { kind: "number", value: 2 } },
                                    right: { kind: "number", value: 0 }
                                },
                                true: { kind: "string", value: "even " },
                                false: { kind: "string", value: "odd " }
                            }
                        },
                        { kind: "assign", name: "_", value: { kind: "call", name: "print", args: [{ kind: "var", name: "evenOrOdd" }] } },
                        { kind: "assign", name: "n", value: { kind: "sum", addends: [{ kind: "var", name: "n" }, { kind: "number", value: 1 }] } }
                    ]
                }
            ]
        }
    });
});