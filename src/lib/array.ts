import { expectTypeOf as expected } from "expect-type";
import * as $String from "./string";
export type ExcludeLastElement<T extends readonly unknown[]> =
	T extends [infer F, ...infer R] ?
		R extends [] ?
			[]
		:	[F, ...ExcludeLastElement<R>]
	:	[];

const testSuite1 = [
	expected<[]>().toEqualTypeOf<ExcludeLastElement<[]>>(),
	expected<[]>().toEqualTypeOf<ExcludeLastElement<["a"]>>(),
	expected<["a"]>().toEqualTypeOf<ExcludeLastElement<["a", "b"]>>(),
	expected<["a", "b", "c", "d"]>().toEqualTypeOf<ExcludeLastElement<["a", "b", "c", "d", "e"]>>(),
];

export type OnlyLastElement<T extends readonly unknown[]> =
	T extends [infer F, ...infer R] ?
		R extends [] ?
			F
		:	OnlyLastElement<R>
	:	never;

const testSuite2 = [
	expected<never>().toEqualTypeOf<OnlyLastElement<[]>>(),
	expected<"a">().toEqualTypeOf<OnlyLastElement<["a"]>>(),
	expected<"b">().toEqualTypeOf<OnlyLastElement<["a", "b"]>>(),
	expected<"e">().toEqualTypeOf<OnlyLastElement<["a", "b", "c", "d", "e"]>>(),
];

type JoinStrings<SArr extends string[], Separator extends string, _Acc extends string = ""> =
	SArr extends [infer F extends string, ...infer R extends string[]] ?
		JoinStrings<R, Separator, $String.Join<_Acc, Separator, F>>
	:	_Acc;

type LL = JoinStrings<["a", "b", "c"], ".">;
//   ^?

const testSuite3 = [
	expected<"">().toEqualTypeOf<JoinStrings<[""], ".">>(),
	expected<"">().toEqualTypeOf<JoinStrings<["", ""], ".">>(),
	expected<"">().toEqualTypeOf<JoinStrings<["", "", ""], ".">>(),
	expected<"a">().toEqualTypeOf<JoinStrings<["a", ""], ".">>(),
	expected<"b">().toEqualTypeOf<JoinStrings<["", "b"], ".">>(),
	expected<"a.b">().toEqualTypeOf<JoinStrings<["a", "b"], ".">>(),
	expected<"a.b.c.d">().toEqualTypeOf<JoinStrings<["a", "b", "c", "d"], ".">>(),
	expected<"a">().toEqualTypeOf<JoinStrings<["a"], ".">>(),
	expected<"">().toEqualTypeOf<JoinStrings<[""], ".">>(),
];
