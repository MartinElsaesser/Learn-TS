export type AddWithoutCarry = [
	[
		{ carry: 0; digit: 0 }, // 0 + 0
		{ carry: 0; digit: 1 }, // 0 + 1
		{ carry: 0; digit: 2 }, // 0 + 2
		{ carry: 0; digit: 3 }, // 0 + 3
		{ carry: 0; digit: 4 }, // 0 + 4
		{ carry: 0; digit: 5 }, // 0 + 5
		{ carry: 0; digit: 6 }, // 0 + 6
		{ carry: 0; digit: 7 }, // 0 + 7
		{ carry: 0; digit: 8 }, // 0 + 8
		{ carry: 0; digit: 9 }, // 0 + 9
	],
	[
		{ carry: 0; digit: 1 }, // 1 + 0
		{ carry: 0; digit: 2 }, // 1 + 1
		{ carry: 0; digit: 3 }, // 1 + 2
		{ carry: 0; digit: 4 }, // 1 + 3
		{ carry: 0; digit: 5 }, // 1 + 4
		{ carry: 0; digit: 6 }, // 1 + 5
		{ carry: 0; digit: 7 }, // 1 + 6
		{ carry: 0; digit: 8 }, // 1 + 7
		{ carry: 0; digit: 9 }, // 1 + 8
		{ carry: 1; digit: 0 }, // 1 + 9
	],
	[
		{ carry: 0; digit: 2 }, // 2 + 0
		{ carry: 0; digit: 3 }, // 2 + 1
		{ carry: 0; digit: 4 }, // 2 + 2
		{ carry: 0; digit: 5 }, // 2 + 3
		{ carry: 0; digit: 6 }, // 2 + 4
		{ carry: 0; digit: 7 }, // 2 + 5
		{ carry: 0; digit: 8 }, // 2 + 6
		{ carry: 0; digit: 9 }, // 2 + 7
		{ carry: 1; digit: 0 }, // 2 + 8
		{ carry: 1; digit: 1 }, // 2 + 9
	],
	[
		{ carry: 0; digit: 3 }, // 3 + 0
		{ carry: 0; digit: 4 }, // 3 + 1
		{ carry: 0; digit: 5 }, // 3 + 2
		{ carry: 0; digit: 6 }, // 3 + 3
		{ carry: 0; digit: 7 }, // 3 + 4
		{ carry: 0; digit: 8 }, // 3 + 5
		{ carry: 0; digit: 9 }, // 3 + 6
		{ carry: 1; digit: 0 }, // 3 + 7
		{ carry: 1; digit: 1 }, // 3 + 8
		{ carry: 1; digit: 2 }, // 3 + 9
	],
	[
		{ carry: 0; digit: 4 }, // 4 + 0
		{ carry: 0; digit: 5 }, // 4 + 1
		{ carry: 0; digit: 6 }, // 4 + 2
		{ carry: 0; digit: 7 }, // 4 + 3
		{ carry: 0; digit: 8 }, // 4 + 4
		{ carry: 0; digit: 9 }, // 4 + 5
		{ carry: 1; digit: 0 }, // 4 + 6
		{ carry: 1; digit: 1 }, // 4 + 7
		{ carry: 1; digit: 2 }, // 4 + 8
		{ carry: 1; digit: 3 }, // 4 + 9
	],
	[
		{ carry: 0; digit: 5 }, // 5 + 0
		{ carry: 0; digit: 6 }, // 5 + 1
		{ carry: 0; digit: 7 }, // 5 + 2
		{ carry: 0; digit: 8 }, // 5 + 3
		{ carry: 0; digit: 9 }, // 5 + 4
		{ carry: 1; digit: 0 }, // 5 + 5
		{ carry: 1; digit: 1 }, // 5 + 6
		{ carry: 1; digit: 2 }, // 5 + 7
		{ carry: 1; digit: 3 }, // 5 + 8
		{ carry: 1; digit: 4 }, // 5 + 9
	],
	[
		{ carry: 0; digit: 6 }, // 6 + 0
		{ carry: 0; digit: 7 }, // 6 + 1
		{ carry: 0; digit: 8 }, // 6 + 2
		{ carry: 0; digit: 9 }, // 6 + 3
		{ carry: 1; digit: 0 }, // 6 + 4
		{ carry: 1; digit: 1 }, // 6 + 5
		{ carry: 1; digit: 2 }, // 6 + 6
		{ carry: 1; digit: 3 }, // 6 + 7
		{ carry: 1; digit: 4 }, // 6 + 8
		{ carry: 1; digit: 5 }, // 6 + 9
	],
	[
		{ carry: 0; digit: 7 }, // 7 + 0
		{ carry: 0; digit: 8 }, // 7 + 1
		{ carry: 0; digit: 9 }, // 7 + 2
		{ carry: 1; digit: 0 }, // 7 + 3
		{ carry: 1; digit: 1 }, // 7 + 4
		{ carry: 1; digit: 2 }, // 7 + 5
		{ carry: 1; digit: 3 }, // 7 + 6
		{ carry: 1; digit: 4 }, // 7 + 7
		{ carry: 1; digit: 5 }, // 7 + 8
		{ carry: 1; digit: 6 }, // 7 + 9
	],
	[
		{ carry: 0; digit: 8 }, // 8 + 0
		{ carry: 0; digit: 9 }, // 8 + 1
		{ carry: 1; digit: 0 }, // 8 + 2
		{ carry: 1; digit: 1 }, // 8 + 3
		{ carry: 1; digit: 2 }, // 8 + 4
		{ carry: 1; digit: 3 }, // 8 + 5
		{ carry: 1; digit: 4 }, // 8 + 6
		{ carry: 1; digit: 5 }, // 8 + 7
		{ carry: 1; digit: 6 }, // 8 + 8
		{ carry: 1; digit: 7 }, // 8 + 9
	],
	[
		{ carry: 0; digit: 9 }, // 9 + 0
		{ carry: 1; digit: 0 }, // 9 + 1
		{ carry: 1; digit: 1 }, // 9 + 2
		{ carry: 1; digit: 2 }, // 9 + 3
		{ carry: 1; digit: 3 }, // 9 + 4
		{ carry: 1; digit: 4 }, // 9 + 5
		{ carry: 1; digit: 5 }, // 9 + 6
		{ carry: 1; digit: 6 }, // 9 + 7
		{ carry: 1; digit: 7 }, // 9 + 8
		{ carry: 1; digit: 8 }, // 9 + 9
	],
];
/*
Carry In	5
D1			9
D2			8
D1 + D2	   17
D1 + D2 + C22
Result 		8
Carry Out	1

*/

