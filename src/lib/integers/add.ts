import { expectTypeOf } from "expect-type";
import { AnyInteger, Integer } from "./createInteger";
import { SubtractWithSignT } from "./zeroTuples";

export type Add<A extends AnyInteger, B extends AnyInteger> =
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
const test_Add = [
	// +A + +B
	expectTypeOf<Integer<5, "+">>().toEqualTypeOf<Add<Integer<2, "+">, Integer<3, "+">>>(),
	// +A + -B
	[
		// A < B
		expectTypeOf<Integer<2, "-">>().toEqualTypeOf<Add<Integer<3, "+">, Integer<5, "-">>>(),
		// A == B
		expectTypeOf<Integer<0, "+">>().toEqualTypeOf<Add<Integer<3, "+">, Integer<3, "-">>>(),
		// A > B
		expectTypeOf<Integer<2, "+">>().toEqualTypeOf<Add<Integer<5, "+">, Integer<3, "-">>>(),
	],
	// -A + +B
	[
		// B < A
		expectTypeOf<Integer<2, "-">>().toEqualTypeOf<Add<Integer<5, "-">, Integer<3, "+">>>(),
		// B == A
		expectTypeOf<Integer<0, "+">>().toEqualTypeOf<Add<Integer<3, "-">, Integer<3, "+">>>(),
		// B > A
		expectTypeOf<Integer<2, "+">>().toEqualTypeOf<Add<Integer<3, "-">, Integer<5, "+">>>(),
	],
	// -A + -B
	expectTypeOf<Integer<5, "-">>().toEqualTypeOf<Add<Integer<2, "-">, Integer<3, "-">>>(),
];
