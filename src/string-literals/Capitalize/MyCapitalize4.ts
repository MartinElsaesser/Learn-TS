import { expectTypeOf } from "expect-type";
type CapitalizeWords<T extends string> =
	T extends `${infer First} ${infer Rest}` ? `${Capitalize<First>} ${CapitalizeWords<Rest>}`
	:	Capitalize<T>;
type capitalized = CapitalizeWords<"lorem, ipsum. dolor sit  a">;

expectTypeOf<"A">().toEqualTypeOf<CapitalizeWords<"a">>();
expectTypeOf<"A B">().toEqualTypeOf<CapitalizeWords<"a b">>();
expectTypeOf<" A B">().toEqualTypeOf<CapitalizeWords<" a b">>();
expectTypeOf<"Be">().toEqualTypeOf<CapitalizeWords<"be">>();
expectTypeOf<"Three">().toEqualTypeOf<CapitalizeWords<"three">>();
expectTypeOf<" Space">().toEqualTypeOf<CapitalizeWords<" space">>();
expectTypeOf<"   Spaces ">().toEqualTypeOf<CapitalizeWords<"   spaces ">>();
expectTypeOf<"Lorem, Ipsum. Dolor  Sit Amet.">().toEqualTypeOf<
	CapitalizeWords<"lorem, ipsum. dolor  sit amet.">
>();
expectTypeOf<"">().toEqualTypeOf<CapitalizeWords<"">>();

type a = Promise<string>;
