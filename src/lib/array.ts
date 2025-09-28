import { expectTypeOf as expected } from "expect-type";
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
	expected<"c">().toEqualTypeOf<OnlyLastElement<["a", "b", "c"]>>(),
];
