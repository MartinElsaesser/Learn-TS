import { expectTypeOf } from "expect-type";

export type Join2Strings<Str1 extends string, Str2 extends string, TJoinChar extends string = "."> =
	Str1 extends "" ?
		Str2 extends "" ?
			// Str1 == "" && Str2 == "" -> ""
			""
		:	// Str1 == "" && Str2 != "" -> Str2
			Str2
	: Str2 extends "" ?
		// Str1 != "" && Str2 == ""   -> Str1
		Str1
	:	// Str1 != "" && Str2 != ""   -> Str1 + TJoinChar + Str2
		`${Str1}${TJoinChar}${Str2}`;

expectTypeOf<Join2Strings<"", "", ".">>().toEqualTypeOf<"">();
expectTypeOf<Join2Strings<"a", "", ".">>().toEqualTypeOf<"a">();
expectTypeOf<Join2Strings<"", "b", ".">>().toEqualTypeOf<"b">();
expectTypeOf<Join2Strings<"a", "b", ".">>().toEqualTypeOf<"a.b">();

export type JoinStrings<TStrings extends string[], TJoinChar extends string = "."> =
	TStrings extends [infer First extends string, ...infer Rest extends string[]] ?
		// TStrings is not empty
		Join2Strings<First, JoinStrings<Rest, TJoinChar>, TJoinChar>
	:	// TStrings is empty
		"";

expectTypeOf<JoinStrings<["a", "b"], ".">>().toEqualTypeOf<"a.b">();
expectTypeOf<JoinStrings<["a"], ".">>().toEqualTypeOf<"a">();
expectTypeOf<JoinStrings<["a", "b", "c"], ".">>().toEqualTypeOf<"a.b.c">();
expectTypeOf<JoinStrings<["a", "", "c"], ".">>().toEqualTypeOf<"a.c">();
expectTypeOf<JoinStrings<["", "b", "c"], ".">>().toEqualTypeOf<"b.c">();
expectTypeOf<JoinStrings<["a", "b", ""], ".">>().toEqualTypeOf<"a.b">();
expectTypeOf<JoinStrings<["a", "b", "c"], "_">>().toEqualTypeOf<"a_b_c">();
