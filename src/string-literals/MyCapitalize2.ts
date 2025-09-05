import { expectTypeOf } from "expect-type";
type MyCapitalize2<T extends string, TLast extends string = ""> =
	T extends `${infer First}${infer Rest}` ?
		TLast extends "" ? `${Uppercase<First>}${MyCapitalize2<Rest, First>}`
		: TLast extends " " ? `${Uppercase<First>}${MyCapitalize2<Rest, First>}`
		: `${First}${MyCapitalize2<Rest, First>}`
	:	"";

type capitalized = MyCapitalize2<"lorem, ipsum. dolor sit  amet.">;

expectTypeOf<"A">().toEqualTypeOf<MyCapitalize2<"a">>();
expectTypeOf<"Be">().toEqualTypeOf<MyCapitalize2<"be">>();
expectTypeOf<"Three">().toEqualTypeOf<MyCapitalize2<"three">>();
expectTypeOf<" Space">().toEqualTypeOf<MyCapitalize2<" space">>();
expectTypeOf<"   Spaces ">().toEqualTypeOf<MyCapitalize2<"   spaces ">>();
expectTypeOf<"Lorem, Ipsum. Dolor  Sit Amet.">().toEqualTypeOf<
	MyCapitalize2<"lorem, ipsum. dolor  sit amet.">
>();
expectTypeOf<"">().toEqualTypeOf<MyCapitalize<"">>();
