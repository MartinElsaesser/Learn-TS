import { expectTypeOf } from "expect-type";
type MyCapitalize4<T extends string> =
	T extends `${infer First} ${infer Rest}` ? `${Capitalize<First>} ${MyCapitalize4<Rest>}`
	:	Capitalize<T>;
type capitalized = MyCapitalize4<"lorem, ipsum. dolor sit  a">;

expectTypeOf<"A">().toEqualTypeOf<MyCapitalize4<"a">>();
expectTypeOf<"A B">().toEqualTypeOf<MyCapitalize4<"a b">>();
expectTypeOf<" A B">().toEqualTypeOf<MyCapitalize4<" a b">>();
expectTypeOf<"Be">().toEqualTypeOf<MyCapitalize4<"be">>();
expectTypeOf<"Three">().toEqualTypeOf<MyCapitalize4<"three">>();
expectTypeOf<" Space">().toEqualTypeOf<MyCapitalize4<" space">>();
expectTypeOf<"   Spaces ">().toEqualTypeOf<MyCapitalize4<"   spaces ">>();
expectTypeOf<"Lorem, Ipsum. Dolor  Sit Amet.">().toEqualTypeOf<
	MyCapitalize4<"lorem, ipsum. dolor  sit amet.">
>();
expectTypeOf<"">().toEqualTypeOf<MyCapitalize4<"">>();
