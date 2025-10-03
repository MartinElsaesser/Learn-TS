import { expectTypeOf } from "expect-type";
import { AnyInteger, Integer } from "./createInteger";
import { SubtractWithSignT } from "./zeroTuples";

// +A - -B
type Sub<A extends AnyInteger, B extends AnyInteger> =
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
const test_Sub = [
	// +A - +B => A - B
	[
		// A < B
		expectTypeOf<Integer<"-", 2>>().toEqualTypeOf<Sub<Integer<"+", 3>, Integer<"+", 5>>>(),
		// A == B
		expectTypeOf<Integer<"+", 0>>().toEqualTypeOf<Sub<Integer<"+", 3>, Integer<"+", 3>>>(),
		// A > B
		expectTypeOf<Integer<"+", 2>>().toEqualTypeOf<Sub<Integer<"+", 5>, Integer<"+", 3>>>(),
	],
	// +A - -B => A + B
	expectTypeOf<Integer<"+", 8>>().toEqualTypeOf<Sub<Integer<"+", 3>, Integer<"-", 5>>>(),
	// -A - +B => -(A + B)
	expectTypeOf<Integer<"-", 8>>().toEqualTypeOf<Sub<Integer<"-", 5>, Integer<"+", 3>>>(),
	// -A - -B => -A + B
	[
		// B < A
		expectTypeOf<Integer<"-", 2>>().toEqualTypeOf<Sub<Integer<"-", 5>, Integer<"-", 3>>>(),
		// B == A
		expectTypeOf<Integer<"+", 0>>().toEqualTypeOf<Sub<Integer<"-", 3>, Integer<"-", 3>>>(),
		// B > A
		expectTypeOf<Integer<"+", 2>>().toEqualTypeOf<Sub<Integer<"-", 3>, Integer<"-", 5>>>(),
	],
];
