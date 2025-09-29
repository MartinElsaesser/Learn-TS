import { expectTypeOf as expected } from "expect-type";
export type Join<S1 extends string, Separator extends string, S2 extends string> =
	S1 extends "" ?
		S2 extends "" ?
			""
		:	S2
	: S2 extends "" ? S1
	: `${S1}${Separator}${S2}`;

const testSuite1 = [
	expected<"">().toEqualTypeOf<Join<"", ".", "">>(),
	expected<"a">().toEqualTypeOf<Join<"a", ".", "">>(),
	expected<"b">().toEqualTypeOf<Join<"", ".", "b">>(),
	expected<"a.b">().toEqualTypeOf<Join<"a", ".", "b">>(),
];

type TupleWithoutEmptyString<S extends string> = S extends "" ? [] : [S];
export type Split<S extends string, Separator extends string> =
	S extends `${infer Prev}${Separator}${infer Rest}` ? [Prev, ...Split<Rest, Separator>] : [S];
const testSuite2 = [
	expected<[""]>().toEqualTypeOf<Split<"", ".">>(),
	expected<["a"]>().toEqualTypeOf<Split<"a", ".">>(),
	expected<["a", "b", "c"]>().toEqualTypeOf<Split<"a.b.c", ".">>(),

	expected<["a", ""]>().toEqualTypeOf<Split<"a.", ".">>(),
	expected<["a", "b", "c", ""]>().toEqualTypeOf<Split<"a.b.c.", ".">>(),
	expected<["", "b"]>().toEqualTypeOf<Split<".b", ".">>(),
	expected<["", "", ""]>().toEqualTypeOf<Split<"..", ".">>(),
];

export type SplitExceptTrailingEmpty<S extends string, Separator extends string> =
	S extends `${infer Prev}${Separator}${infer Rest}` ?
		[Prev, ...SplitExceptTrailingEmpty<Rest, Separator>]
	:	TupleWithoutEmptyString<S>;
