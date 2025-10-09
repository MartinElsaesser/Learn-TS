type AddWithoutCarry = [
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

// 0 + (1+1)
type NumberWithCarry = { carry: number; digit: number };
type AddWithCarry<
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

type Result = AddWithCarry<9, 1, 1>;
//   ^?

///
type ReverseString<T extends string> =
	T extends `${infer F}${infer R}` ? `${ReverseString<R>}${F}` : T;

type GetFirstOrDefault<T extends string, Default extends string> =
	T extends `${infer F}${infer R}` ? F : Default;

type ToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;

type GetRestOrDefault<T extends string, Default extends string> =
	T extends `${infer F}${infer R}` ? R : Default;

type AddReversed<
	D1 extends string,
	D2 extends string,
	_Carry extends number = 0,
	_D1First extends number = ToNumber<GetFirstOrDefault<D1, "0">>,
	_D2First extends number = ToNumber<GetFirstOrDefault<D2, "0">>,
	_R1 extends string = GetRestOrDefault<D1, "">,
	_R2 extends string = GetRestOrDefault<D2, "">,
	_Result extends NumberWithCarry = AddWithCarry<_D1First, _D2First, _Carry>,
> =
	_R1 extends "" ?
		_R2 extends "" ?
			`${_Result["digit"]}${_Result["carry"] extends 0 ? "" : _Result["carry"]}`
		:	`${_Result["digit"]}${AddReversed<_R1, _R2, _Result["carry"]>}`
	:	`${_Result["digit"]}${AddReversed<_R1, _R2, _Result["carry"]>}`;

// 29 + 8 = 37
type test = AddReversed<"999", "1">;
//   ^?

//  10
// 	99
//   1
// ----
//   0
type RemoveLeadingChar<T extends string, Char extends string> =
	T extends `${infer F}${infer R}` ?
		F extends Char ?
			RemoveLeadingChar<R, Char>
		:	T
	:	T;

type Add<
	T1 extends number,
	T2 extends number,
	_ReversedResult extends string = AddReversed<ReverseString<`${T1}`>, ReverseString<`${T2}`>>,
	_Result extends string = ReverseString<_ReversedResult>,
> = ToNumber<_Result>;

type result = Add<99, 99>;
//   ^?
