import { expectTypeOf } from "expect-type";
type CapitalizeMiddle<Word extends string> =
	Word extends `${infer First} ${infer Middle}` ?
		`${First} ${CapitalizeMiddle<Capitalize<Middle>>}`
	:	Word;
type MyCapitalize3<T extends string> = CapitalizeMiddle<Capitalize<T>>;
type capitalized = Capitalize<MyCapitalize3<"lorem, ipsum. dolor sit  a">>;

expectTypeOf<"A">().toEqualTypeOf<MyCapitalize3<"a">>();
expectTypeOf<"A B">().toEqualTypeOf<MyCapitalize3<"a b">>();
expectTypeOf<" A B">().toEqualTypeOf<MyCapitalize3<" a b">>();
expectTypeOf<"Be">().toEqualTypeOf<MyCapitalize3<"be">>();
expectTypeOf<"Three">().toEqualTypeOf<MyCapitalize3<"three">>();
expectTypeOf<" Space">().toEqualTypeOf<MyCapitalize3<" space">>();
expectTypeOf<"   Spaces ">().toEqualTypeOf<MyCapitalize3<"   spaces ">>();
expectTypeOf<"Lorem, Ipsum. Dolor  Sit Amet.">().toEqualTypeOf<
	MyCapitalize3<"lorem, ipsum. dolor  sit amet.">
>();
expectTypeOf<"">().toEqualTypeOf<MyCapitalize3<"">>();
