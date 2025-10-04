import { PrettifyRecursive } from "../MyPrettify";

type Lexer<S extends string, _Acc extends string = "", _Count extends number[] = []> =
	S extends `${infer First}&${infer Rest}` ?
		Lexer<
			// S
			Rest,
			// _Acc
			Join<First, _Acc, _Count["length"]>,
			// _Count
			[0, ..._Count]
		>
	: S extends "" ? _Acc
	: Lexer<
			// S
			"",
			// _Acc
			Join<S, _Acc, _Count["length"]>,
			// _Count
			[0, ..._Count]
		>;

// 				"" 		a 		b 		c 		d
// Count = 0	Rest	S1
// Count = 1			<-Rest	S1
// Count = 2					<-Rest	S1
// Count = 3							<-Rest	S1

// 				a 		b
// Count = 0	S1		Rest

type Join<R1 extends string, R2 extends string, Count extends number> = `{${Count},${R1},${R2}}`;

type debug4 = PrettifyRecursive<Lexer<"a&b&c&d">>;
//   ^?
type debug3 = PrettifyRecursive<Lexer<"a&b&c">>;
//   ^?

type debug2 = PrettifyRecursive<Lexer<"a&b">>;
//   ^?
type debug1 = PrettifyRecursive<Lexer<"a">>;
//   ^?
