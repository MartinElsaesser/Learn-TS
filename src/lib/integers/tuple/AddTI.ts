import { expectTypeOf } from "expect-type";
import { AnyIntegerT, IntegerT } from "./IntegerT";
import { SubtractWithSignT } from "./zeroTuples";

export type AddTI<A extends AnyIntegerT, B extends AnyIntegerT> =
	A["sign"] extends "+" ?
		B["sign"] extends "+" ?
			// +A + +B
			{
				number: [...A["number"], ...B["number"]];
				sign: "+";
			}
		:	// +A + -B
			SubtractWithSignT<A["number"], B["number"]>
	: A["sign"] extends "-" ?
		B["sign"] extends "+" ?
			// -A + +B
			SubtractWithSignT<B["number"], A["number"]>
		:	// -A + -B
			{
				number: [...A["number"], ...B["number"]];
				sign: "-";
			}
	:	never;

// Add Cases:
const test_AddTI = [
	// +A + +B
	expectTypeOf<IntegerT<"+", 5>>().toEqualTypeOf<AddTI<IntegerT<"+", 2>, IntegerT<"+", 3>>>(),
	// +A + -B
	[
		// A < B
		expectTypeOf<IntegerT<"-", 2>>().toEqualTypeOf<AddTI<IntegerT<"+", 3>, IntegerT<"-", 5>>>(),
		// A == B
		expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<AddTI<IntegerT<"+", 3>, IntegerT<"-", 3>>>(),
		// A > B
		expectTypeOf<IntegerT<"+", 2>>().toEqualTypeOf<AddTI<IntegerT<"+", 5>, IntegerT<"-", 3>>>(),
	],
	// -A + +B
	[
		// B < A
		expectTypeOf<IntegerT<"-", 2>>().toEqualTypeOf<AddTI<IntegerT<"-", 5>, IntegerT<"+", 3>>>(),
		// B == A
		expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<AddTI<IntegerT<"-", 3>, IntegerT<"+", 3>>>(),
		// B > A
		expectTypeOf<IntegerT<"+", 2>>().toEqualTypeOf<AddTI<IntegerT<"-", 3>, IntegerT<"+", 5>>>(),
	],
	// -A + -B
	expectTypeOf<IntegerT<"-", 5>>().toEqualTypeOf<AddTI<IntegerT<"-", 2>, IntegerT<"-", 3>>>(),
];
