import { PrettifyRecursive } from "../MyPrettify";

type Lexer<S extends string, Count extends number = 0> =
	S extends `${infer S1}&${infer Rest}` ?
		Join<
			S1,
			// iterative call of Lexer type
			Lexer<Rest, Add<Count, 1> & number>,
			Count
		>
	:	S;

// 				a 		b 		c 		d
// Count = 2        			S1 		Rest
// Count = 1			S1		Rest->
// Count = 0    S1 		Rest->

// 				a 		b
// Count = 0	S1		Rest

type Join<
	R1 extends string,
	R2 extends string,
	Count extends number,
> = `${Count}[ S1:${R1} Rest:${R2}]`;

type debug4 = PrettifyRecursive<Lexer<"a&b&c&d">>;
//   ^?
type debug3 = PrettifyRecursive<Lexer<"a&b&c">>;
//   ^?

type debug2 = PrettifyRecursive<Lexer<"a&b">>;
//   ^?
type debug1 = PrettifyRecursive<Lexer<"a">>;
//   ^?
