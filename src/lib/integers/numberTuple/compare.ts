import { P } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";
import { ParseNumber, StringToNumberTuple } from "./utils";

export type IsEqual<T1 extends number, T2 extends number> =
	[T1, T2] extends [T2, T1] ? true : false;

type IsSmallerTable = [
	[
		false, // 0 < 0
		true, // 0 < 1
		true, // 0 < 2
		true, // 0 < 3
		true, // 0 < 4
		true, // 0 < 5
		true, // 0 < 6
		true, // 0 < 7
		true, // 0 < 8
		true, // 0 < 9
	],
	[
		false, // 1 < 0
		false, // 1 < 1
		true, // 1 < 2
		true, // 1 < 3
		true, // 1 < 4
		true, // 1 < 5
		true, // 1 < 6
		true, // 1 < 7
		true, // 1 < 8
		true, // 1 < 9
	],
	[
		false, // 2 < 0
		false, // 2 < 1
		false, // 2 < 2
		true, // 2 < 3
		true, // 2 < 4
		true, // 2 < 5
		true, // 2 < 6
		true, // 2 < 7
		true, // 2 < 8
		true, // 2 < 9
	],
	[
		false, // 3 < 0
		false, // 3 < 1
		false, // 3 < 2
		false, // 3 < 3
		true, // 3 < 4
		true, // 3 < 5
		true, // 3 < 6
		true, // 3 < 7
		true, // 3 < 8
		true, // 3 < 9
	],
	[
		false, // 4 < 0
		false, // 4 < 1
		false, // 4 < 2
		false, // 4 < 3
		false, // 4 < 4
		true, // 4 < 5
		true, // 4 < 6
		true, // 4 < 7
		true, // 4 < 8
		true, // 4 < 9
	],
	[
		false, // 5 < 0
		false, // 5 < 1
		false, // 5 < 2
		false, // 5 < 3
		false, // 5 < 4
		false, // 5 < 5
		true, // 5 < 6
		true, // 5 < 7
		true, // 5 < 8
		true, // 5 < 9
	],
	[
		false, // 6 < 0
		false, // 6 < 1
		false, // 6 < 2
		false, // 6 < 3
		false, // 6 < 4
		false, // 6 < 5
		false, // 6 < 6
		true, // 6 < 7
		true, // 6 < 8
		true, // 6 < 9
	],
	[
		false, // 7 < 0
		false, // 7 < 1
		false, // 7 < 2
		false, // 7 < 3
		false, // 7 < 4
		false, // 7 < 5
		false, // 7 < 6
		false, // 7 < 7
		true, // 7 < 8
		true, // 7 < 9
	],
	[
		false, // 8 < 0
		false, // 8 < 1
		false, // 8 < 2
		false, // 8 < 3
		false, // 8 < 4
		false, // 8 < 5
		false, // 8 < 6
		false, // 8 < 7
		false, // 8 < 8
		true, // 8 < 9
	],
	[
		false, // 9 < 0
		false, // 9 < 1
		false, // 9 < 2
		false, // 9 < 3
		false, // 9 < 4
		false, // 9 < 5
		false, // 9 < 6
		false, // 9 < 7
		false, // 9 < 8
		false, // 9 < 9
	],
];

