import { expectTypeOf } from "expect-type";
import { GenericInteger, Integer } from "./generic";
import { SmallerT } from "./zeroTuples";

export type Add<A extends GenericInteger, B extends GenericInteger> =
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

type SubtractWithSignT<A extends number[], B extends number[], _Acc extends number[] = []> =
	// A - B
	SmallerT<A, B> extends true ?
		// A < B (e.g. 2 - 4 = -2)
		[..._Acc, ...A] extends B ?
			{
				number: _Acc;
				sign: "-";
			}
		:	SubtractWithSignT<A, B, [0, ..._Acc]>
	: // A >= B
	// A == B (e.g. 4 - 4 = 0)
	// A > B (e.g. 4 - 2 = 2)
	[..._Acc, ...B] extends A ?
		{
			number: _Acc;
			sign: "+";
		}
	:	SubtractWithSignT<A, B, [0, ..._Acc]>;

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
