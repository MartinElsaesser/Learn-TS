import { expectTypeOf } from "expect-type";

type Num<TNum extends number, TTup extends number[] = []> =
	TTup["length"] extends TNum ? TTup : Num<TNum, [0, ...TTup]>;

// add
type AddT<A extends number[], B extends number[]> = [...A, ...B];

type Add<A extends number, B extends number> = AddT<Num<A>, Num<B>>["length"];

// subtract
type SubT<A extends number[], B extends number[], TRes extends number[] = []> =
	[...TRes, ...B] extends A ? TRes : SubT<A, B, [0, ...TRes]>;

type Sub<A extends number, B extends number> = (SubT<Num<A>, Num<B>> & number[])["length"];

// multiply
type MultT<
	A extends number[],
	B extends number[],
	CountA extends number[] = [],
	TRes extends number[] = [],
> = A extends CountA ? TRes : MultT<A, B, AddT<[0], CountA>, AddT<B, TRes>>;

type Mult<A extends number, B extends number> = (MultT<Num<A>, Num<B>> & number[])["length"];

// divide
type DivT<A extends number[], B extends number[], TRes extends number[] = []> =
	MultT<TRes, B> extends A ? TRes : DivT<A, B, AddT<[0], TRes>>;

type Div<A extends number, B extends number> = (DivT<Num<A>, Num<B>> & number[])["length"];

type calc = Add<Mult<2, 3>, 7>; // 2*3 +7

// binary
// 1000
// 100
type ReverseString<S extends string> =
	S extends `${infer F}${infer R}` ? `${ReverseString<R>}${F}` : S;

expectTypeOf<"">().toEqualTypeOf<ReverseString<"">>();
expectTypeOf<"a">().toEqualTypeOf<ReverseString<"a">>();
expectTypeOf<"ba">().toEqualTypeOf<ReverseString<"ab">>();
expectTypeOf<"fedcba">().toEqualTypeOf<ReverseString<"abcdef">>();

type BinToUnaryHelper<RevBinary extends string, _Zeros extends number[] = [0]> =
	RevBinary extends `${infer F}${infer R}` ?
		F extends "1" ?
			[..._Zeros, ...BinToUnaryHelper<R, [..._Zeros, ..._Zeros]>]
		:	BinToUnaryHelper<R, [..._Zeros, ..._Zeros]>
	: RevBinary extends "1" ? [..._Zeros]
	: [];
type BinToUnary<Binary extends string> = BinToUnaryHelper<ReverseString<Binary>>;

type BinToDecimal<Binary extends string> = BinToUnary<Binary>["length"];

type AddOneBinaryToBinary = any;
type AddOneBinary<B1 extends string, B2 extends string> = B1 extends "1" ? "" : "";
type AddBinary<B1 extends string, B2 extends string> =
	B1 extends `${infer FB1}${infer RB1}` ?
		B2 extends `${infer FB2}${infer RB2}` ?
			AddOneBinary<B1, B2>
		:	AddOneBinary<B1, "0">
	: B2 extends `${infer FB2}${infer RB2}` ? AddOneBinary<"0", B2>
	: "0";

type T_AddBinary = AddBinary<"0", "">;

type T_10112 = BinToDecimal<"10011110000000">;
//   ^?
type T_128 = BinToDecimal<"10000000">;
//   ^?

// ADD (A1 + A2) => Result

// A1 v / A2 >	positive	negative	0
// positive     pos			pos/neg		pos
// negative     pos/neg		neg			neg
// 0			pos			neg			0

type system1$1_01 = {
	sign: "+";
	int: [
		/* 101 zeros */
	];
	decimals_places: [0, 0];
};

// 1.01 + 1.19 => 2.20
// 101 + 119 => 220

type system2$1_01 = {
	sign: "+";
	decimal_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	integer_num: [0];
};

// system2 produces faulty results
// 0.01 + 0.19 => 0.20
// 10 + 91 = 101 => 0.101  (wrong X)

type system3$1_01 = {
	sign: "+";
	numerator: [
		/* 101 zeroes */
	];
	denonimator: [
		/* 100 zeroes */
	];
};
type system4$1_01 = {
	sign: "+";
	integer: [0];
	numerator: [
		/* 1 zeroes */
	];
	denonimator: [
		/* 100 zeroes */
	];
};

// system 1
// -
// system 2
// XXXXXXXX produces faulty results
// system 3
// - needs implementation for fractional addition and subtraction
// - needs simplification logic
// + multiplication and division are pretty simple
// system 4
// - needs implementation for fractional addition and subtraction
// - needs simplification logic
// + multiplication and division are pretty simple