type IsGreaterTable = [
	[
		false, // 0 > 0
		false, // 0 > 1
		false, // 0 > 2
		false, // 0 > 3
		false, // 0 > 4
		false, // 0 > 5
		false, // 0 > 6
		false, // 0 > 7
		false, // 0 > 8
		false, // 0 > 9
	],
	[
		true, // 1 > 0
		false, // 1 > 1
		false, // 1 > 2
		false, // 1 > 3
		false, // 1 > 4
		false, // 1 > 5
		false, // 1 > 6
		false, // 1 > 7
		false, // 1 > 8
		false, // 1 > 9
	],
	[
		true, // 2 > 0
		true, // 2 > 1
		false, // 2 > 2
		false, // 2 > 3
		false, // 2 > 4
		false, // 2 > 5
		false, // 2 > 6
		false, // 2 > 7
		false, // 2 > 8
		false, // 2 > 9
	],
	[
		true, // 3 > 0
		true, // 3 > 1
		true, // 3 > 2
		false, // 3 > 3
		false, // 3 > 4
		false, // 3 > 5
		false, // 3 > 6
		false, // 3 > 7
		false, // 3 > 8
		false, // 3 > 9
	],
	[
		true, // 4 > 0
		true, // 4 > 1
		true, // 4 > 2
		true, // 4 > 3
		false, // 4 > 4
		false, // 4 > 5
		false, // 4 > 6
		false, // 4 > 7
		false, // 4 > 8
		false, // 4 > 9
	],
	[
		true, // 5 > 0
		true, // 5 > 1
		true, // 5 > 2
		true, // 5 > 3
		true, // 5 > 4
		false, // 5 > 5
		false, // 5 > 6
		false, // 5 > 7
		false, // 5 > 8
		false, // 5 > 9
	],
	[
		true, // 6 > 0
		true, // 6 > 1
		true, // 6 > 2
		true, // 6 > 3
		true, // 6 > 4
		true, // 6 > 5
		false, // 6 > 6
		false, // 6 > 7
		false, // 6 > 8
		false, // 6 > 9
	],
	[
		true, // 7 > 0
		true, // 7 > 1
		true, // 7 > 2
		true, // 7 > 3
		true, // 7 > 4
		true, // 7 > 5
		true, // 7 > 6
		false, // 7 > 7
		false, // 7 > 8
		false, // 7 > 9
	],
	[
		true, // 8 > 0
		true, // 8 > 1
		true, // 8 > 2
		true, // 8 > 3
		true, // 8 > 4
		true, // 8 > 5
		true, // 8 > 6
		true, // 8 > 7
		false, // 8 > 8
		false, // 8 > 9
	],
	[
		true, // 9 > 0
		true, // 9 > 1
		true, // 9 > 2
		true, // 9 > 3
		true, // 9 > 4
		true, // 9 > 5
		true, // 9 > 6
		true, // 9 > 7
		true, // 9 > 8
		false, // 9 > 9
	],
];

type IsSmallerNumberTuple<
	Num1 extends number[],
	Num2 extends number[],
	_Bool extends boolean = false,
> =
	Num1 extends [infer Num1First extends number, ...infer Num1Rest extends number[]] ?
		Num2 extends [infer Num2First extends number, ...infer Num2Rest extends number[]] ?
			// Num1 and Num2 have digits
			IsSmallerTable[Num1First][Num2First] extends true ?
				IsSmallerNumberTuple<Num1Rest, Num2Rest, true>
			:	IsSmallerNumberTuple<Num1Rest, Num2Rest, _Bool>
		:	// Num1.length > Num2.length
			false
	: Num2 extends [infer Num2First extends number, ...infer Num2Rest extends number[]] ?
		// Num1.length < Num2.length
		true
	:	// Num1.length === Num2.length
		_Bool;
export type IsSmallerUnsigned<T1 extends number, T2 extends number> = IsSmallerNumberTuple<
	StringToNumberTuple<`${T1}`>,
	StringToNumberTuple<`${T2}`>
>;

type IsGreaterNumberTuple<
	Num1 extends number[],
	Num2 extends number[],
	_Bool extends boolean = false,
> =
	Num1 extends [infer Num1First extends number, ...infer Num1Rest extends number[]] ?
		Num2 extends [infer Num2First extends number, ...infer Num2Rest extends number[]] ?
			// Num1 and Num2 have digits
			IsGreaterTable[Num1First][Num2First] extends true ?
				IsGreaterNumberTuple<Num1Rest, Num2Rest, true>
			:	IsGreaterNumberTuple<Num1Rest, Num2Rest, _Bool>
		:	// Num1.length > Num2.length
			true
	: Num2 extends [infer Num2First extends number, ...infer Num2Rest extends number[]] ?
		// Num1.length < Num2.length
		false
	:	// Num1.length === Num2.length
		_Bool;

