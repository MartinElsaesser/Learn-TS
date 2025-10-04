import { expectTypeOf } from "expect-type";
import { AnyInteger, Integer } from "./createInteger";
import { CreateZeroesTuple, SubtractWithSignT } from "./zeroTuples";
import { Sub } from "./subtract";

//	A				B				Result					Remainder
//  [0,0,0,0,0]		[0,0]			[]						[]
//  [0,0,0]			[0,0]			[0]						[]				- subtract B from DecA
//  [0]				[0,0]			[0,0]					[]				- subtract B from DecA
//  -[0]			[0,0]			[0,0]					[0]				- subtract B from DecA
export type Div<
	A extends AnyInteger,
	B extends AnyInteger,
	_Result = DivT<A["number"], B["number"]>,
> =
	_Result extends AnyIntegerRest ?
		{
			number: _Result["number"];
			rest: _Result["rest"];
			sign: GetSignForDiv<A, B, _Result["number"]>;
		}
	:	never;

type GetSignForDiv<A extends AnyInteger, B extends AnyInteger, Result extends number[]> =
	Result extends [] ?
		"+" // result of multiplication is zero
	: A["sign"] extends "+" ?
		B["sign"] extends "+" ?
			"+" // +A * +B
		:	"-" // +A * -B
	: A["sign"] extends "-" ?
		B["sign"] extends "+" ?
			"-" // -A * +B
		:	"+" // -A * -B
	:	never;

type DivT<
	A extends number[],
	B extends number[],
	_Result extends number[] = [],
	A_Minus_B extends AnyInteger = SubtractWithSignT<A, B>,
> =
	B extends [] ?
		never // division by zero
	: A extends [] ?
		{ sign: "+"; number: _Result; rest: [] } // result without remainder
	: A_Minus_B["sign"] extends "-" ?
		{ sign: "+"; number: _Result; rest: A_Minus_B["number"] } // result with remainder
	:	DivT<A_Minus_B["number"], B, [0, ..._Result]>;

export type IntegerRest<Sign extends "+" | "-", N extends number, R extends number> = {
	number: CreateZeroesTuple<N>;
	sign: Sign;
	rest: CreateZeroesTuple<R>;
};

export type AnyIntegerRest = {
	number: number[];
	sign: "+" | "-";
	rest: number[];
};
// Add Cases:
const test_Div = [
	// +A / +B
	expectTypeOf<IntegerRest<"+", 3, 0>>().toEqualTypeOf<Div<Integer<"+", 6>, Integer<"+", 2>>>(),
	expectTypeOf<IntegerRest<"+", 2, 1>>().toEqualTypeOf<Div<Integer<"+", 5>, Integer<"+", 2>>>(),
	expectTypeOf<never>().toEqualTypeOf<Div<Integer<"+", 5>, Integer<"+", 0>>>(),
	expectTypeOf<IntegerRest<"+", 0, 0>>().toEqualTypeOf<Div<Integer<"+", 0>, Integer<"+", 5>>>(),
	// +A / -B
	expectTypeOf<IntegerRest<"-", 3, 0>>().toEqualTypeOf<Div<Integer<"+", 6>, Integer<"-", 2>>>(),
	// -A / +B
	expectTypeOf<IntegerRest<"-", 3, 0>>().toEqualTypeOf<Div<Integer<"-", 6>, Integer<"+", 2>>>(),
	// -A / -B
	expectTypeOf<IntegerRest<"+", 3, 0>>().toEqualTypeOf<Div<Integer<"-", 6>, Integer<"-", 2>>>(),
];
