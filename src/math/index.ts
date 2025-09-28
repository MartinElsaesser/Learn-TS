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

type system1$1_01 = {
	sign: "+";
	int: [
		/* 101 zeros */
	];
	decimals_places: [0, 0];
};

type Repeat<TNum extends number, _Acc extends number[] = []> =
	_Acc["length"] extends TNum ? _Acc : Repeat<TNum, [0, ..._Acc]>;

type Num = Repeat<"3">;
//   ^?
// 1.01 + 1.19 => 2.20
// 101(2) + 119(2) => 220

type ParseNum<Num> = Num extends `${infer Parsed extends number}` ? Parsed : never;
type N1 = ParseNum<"101.69">;
//   ^?
type N2 = ParseNum<"101.70">;
//   ^?
type N4 = ParseNum<"01">;
//   ^?

// 1.5 + 1.15 => 1.65
// 15(1) + 115(2)
// 150(2) + 115(2) => 165(2)

// 1 * 0.5 => 0.5
// 10(1) * 5(1)  => 50(2)

// 1.19 - 1.01 => 0.18
// 119(2) - 101(2) => 18(2)

// 0.6 / 3 => 0.2
// 6(1) / 3 => 2(1)
