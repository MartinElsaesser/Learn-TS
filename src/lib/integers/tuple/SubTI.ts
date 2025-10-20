import { expectTypeOf } from "expect-type";
import { AnyIntegerT, IntegerT } from "./IntegerT";
import { SubtractWithSignT } from "./zeroTuples";

// +A - -B
export type SubTI<A extends AnyIntegerT, B extends AnyIntegerT> =
	A["sign"] extends "+" ?
		B["sign"] extends "+" ?
			// +A - +B
			SubtractWithSignT<A["number"], B["number"]>
		:	// +A - -B
			{
				number: [...A["number"], ...B["number"]];
				sign: "+";
			}
	: A["sign"] extends "-" ?
		B["sign"] extends "+" ?
			// -A - +B
			{
				number: [...A["number"], ...B["number"]];
				sign: "-";
			}
		:	// -A - -B
			SubtractWithSignT<B["number"], A["number"]>
	:	never;

// Add Cases:
const test_SubTI = [
	// +A - +B => A - B
	[
		// A < B
		expectTypeOf<IntegerT<"-", 2>>().toEqualTypeOf<SubTI<IntegerT<"+", 3>, IntegerT<"+", 5>>>(),
		// A == B
		expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<SubTI<IntegerT<"+", 3>, IntegerT<"+", 3>>>(),
		// A > B
		expectTypeOf<IntegerT<"+", 2>>().toEqualTypeOf<SubTI<IntegerT<"+", 5>, IntegerT<"+", 3>>>(),
	],
	// +A - -B => A + B
	expectTypeOf<IntegerT<"+", 8>>().toEqualTypeOf<SubTI<IntegerT<"+", 3>, IntegerT<"-", 5>>>(),
	// -A - +B => -(A + B)
	expectTypeOf<IntegerT<"-", 8>>().toEqualTypeOf<SubTI<IntegerT<"-", 5>, IntegerT<"+", 3>>>(),
	// -A - -B => -A + B
	[
		// B < A
		expectTypeOf<IntegerT<"-", 2>>().toEqualTypeOf<SubTI<IntegerT<"-", 5>, IntegerT<"-", 3>>>(),
		// B == A
		expectTypeOf<IntegerT<"+", 0>>().toEqualTypeOf<SubTI<IntegerT<"-", 3>, IntegerT<"-", 3>>>(),
		// B > A
		expectTypeOf<IntegerT<"+", 2>>().toEqualTypeOf<SubTI<IntegerT<"-", 3>, IntegerT<"-", 5>>>(),
	],
];