const testSuite3 = [
	expected<[]>().toEqualTypeOf<SplitExceptTrailingEmpty<"", ".">>(),
	expected<["a"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a", ".">>(),
	expected<["a", "b", "c"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a.b.c", ".">>(),

	expected<["a"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a.", ".">>(),
	expected<["a", "b", "c"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a.b.c.", ".">>(),
	expected<["", "b"]>().toEqualTypeOf<SplitExceptTrailingEmpty<".b", ".">>(),
	expected<["", ""]>().toEqualTypeOf<SplitExceptTrailingEmpty<"..", ".">>(),
];

export type SplitWithoutEmpty<S extends string, Separator extends string> =
	S extends `${infer Prev}${Separator}${infer Rest}` ?
		[...TupleWithoutEmptyString<Prev>, ...SplitWithoutEmpty<Rest, Separator>]
	:	TupleWithoutEmptyString<S>;

const testSuite4 = [
	expected<[]>().toEqualTypeOf<SplitWithoutEmpty<"", ".">>(),
	expected<["a"]>().toEqualTypeOf<SplitWithoutEmpty<"a", ".">>(),
	expected<["a", "b", "c"]>().toEqualTypeOf<SplitWithoutEmpty<"a.b.c", ".">>(),

	expected<["a"]>().toEqualTypeOf<SplitWithoutEmpty<"a.", ".">>(),
	expected<["a", "b", "c"]>().toEqualTypeOf<SplitWithoutEmpty<"a.b.c.", ".">>(),
	expected<["b"]>().toEqualTypeOf<SplitWithoutEmpty<".b", ".">>(),
	expected<[]>().toEqualTypeOf<SplitWithoutEmpty<"..", ".">>(),
];

export type GetLastChar<T extends string> =
	T extends `${infer F}${infer R}` ?
		R extends "" ?
			F
		:	GetLastChar<R>
	:	never;
const testSuite5 = [
	expected<never>().toEqualTypeOf<GetLastChar<"">>(),
	expected<"a">().toEqualTypeOf<GetLastChar<"a">>(),
	expected<"b">().toEqualTypeOf<GetLastChar<"ab">>(),
	expected<"z">().toEqualTypeOf<GetLastChar<"abcdefghijklmnopqrstuvwxyz">>(),
];

export type EmptyToNever<S extends string> = S extends "" ? never : S;
export type EndsOn<S extends string, LastChar extends string> =
	[GetLastChar<S>, EmptyToNever<LastChar>] extends [EmptyToNever<LastChar>, GetLastChar<S>] ? true
	:	false;

const testSuite6 = [
	expected<true>().toEqualTypeOf<EndsOn<"", "">>(),
	expected<true>().toEqualTypeOf<EndsOn<"a", "a">>(),
	expected<true>().toEqualTypeOf<EndsOn<"ab", "b">>(),
	expected<true>().toEqualTypeOf<EndsOn<"abcdefghijklmnopqrstuvwxyz", "z">>(),
	expected<false>().toEqualTypeOf<EndsOn<"", "a">>(),
	expected<false>().toEqualTypeOf<EndsOn<"abcdefghijklmnopqrstuvwxyz", "">>(),
	expected<false>().toEqualTypeOf<EndsOn<"abcdefghijklmnopqrstuvwxyz", "b">>(),
];

export type TrimLeadingMatchingChars<S extends string, CharacterToTrim extends string> =
	S extends `${infer F}${infer R}` ?
		F extends CharacterToTrim ?
			TrimLeadingMatchingChars<R, CharacterToTrim>
		:	S
	:	S;

const testSuite7 = [
	expected<"">().toEqualTypeOf<TrimLeadingMatchingChars<"aaaaaa", "a">>(),
	expected<"b">().toEqualTypeOf<TrimLeadingMatchingChars<"aab", "a">>(),
	expected<"ba">().toEqualTypeOf<TrimLeadingMatchingChars<"aba", "a">>(),
	expected<"bac">().toEqualTypeOf<TrimLeadingMatchingChars<"aabac", "a">>(),
	expected<"-bac">().toEqualTypeOf<TrimLeadingMatchingChars<"aa-bac", "a">>(),
];

export type TrimTrailingMatchingChars<S extends string, CharacterToTrim extends string> = Reverse<
	TrimLeadingMatchingChars<Reverse<S>, CharacterToTrim>
>;

const testSuite8 = [
	expected<"">().toEqualTypeOf<TrimTrailingMatchingChars<"aaaaaa", "a">>(),
	expected<"b">().toEqualTypeOf<TrimTrailingMatchingChars<"baa", "a">>(),
	expected<"ab">().toEqualTypeOf<TrimTrailingMatchingChars<"aba", "a">>(),
	expected<"caab">().toEqualTypeOf<TrimTrailingMatchingChars<"caaba", "a">>(),
	expected<"abccdef">().toEqualTypeOf<TrimTrailingMatchingChars<"abccdefcc", "c">>(),
];

export type Reverse<S extends string> = S extends `${infer F}${infer R}` ? `${Reverse<R>}${F}` : S;

const testSuite9 = [
	expected<"">().toEqualTypeOf<Reverse<"">>(),
	expected<"a">().toEqualTypeOf<Reverse<"a">>(),
	expected<"ba">().toEqualTypeOf<Reverse<"ab">>(),
	expected<"fedcba">().toEqualTypeOf<Reverse<"abcdef">>(),
];

export type AddCharAtPosition<
	S extends string,
	Char extends string,
	Position extends number[],
	_Index extends number[] = [],
	_Before extends string = "",
> =
	S extends `${infer F}${infer R}` ?
		Position extends _Index ?
			`${_Before}${Char}${S}` // loop exhausted
		:	AddCharAtPosition<R, Char, Position, [0, ..._Index], `${_Before}${F}`> // loop again
	:	`${_Before}${Char}${S}`; // S is empty

const testSuite10 = [
	expected<".">().toEqualTypeOf<AddCharAtPosition<"", ".", []>>(),
	expected<"ab.cd">().toEqualTypeOf<AddCharAtPosition<"abcd", ".", [0, 0]>>(),
	expected<"abc.de">().toEqualTypeOf<AddCharAtPosition<"abcde", ".", [0, 0, 0]>>(),
	expected<"abcde.">().toEqualTypeOf<AddCharAtPosition<"abcde", ".", [0, 0, 0, 0, 0]>>(),
	expected<"abcde.">().toEqualTypeOf<AddCharAtPosition<"abcde", ".", [0, 0, 0, 0, 0, 0]>>(),
];

export type PadEnd<
	S extends string,
	PadChar extends string,
	Length extends number[],
	_Index extends number[] = [],
	_Before extends string = "",
> =
	Length extends _Index ?
		`${_Before}${S}` // loop exhausted
	: S extends `${infer F}${infer R}` ?
		PadEnd<R, PadChar, Length, [0, ..._Index], `${_Before}${F}`> // still letters left in S
	:	PadEnd<S, PadChar, Length, [0, ..._Index], `${_Before}${PadChar}`>; // no more letters left in S

type debug = PadEnd<"abcde", "0", [0, 0, 0, 0, 0, 0, 0]>;
//   ^?

const testSuite11 = [
	expected<"abcde00">().toEqualTypeOf<PadEnd<"abcde", "0", [0, 0, 0, 0, 0, 0, 0]>>(),
	expected<"000">().toEqualTypeOf<PadEnd<"", "0", [0, 0, 0]>>(),
	expected<"000">().toEqualTypeOf<PadEnd<"", "0", [0, 0, 0]>>(),
	expected<"abc">().toEqualTypeOf<PadEnd<"abc", "0", [0, 0, 0]>>(),
	expected<"abcd">().toEqualTypeOf<PadEnd<"abcd", "0", [0, 0, 0]>>(),
	expected<"0">().toEqualTypeOf<PadEnd<"", "0", [0]>>(),
];