export type IsGreaterUnsigned<T1 extends number, T2 extends number> = IsGreaterNumberTuple<
	StringToNumberTuple<`${T1}`>,
	StringToNumberTuple<`${T2}`>
>;

export type IsGreater<
	T1 extends number,
	T2 extends number,
	Num1 extends ["+" | "-", number] = GetSignAndNumber<T1>,
	Num2 extends ["+" | "-", number] = GetSignAndNumber<T2>,
> =
	Num1[0] extends "+" ?
		Num2[0] extends "+" ?
			// Num1 positive, Num2 positive
			IsGreaterUnsigned<Num1[1], Num2[1]>
		:	// Num1 positive, Num2 negative
			true
	: Num2[0] extends "+" ?
		// Num1 negative, Num2 positive
		false
	:	// Num1 negative, Num2 negative
		IsSmallerUnsigned<Num1[1], Num2[1]>;

export type IsSmaller<
	T1 extends number,
	T2 extends number,
	Num1 extends ["+" | "-", number] = GetSignAndNumber<T1>,
	Num2 extends ["+" | "-", number] = GetSignAndNumber<T2>,
> =
	Num1[0] extends "+" ?
		Num2[0] extends "+" ?
			// Num1 positive, Num2 positive
			IsSmallerUnsigned<Num1[1], Num2[1]>
		:	// Num1 positive, Num2 negative
			false
	: Num2[0] extends "+" ?
		// Num1 negative, Num2 positive
		true
	:	// Num1 negative, Num2 negative
		IsGreaterUnsigned<Num1[1], Num2[1]>;

export type IsSmallerOrEqual<
	T1 extends number,
	T2 extends number,
	Num1 extends ["+" | "-", number] = GetSignAndNumber<T1>,
	Num2 extends ["+" | "-", number] = GetSignAndNumber<T2>,
> =
	Num1[0] extends "+" ?
		Num2[0] extends "+" ?
			// Num1 positive, Num2 positive
			IsSmallerOrEqualUnsigned<Num1[1], Num2[1]>
		:	// Num1 positive, Num2 negative
			false
	: Num2[0] extends "+" ?
		// Num1 negative, Num2 positive
		true
	:	// Num1 negative, Num2 negative
		IsGreaterOrEqualUnsigned<Num1[1], Num2[1]>;

export type IsGreaterOrEqual<
	T1 extends number,
	T2 extends number,
	Num1 extends ["+" | "-", number] = GetSignAndNumber<T1>,
	Num2 extends ["+" | "-", number] = GetSignAndNumber<T2>,
> =
	Num1[0] extends "+" ?
		Num2[0] extends "+" ?
			// Num1 positive, Num2 positive
			IsGreaterOrEqualUnsigned<Num1[1], Num2[1]>
		:	// Num1 positive, Num2 negative
			true
	: Num2[0] extends "+" ?
		// Num1 negative, Num2 positive
		false
	:	// Num1 negative, Num2 negative
		IsSmallerOrEqualUnsigned<Num1[1], Num2[1]>;

type test = IsEqual<10, 10>;
//   ^?

type GetSignAndNumber<T extends number> =
	`${T}` extends `-${infer PositiveNumberString}` ? ["-", ParseNumber<PositiveNumberString>]
	:	["+", T];

export type IsGreaterOrEqualUnsigned<T1 extends number, T2 extends number> =
	IsSmallerUnsigned<T1, T2> extends true ? false : true;
export type IsSmallerOrEqualUnsigned<T1 extends number, T2 extends number> =
	IsGreaterUnsigned<T1, T2> extends true ? false : true;
