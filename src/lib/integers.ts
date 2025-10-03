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

// add
type Add<A extends GenericInteger, B extends GenericInteger> =
	A["sign"] extends "+" ?
		B["sign"] extends "+" ?
			// +A + +B
			{
				number: [...A["number"], ...B["number"]];
				sign: "+";
			}
		:	// +A + -B
			"+A + -B"
	: A["sign"] extends "-" ?
		B["sign"] extends "+" ?
			"-A + +B"
		:	// -A + -B
			{
				number: [...A["number"], ...B["number"]];
				sign: "-";
			}
	:	never;

// subtract (A - B)
// cases:
// 1. A > B   4-2=2
//  A			B			Result
//  [0,0,0,0] 	[0,0]		[]
//  [0,0,0,0] 	[0,0]		[0]
//  [0,0,0,0] 	[0,0]		[0,0]
// 2. A == B  4-4=0
//  [0,0,0,0] 	[0,0,0,0]	[]
// 3. A < B   2-4=-2
//  [0,0] 		[0,0,0,0]	[]
//  [0,0] 		[0,0,0,0]	[0]
//  [0,0] 		[0,0,0,0]	[0,0]
type Add_Pos_Neg<A extends number[], B extends number[], _Acc extends number[] = []> =
	SmallerT<A, B> extends true ?
		// A < B
		[..._Acc, ...A] extends B ?
			{
				number: _Acc;
				sign: "-";
			}
		:	Add_Pos_Neg<A, B, [0, ..._Acc]>
	: // A >= B
	[..._Acc, ...B] extends A ?
		{
			number: _Acc;
			sign: "+";
		}
	:	Add_Pos_Neg<A, B, [0, ..._Acc]>;
type test1 = Add_Pos_Neg<[0, 0], [0]>;
//   ^?
type test2 = Add_Pos_Neg<[0, 0], [0, 0]>;
//   ^?
type test3 = Add_Pos_Neg<[0], [0, 0]>;
//   ^?

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

type test = SmallerOrEqualT<[0], [0, 0]>;
//   ^?

type AddI<A extends number, B extends number> = Add<Integer<A>, Integer<B>>["length"];

type SubT<A extends number[], B extends number[], TRes extends number[] = []> =
	[...TRes, ...B] extends A ? TRes : SubT<A, B, [0, ...TRes]>;

type SubI<A extends number, B extends number> = (SubT<Integer<A>, Integer<B>> & number[])["length"];

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

const test_Integer = [
	expectTypeOf<[]>().toEqualTypeOf<Integer<0>>(),
	expectTypeOf<[0]>().toEqualTypeOf<Integer<1>>(),
	expectTypeOf<[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]>().toEqualTypeOf<Integer<10>>(),
];

const test_AddT = [
	expectTypeOf<[]>().toEqualTypeOf<Add<[], []>>(),
	expectTypeOf<[0]>().toEqualTypeOf<Add<[0], []>>(),
	expectTypeOf<[0]>().toEqualTypeOf<Add<[], [0]>>(),
	expectTypeOf<[0, 0, 0, 0, 0]>().toEqualTypeOf<Add<[0, 0], [0, 0, 0]>>(),
];

const test_SubT = [
	expectTypeOf<[]>().toEqualTypeOf<Add<[], []>>(),
	expectTypeOf<[0]>().toEqualTypeOf<Add<[0], []>>(),
	expectTypeOf<[0]>().toEqualTypeOf<Add<[], [0]>>(),
	expectTypeOf<[0, 0, 0, 0, 0]>().toEqualTypeOf<Add<[0, 0], [0, 0, 0]>>(),
];

type Tup7 = {
	number: [0, 0, 0, 0, 0, 0, 0];
	sign: "+";
};

type Tup3 = {
	number: [0, 0, 0];
	sign: "+";
};

type Tup_2 = {
	number: [0, 0];
	sign: "-";
};

type Tup_4 = {
	number: [0, 0, 0, 0];
	sign: "-";
};

type testAdd = Add_Pos_Neg<Tup_2, Tup_4>; // 7 + 3
//   ^?
// 3 - 5

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
