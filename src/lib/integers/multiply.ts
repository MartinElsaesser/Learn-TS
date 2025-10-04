import { expectTypeOf } from "expect-type";
import { AnyInteger, Integer } from "./createInteger";

export type Mult<
	A extends AnyInteger,
	B extends AnyInteger,
	_Result extends number[] = MultT<A["number"], B["number"]>,
> = {
	number: _Result;
	sign: GetSignForMult<A, B, _Result>;
};

type GetSignForMult<A extends AnyInteger, B extends AnyInteger, Result extends number[]> =
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

type MultT<
	A extends number[],
	B extends number[],
	CountA extends number[] = [],
	TRes extends number[] = [],
> = A extends CountA ? TRes : MultT<A, B, [0, ...CountA], [...B, ...TRes]>;

// Add Cases:
const test_Add = [
	// +A + +B
	expectTypeOf<Integer<"+", 6>>().toEqualTypeOf<Mult<Integer<"+", 2>, Integer<"+", 3>>>(),
	expectTypeOf<Integer<"+", 0>>().toEqualTypeOf<Mult<Integer<"+", 0>, Integer<"+", 0>>>(),
	// +A + -B
	expectTypeOf<Integer<"-", 6>>().toEqualTypeOf<Mult<Integer<"+", 2>, Integer<"-", 3>>>(),
	expectTypeOf<Integer<"+", 0>>().toEqualTypeOf<Mult<Integer<"+", 0>, Integer<"-", 0>>>(),
	// -A + +B
	expectTypeOf<Integer<"-", 6>>().toEqualTypeOf<Mult<Integer<"-", 2>, Integer<"+", 3>>>(),
	expectTypeOf<Integer<"+", 0>>().toEqualTypeOf<Mult<Integer<"-", 0>, Integer<"+", 0>>>(),
	// -A + -B
	expectTypeOf<Integer<"+", 6>>().toEqualTypeOf<Mult<Integer<"-", 2>, Integer<"-", 3>>>(),
	expectTypeOf<Integer<"+", 0>>().toEqualTypeOf<Mult<Integer<"-", 0>, Integer<"-", 0>>>(),
];