type NumberWithCarry = { carry: number; digit: number };
export type AddWithCarry<
	D1 extends number,
	D2 extends number,
	CarryIn extends number,
	_D1plusD2 extends NumberWithCarry = AddWithoutCarry[D1][D2],
	_D1plusD2plusCarryIn extends NumberWithCarry = AddWithoutCarry[_D1plusD2["digit"]][CarryIn],
	_AddCarries extends
		NumberWithCarry = AddWithoutCarry[_D1plusD2plusCarryIn["carry"]][_D1plusD2["carry"]],
> = {
	carry: _AddCarries["digit"];
	digit: _D1plusD2plusCarryIn["digit"];
};

type ReverseString<T extends string> =
	T extends `${infer F}${infer R}` ? `${ReverseString<R>}${F}` : T;

type ParseNumber<T extends string> = T extends `${infer N extends number}` ? N : never;

type SplitIntoNumberAndRest<T extends string> =
	T extends `${infer F extends number}${infer R}` ? [F, R] : [0, ""];

type AddReversed<Num1 extends number[], Num2 extends number[], _Carry extends number = 0> =
	Num1 extends [...infer Num1Rest extends number[], infer Num1Last extends number] ?
		Num2 extends [...infer Num2Rest extends number[], infer Num2Last extends number] ?
			`${AddReversed<Num1Rest, Num2Rest, AddWithCarry<Num1Last, Num2Last, _Carry>["carry"]>}${AddWithCarry<Num1Last, Num2Last, _Carry>["digit"]}`
		:	`${AddReversed<Num1Rest, [], AddWithCarry<Num1Last, 0, _Carry>["carry"]>}${AddWithCarry<Num1Last, 0, _Carry>["digit"]}`
	: Num2 extends [...infer Num2Rest extends number[], infer Num2Last extends number] ?
		`${AddReversed<[], Num2Rest, AddWithCarry<0, Num2Last, _Carry>["carry"]>}${AddWithCarry<0, Num2Last, _Carry>["digit"]}`
	:	`${_Carry extends 0 ? "" : _Carry}`;

type StringToNumberArray<S extends string> =
	S extends `${infer F extends number}${infer R}` ? [F, ...StringToNumberArray<R>] : [];

export type Add<T1 extends number, T2 extends number> = ParseNumber<
	AddReversed<StringToNumberArray<`${T1}`>, StringToNumberArray<`${T2}`>>
>;

type DebugAddWithCarry = AddWithCarry<9, 1, 1>;
//   ^?
type DebugAddReversed = AddReversed<[9, 9, 9], [9]>;
//   ^?
type DebugAdd = Add<999, 9999>;
//   ^?
