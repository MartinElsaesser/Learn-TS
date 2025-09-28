import { expectTypeOf } from "expect-type";

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
// 101(2) + 119(2) => 220

// 1.5 + 1.15 => 1.65
// 15(1) + 115(2)
// 150(2) + 115(2) => 165(2)

// 1 * 0.5 => 0.5
// 10(1) * 5(1)  => 50(2)

// 1.19 - 1.01 => 0.18
// 119(2) - 101(2) => 18(2)

// 0.6 / 3 => 0.2
// 6(1) / 3 => 2(1)

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
// 1.01 + 1.19 => 2.20
// 101/100 + 119/100 => 220/100

// 1.5 + 1.15 => 1.65
// 150/100 + 115/100 => 165/100

// 1 * 0.5 => 0.5
// 1 * 5/10  => 5/10

// 1.19 - 1.01 => 0.18
// 119/100 - 101/100 => 18/100

// 0.6 / 3 => 0.2
// 6/10 / 3 => 2/10

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
// 1.01 + 1.19 => 2.20
// 1+1/100 + 1+19/100 => 2+20/100

// 1.5 + 1.15 => 1.65
// 1+50/100 + 1+15/100 => 1+65/100

// 1 * 0.5 => 0.5
// 1 * 5/10  => 5/10

// 1.19 - 1.01 => 0.18
// 1+19/100 - 1+01/100 => 18/100

// 0.6 / 3 => 0.2
// 6/10 / 3 => 2/10

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
