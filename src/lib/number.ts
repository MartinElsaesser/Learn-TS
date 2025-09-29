import { expectTypeOf } from "expect-type";
import * as $String from "./string";
import * as $Tuple from "./tuple";
import * as $Integer from "./integers";

type ParseIntPart<
	Int extends string,
	_Int extends string = $String.TrimLeadingMatchingChars<Int, "0">,
> = _Int extends "" ? "0" : _Int;

type ParseDecimalPart<
	Decimal extends string | undefined,
	_Decimal = $String.TrimTrailingMatchingChars<Cast<Decimal, string>, "0">,
> =
	Decimal extends undefined ? never
	: _Decimal extends "" ? never
	: _Decimal;

type RemoveSign<Num extends string> =
	Num extends `+${infer WithoutPlus}` ? { prefix: ""; number: WithoutPlus }
	: Num extends `-${infer WithoutMinus}` ? { prefix: "-"; number: WithoutMinus }
	: { prefix: ""; number: Num };

type ParseStringToNum<
	NumberWithSign extends string,
	_NumberAndPrefix extends { prefix: string; number: string } = RemoveSign<NumberWithSign>,
	_DecomposedNumber extends string[] = $String.Split<_NumberAndPrefix["number"], ".">,
	_IntPart extends string = ParseIntPart<_DecomposedNumber[0]>,
	_DecimalPart extends string | never = ParseDecimalPart<_DecomposedNumber[1]>,
	_Num extends string = [_DecimalPart] extends [never] ?
		`${_NumberAndPrefix["prefix"]}${_IntPart}`
	:	`${_NumberAndPrefix["prefix"]}${_IntPart}.${_DecimalPart}`,
	_IsValidDecimal extends boolean = _DecomposedNumber["length"] extends 0 ? true
	: _DecomposedNumber["length"] extends 1 ? true
	: _DecomposedNumber["length"] extends 2 ? true
	: false,
> =
	_IsValidDecimal extends true ?
		_Num extends `${infer Parsed extends number}` ?
			number extends Parsed ?
				never
			:	Parsed
		:	never
	:	never;

type ToNumber<Num extends string | number> = Num extends string ? ParseStringToNum<Num> : Num;

const emptyStringTest = [
	// <br>
	expectTypeOf<0>().toEqualTypeOf<ToNumber<"">>(),
];

// TODO: add +/-
const test_validCases = [
	expectTypeOf<100>().toEqualTypeOf<ToNumber<"100">>(),
	expectTypeOf<0.1>().toEqualTypeOf<ToNumber<"0.1">>(),
	expectTypeOf<0.1>().toEqualTypeOf<ToNumber<".1">>(),
	expectTypeOf<0>().toEqualTypeOf<ToNumber<"0">>(),
	expectTypeOf<101.69>().toEqualTypeOf<ToNumber<"101.69">>(),
	expectTypeOf<101.69>().toEqualTypeOf<ToNumber<101.69>>(),
];

const test_leadingZeroesInIntegerPart = [
	expectTypeOf<0>().toEqualTypeOf<ToNumber<"000">>(),
	expectTypeOf<10>().toEqualTypeOf<ToNumber<"0010">>(),
	expectTypeOf<0.01>().toEqualTypeOf<ToNumber<"00.01">>(),
];
const test_trailingZeroesInDecimalPart = [
	expectTypeOf<101.7>().toEqualTypeOf<ToNumber<"101.70">>(),
	expectTypeOf<17>().toEqualTypeOf<ToNumber<"17.0">>(),
];

const test_leadingAndTrailingZeroes = [
	expectTypeOf<17>().toEqualTypeOf<ToNumber<"017.0">>(),
	expectTypeOf<17.5>().toEqualTypeOf<ToNumber<"017.50">>(),
];

const testSign = [
	expectTypeOf<101.69>().toEqualTypeOf<ToNumber<"+101.69">>(),
	expectTypeOf<-101.69>().toEqualTypeOf<ToNumber<"-101.69">>(),
	expectTypeOf<101.69>().toEqualTypeOf<ToNumber<101.69>>(),
	expectTypeOf<0.0017>().toEqualTypeOf<ToNumber<"+.00170">>(),
	expectTypeOf<-0.0017>().toEqualTypeOf<ToNumber<"-.00170">>(),
];

const test_invalidNumbers = [
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"--1">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"++1">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"0.0.">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"1.1.1">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"1.0.0.0">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"1.2.3.4.5.6">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"a">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"a.0">>(),
	expectTypeOf<never>().toEqualTypeOf<ToNumber<"a.a">>(),
];

type Float = {
	sign: "+" | "-";
	integer: number[];
	shiftPlaces: number[];
};

type F1 = {
	sign: "-";
	integer: $Integer.Integer<170>;
	shiftPlaces: $Integer.Integer<5>;
};

type FloatToNumber<
	F extends Float,
	_ReversedInteger extends string = $String.Reverse<`${F["integer"]["length"]}`>,
	_PadInteger extends string = $String.PadEnd<_ReversedInteger, "0", F["shiftPlaces"]>,
	_AddedDecimalPoint extends string = $String.AddCharAtPosition<
		_PadInteger,
		".",
		F["shiftPlaces"]
	>,
	_Return extends string = `${F["sign"]}${$String.Reverse<_AddedDecimalPoint>}`,
> = ToNumber<_Return>;

type Num = FloatToNumber<F1>;
//   ^?
// 1.01 + 1.19 => 2.20
// 101(2) + 119(2) => 220

// 1.5 + 1.15 => 1.65
// 15(1) + 115(2)
// 150(2) + 115(2) => 165(2)

// 1 * 0.5 => 0.5
// 10(1) * 5(1)  => 50(2)
// 2 * 0.5 => 1
// 2(0) * 5(1) = 10(1)

// 1.19 - 1.01 => 0.18
// 119(2) - 101(2) => 18(2)

// 0.6 / 3 => 0.2
// 6(1) / 3 => 2(1)
