import { expectTypeOf } from "expect-type";
import * as $String from "../lib/string";

type system1$1_01 = {
	sign: "+";
	int: [
		/* 101 zeros */
	];
	decimals_places: [0, 0];
};

type Repeat<TNum extends number, _Acc extends number[] = []> =
	_Acc["length"] extends TNum ? _Acc : Repeat<TNum, [0, ..._Acc]>;

type Num = Repeat<3>;
//   ^?
// 1.01 + 1.19 => 2.20
// 101(2) + 119(2) => 220

type ParseIntPart<
	Int extends string,
	_Int extends string = $String.TrimLeadingMatchingChars<Int, "0">,
> = _Int extends "" ? "0" : _Int;

type ParseDecimalPart<
	Decimal extends string | undefined,
	_Decimal = $String.TrimEndingMatchingChars<Cast<Decimal, string>, "0">,
> =
	Decimal extends undefined ? never
	: _Decimal extends "" ? never
	: _Decimal;

type ParseStringToNum<
	Num extends string,
	_NumberParts extends string[] = $String.Split<Num, ".">,
	_IntPart extends string = ParseIntPart<_NumberParts[0]>,
	_SecondPart extends string | never = ParseDecimalPart<_NumberParts[1]>,
	_Num extends string = [_SecondPart] extends [never] ? _IntPart : `${_IntPart}.${_SecondPart}`,
	_IsValidDecimal extends boolean = _NumberParts["length"] extends 0 ? true
	: _NumberParts["length"] extends 1 ? true
	: _NumberParts["length"] extends 2 ? true
	: false,
> =
	_IsValidDecimal extends true ?
		_Num extends `${infer Parsed extends number}` ?
			Parsed
		:	never
	:	never;

type ToNumber<Num extends string | number> = Num extends string ? ParseStringToNum<Num> : Num;

expectTypeOf<0>().toEqualTypeOf<ToNumber<"">>();
expectTypeOf<100>().toEqualTypeOf<ToNumber<"100">>();
expectTypeOf<0.1>().toEqualTypeOf<ToNumber<"0.1">>();
expectTypeOf<0.1>().toEqualTypeOf<ToNumber<".1">>();
expectTypeOf<0>().toEqualTypeOf<ToNumber<"0">>();
expectTypeOf<101.69>().toEqualTypeOf<ToNumber<"101.69">>();
expectTypeOf<101.69>().toEqualTypeOf<ToNumber<101.69>>();

expectTypeOf<0>().toEqualTypeOf<ToNumber<"000">>();
expectTypeOf<0>().toEqualTypeOf<ToNumber<"00">>();
expectTypeOf<0>().toEqualTypeOf<ToNumber<"0">>();

expectTypeOf<10>().toEqualTypeOf<ToNumber<"0010">>();
expectTypeOf<0.01>().toEqualTypeOf<ToNumber<"00.01">>();
expectTypeOf<0.01>().toEqualTypeOf<ToNumber<"00.010">>();

expectTypeOf<101.7>().toEqualTypeOf<ToNumber<"101.70">>();
expectTypeOf<17>().toEqualTypeOf<ToNumber<"17.0">>();

expectTypeOf<never>().toEqualTypeOf<ToNumber<"0.0.">>();
expectTypeOf<never>().toEqualTypeOf<ToNumber<"1.1.1">>();
expectTypeOf<never>().toEqualTypeOf<ToNumber<"1.0.0.0">>();
expectTypeOf<never>().toEqualTypeOf<ToNumber<"1.2.3.4.5.6">>();

// 1.5 + 1.15 => 1.65
// 15(1) + 115(2)
// 150(2) + 115(2) => 165(2)

// 1 * 0.5 => 0.5
// 10(1) * 5(1)  => 50(2)

// 1.19 - 1.01 => 0.18
// 119(2) - 101(2) => 18(2)

// 0.6 / 3 => 0.2
// 6(1) / 3 => 2(1)
