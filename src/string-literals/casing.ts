import { expectTypeOf } from "expect-type";
type CapitalizeRest<T extends string> =
	T extends `${infer First}${infer Second}${infer Rest}` ?
		First extends " " ?
			`${First}${Uppercase<Second>}${CapitalizeRest<Rest>}`
		:	`${First}${CapitalizeRest<`${Second}${Rest}`>}`
	: T extends `${infer First}${infer Rest}` ? First
	: "";

type MyCapitalize<T extends string> =
	T extends `${infer First}${infer Rest}` ?
		First extends " " ?
			`${CapitalizeRest<T>}`
		:	`${Capitalize<First>}${CapitalizeRest<Rest>}`
	:	"";

type capitalized = MyCapitalize<"   spaces ">;

expectTypeOf<"A">().toEqualTypeOf<MyCapitalize<"a">>();
expectTypeOf<"Be">().toEqualTypeOf<MyCapitalize<"be">>();
expectTypeOf<"Three">().toEqualTypeOf<MyCapitalize<"three">>();
expectTypeOf<" Space">().toEqualTypeOf<MyCapitalize<" space">>();
expectTypeOf<"   Spaces ">().toEqualTypeOf<MyCapitalize<"   spaces ">>();
expectTypeOf<"Lorem, Ipsum. Dolor Sit Amet.">().toEqualTypeOf<
	MyCapitalize<"lorem, ipsum. dolor sit amet.">
>();
expectTypeOf<"">().toEqualTypeOf<MyCapitalize<"">>();
