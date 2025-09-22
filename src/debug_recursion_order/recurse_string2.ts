import { PrettifyRecursive } from "../MyPrettify";

type Lexer<S extends string, Collector extends string = "", Count extends number = 0> =
	S extends `${infer S1}&${infer Rest}` ?
		Lexer<
			// S
			Rest,
			// Collector
			Join<S1, Collector, Count>,
			// Count
			Add<Count, 1> & number
		>
	:	Collector;

// 				"" 		a 		b 		c 		d
// Count = 0	Rest	S1
// Count = 1			<-Rest	S1
// Count = 2					<-Rest	S1
// Count = 3							<-Rest	S1

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
