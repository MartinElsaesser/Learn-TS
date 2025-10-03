import { expectTypeOf } from "expect-type";

export type CreateZeroesTuple<RepeatCount extends number, _Acc extends number[] = []> =
	_Acc["length"] extends RepeatCount ? _Acc : CreateZeroesTuple<RepeatCount, [0, ..._Acc]>;

export type Integer<N extends number, Sign extends "+" | "-"> = {
	number: CreateZeroesTuple<N>;
	sign: Sign;
};

type GenericInteger = {
	number: number[];
	sign: "+" | "-";
};

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

type SmallerT<A extends number[], B extends number[]> =
	A extends [infer A_First, ...infer A_Rest extends number[]] ?
		B extends [infer B_First, ...infer B_Rest extends number[]] ?
			SmallerT<A_Rest, B_Rest> // A is full && B is full
		:	false // A is full && B is empty
	: B extends [infer B_First, ...infer B_Rest] ?
		true // A is empty && B is full
	:	false; // A is empty && B is empty

type SmallerOrEqualT<A extends number[], B extends number[]> =
	A extends [infer A_First, ...infer A_Rest extends number[]] ?
		B extends [infer B_First, ...infer B_Rest extends number[]] ?
			SmallerOrEqualT<A_Rest, B_Rest> // A is full && B is full
		:	false // A is full && B is empty
	: B extends [infer B_First, ...infer B_Rest] ?
		true // A is empty && B is full
	:	true; // A is empty && B is empty

type test = SmallerOrEqualT<[], []>;
//   ^?

// A				B
// [0,0]			[0,0,0]

type AddI<A extends number, B extends number> = Add<Integer<A>, Integer<B>>["length"];

// type SubI<A extends number, B extends number> = (SubT<Integer<A>, Integer<B>> & number[])["length"];

// multiply
type MultT<
	A extends number[],
	B extends number[],
	CountA extends number[] = [],
	TRes extends number[] = [],
> = A extends CountA ? TRes : MultT<A, B, Add<[0], CountA>, Add<B, TRes>>;

type MultI<A extends number, B extends number> = (MultT<Integer<A>, Integer<B>> &
	number[])["length"];

// divide
type DivT<A extends number[], B extends number[], TRes extends number[] = []> =
	MultT<TRes, B> extends A ? TRes : DivT<A, B, Add<[0], TRes>>;

type DivI<A extends number, B extends number> = (DivT<Integer<A>, Integer<B>> & number[])["length"];

type calc = DivI<AddI<MultI<2, 3>, 6>, 4>; // ((2*3) +7) / 4
//   ^?

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

// three representations:
// as tuple of zeroes e.g. [0,0,0]
// as number e.g. 3
// as GenericInteger e.g. { number: [0,0,0], sign: "+" }

// name type that takes a number (e.g. 3) and outputs a tuple of zeroes
type ToNumber<S extends string> = any;
type ToInteger<S extends string> = any;
type ToPositiveInteger<S extends string> = any;
type ToNegativeInteger<S extends string> = any;
type ToSimpleInteger<S extends string> = any;
