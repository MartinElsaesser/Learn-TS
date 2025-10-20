import { expectTypeOf } from "expect-type";
import { AnyIntegerT, IntegerT } from "./IntegerT";

export type MultTI<
	A extends AnyIntegerT,
	B extends AnyIntegerT,
	_Result extends number[] = MultT<A["number"], B["number"]>,
> = {
	number: _Result;
	sign: GetSignForMult<A, B, _Result>;
};

type GetSignForMult<A extends AnyIntegerT, B extends AnyIntegerT, Result extends number[]> =
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
const test_MultTI = [
	// +A * +B
	expectTypeOf<IntegerT<"+", 6>>().toEqualTypeOf<MultTI<IntegerT<"+", 2>, IntegerT<"+", 3>>>(),
	expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<MultTI<IntegerT<"+", 0>, IntegerT<"+", 0>>>(),
	// +A * -B
	expectTypeOf<IntegerT<"-", 6>>().toEqualTypeOf<MultTI<IntegerT<"+", 2>, IntegerT<"-", 3>>>(),
	expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<MultTI<IntegerT<"+", 0>, IntegerT<"-", 0>>>(),
	// -A * +B
	expectTypeOf<IntegerT<"-", 6>>().toEqualTypeOf<MultTI<IntegerT<"-", 2>, IntegerT<"+", 3>>>(),
	expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<MultTI<IntegerT<"-", 0>, IntegerT<"+", 0>>>(),
	// -A * -B
	expectTypeOf<IntegerT<"+", 6>>().toEqualTypeOf<MultTI<IntegerT<"-", 2>, IntegerT<"-", 3>>>(),
	expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<MultTI<IntegerT<"-", 0>, IntegerT<"-", 0>>>(),
];
