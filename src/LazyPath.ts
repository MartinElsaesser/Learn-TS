import { expectTypeOf } from "expect-type";

namespace $String {
	export type Concat<S1 extends string, S2 extends string, Separator extends string> =
		S1 extends "" ?
			S2 extends "" ?
				""
			:	S2
		: S2 extends "" ? S1
		: `${S1}${Separator}${S2}`;

	export type Split<S extends string, Separator extends string> =
		S extends `${infer Prev}${Separator}${infer Rest}` ? [Prev, ...Split<Rest, Separator>]
		: S extends "" ? []
		: [S];
	export type GetLastChar<T extends string> =
		T extends `${infer F}${infer R}` ?
			R extends "" ?
				F
			:	GetLastChar<R>
		:	never;
	export type EndsOn<S extends string, LastChar extends string> =
		[GetLastChar<S>, LastChar] extends [LastChar, GetLastChar<S>] ? true : false;

	expectTypeOf<"">().toEqualTypeOf<Concat<"", "", ".">>();
	expectTypeOf<"a">().toEqualTypeOf<Concat<"a", "", ".">>();
	expectTypeOf<"b">().toEqualTypeOf<Concat<"", "b", ".">>();
	expectTypeOf<"a.b">().toEqualTypeOf<Concat<"a", "b", ".">>();

	expectTypeOf<[]>().toEqualTypeOf<Split<"", ".">>();
	expectTypeOf<["a"]>().toEqualTypeOf<Split<"a", ".">>();
	expectTypeOf<["a", "b"]>().toEqualTypeOf<Split<"a.b", ".">>();
	expectTypeOf<["a", "b", "c"]>().toEqualTypeOf<Split<"a.b.c", ".">>();
	expectTypeOf<["a"]>().toEqualTypeOf<Split<"a.", ".">>();
	expectTypeOf<["a", "b"]>().toEqualTypeOf<Split<"a.b.", ".">>();

	expectTypeOf<false>().toEqualTypeOf<EndsOn<"abc", "a">>();
	expectTypeOf<true>().toEqualTypeOf<EndsOn<"a", "a">>();
	expectTypeOf<true>().toEqualTypeOf<EndsOn<"abc", "c">>();
	expectTypeOf<false>().toEqualTypeOf<EndsOn<"", "c">>();
	expectTypeOf<true>().toEqualTypeOf<EndsOn<"children.0.", ".">>();
}

namespace $Array {
	export type AllButLastElement<T extends readonly unknown[]> =
		T extends [infer F, ...infer R] ?
			R extends [] ?
				[]
			:	[F, ...AllButLastElement<R>]
		:	[];

	type LastElement<T extends readonly unknown[]> =
		T extends [infer F, ...infer R] ?
			R extends [] ?
				F
			:	LastElement<R>
		:	never;

	// test AllButLastElement
	expectTypeOf<[]>().toEqualTypeOf<AllButLastElement<[]>>();
	expectTypeOf<[]>().toEqualTypeOf<AllButLastElement<["a"]>>();
	expectTypeOf<["a"]>().toEqualTypeOf<AllButLastElement<["a", "b"]>>();

	// test LastElement
	expectTypeOf<never>().toEqualTypeOf<LastElement<[]>>();
	expectTypeOf<"a">().toEqualTypeOf<LastElement<["a"]>>();
	expectTypeOf<"b">().toEqualTypeOf<LastElement<["a", "b"]>>();
	expectTypeOf<"c">().toEqualTypeOf<LastElement<["a", "b", "c"]>>();
}

namespace $Object {
	type ObjectValueByProperties<Obj, Properties extends Property[]> =
		Properties extends [infer F, ...infer R extends Property[]] ?
			F extends keyof Obj ?
				ObjectValueByProperties<Obj[F], R>
			:	never
		:	ReturnIfIsObject<Obj>;

	type ValueByProperties<Obj, Properties extends string[]> =
		Properties extends [infer F, ...infer R extends string[]] ?
			F extends keyof Obj ?
				ValueByProperties<Obj[F], R>
			:	F
		:	Obj;
}

type Property = string | number;
type JoinProperties<Properties extends Property[]> =
	Properties extends [infer F extends Property, ...infer R extends Property[]] ?
		$String.Concat<`${F}`, JoinProperties<R>, ".">
	:	"";

type ReturnIfIsObject<T> = T extends object ? T : never;

type Person = typeof person;

type Cast<T, U> = T extends U ? T : U;

type IntersectionMerge<T, Intersection, Condition extends boolean> =
	Condition extends true ? T | Intersection : Intersection;

type IsValidNumeric<String> =
	String extends `${number}` ? true
	: String extends number ? true
	: String extends "" ? true
	: false;
type LazyPropertyPath<
	Obj,
	Path extends string,
	Properties extends string[] = SplitString<Path, ".">,
	LastProperty extends string = LastArrayElement<Properties>,
	AllButLastProperties extends string[] = AllButLastArrayElement<Properties>,
	SubObj = GetObjectFromProperties<Obj, AllButLastProperties>,
	PathEndsOnDot extends boolean = EndsOn<Path, ".">,
> =
	[SubObj] extends [never] ? "Access error: cannot access this path"
	: SubObj extends readonly any[] ?
		LastProperty extends `${number}` ?
			IntersectionMerge<
				Path,
				JoinProperties<[...AllButLastProperties, number]>,
				PathEndsOnDot
			>
		: LastProperty extends "" ? "Input a number"
		: "Index error: tried to index an array element through a string"
	:	IntersectionMerge<
			Path,
			JoinProperties<[...AllButLastProperties, Cast<keyof SubObj, string>]>,
			PathEndsOnDot
		>;

type DebugLazyPropertyPath<
	Obj,
	Path extends string,
	Properties extends string[] = SplitString<Path, ".">,
	LastProperty extends string = LastArrayElement<Properties>,
	AllButLastProperties extends string[] = AllButLastArrayElement<Properties>,
	SubObj = GetObjectFromProperties<Obj, AllButLastProperties>,
	PathEndsOnDot extends boolean = EndsOn<Path, ".">,
	IsNum extends boolean = IsValidNumeric<LastProperty>,
> = {
	Properties: Properties;
	LastProperty: LastProperty;
	AllButLastProperties: AllButLastProperties;
	SubObj: SubObj;
	PathEndsOnDot: PathEndsOnDot;
	IsNum: IsNum;
};
/*   DEBUGGING   */

type path = "roles.";
type _0 = LazyPropertyPath<Person, path>;
type _1 = DebugLazyPropertyPath<Person, path>;

/*   IMPLEMENTATION   */

const person = {
	favoritePet: {
		petName: "Fido",
		petAge: 4,
	},
	roles: ["admin", "user"],
	children: [
		{ childName: "Alice", childAge: 5 },
		{ childName: "Marco", childAge: 10 },
	],
	favoriteColor: "green",
	age: 30,
} as const;

type lel = keyof typeof person;

declare function get<
	Path extends string,
	Obj,
	Properties extends string[] = SplitString<Path, ".">,
>(obj: Obj, Path: LazyPropertyPath<Obj, Path>): GetFromProperties<Obj, Properties>;

const test2 = get(person, "favoritePet.petAge");

/*   TESTS   */
// test ConcatStrings

// test IsNumeric
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"0">>();
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"1">>();
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"1000">>();
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"-2">>();
expectTypeOf<false>().toEqualTypeOf<IsValidNumeric<"a">>();
expectTypeOf<false>().toEqualTypeOf<IsValidNumeric<"pet">>();

// test JoinProperties
expectTypeOf<"">().toEqualTypeOf<JoinProperties<[""]>>();
expectTypeOf<"a">().toEqualTypeOf<JoinProperties<["a"]>>();
expectTypeOf<"a.b">().toEqualTypeOf<JoinProperties<["a", "b"]>>();
expectTypeOf<"a.b.c">().toEqualTypeOf<JoinProperties<["a", "b", "c"]>>();
expectTypeOf<`a.${number}.c`>().toEqualTypeOf<JoinProperties<["a", number, "c"]>>();

// test ResolveIndexable
expectTypeOf<Person>().toEqualTypeOf<GetObjectFromProperties<Person, []>>();
expectTypeOf<Person["roles"]>().toEqualTypeOf<GetObjectFromProperties<Person, ["roles"]>>();
expectTypeOf<Person["children"]["0"]>().toEqualTypeOf<
	GetObjectFromProperties<Person, ["children", "0"]>
>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
	GetObjectFromProperties<Person, ["children", number]>
>();
expectTypeOf<never>().toEqualTypeOf<
	GetObjectFromProperties<Person, ["children", "0", "childName"]>
>();

expectTypeOf<never>().toEqualTypeOf<
	GetObjectFromProperties<Person, ["children", "0", "childName", "doesNotExist"]>
>();
expectTypeOf<never>().toEqualTypeOf<
	GetObjectFromProperties<Person, ["children", number, "childName", "doesNotExist"]>
>();

// test LazyPropertyPath
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPropertyPath<Person, "">
>();
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPropertyPath<Person, "roles">
>();
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPropertyPath<Person, "ro">
>();
expectTypeOf<"Input a number">().toEqualTypeOf<LazyPropertyPath<Person, "roles.">>();
expectTypeOf<`roles.${number}`>().toEqualTypeOf<LazyPropertyPath<Person, "roles.0">>();
expectTypeOf<`Index error: tried to index an array element through a string`>().toEqualTypeOf<
	LazyPropertyPath<Person, "roles.a">
>();
expectTypeOf<"Access error: cannot access this path">().toEqualTypeOf<
	LazyPropertyPath<Person, "roles.0.">
>();
expectTypeOf<`children.${number}`>().toEqualTypeOf<LazyPropertyPath<Person, "children.0">>();
expectTypeOf<`children.0.childName` | `children.0.childAge` | "children.0.">().toEqualTypeOf<
	LazyPropertyPath<Person, "children.0.">
>();
expectTypeOf<`children.0.childName` | `children.0.childAge`>().toEqualTypeOf<
	LazyPropertyPath<Person, "children.0.childName">
>();
expectTypeOf<"Access error: cannot access this path">().toEqualTypeOf<
	LazyPropertyPath<Person, "children.0.childName.">
>();

// test ParsePropertyPath

// test ParsePropertyPath
expectTypeOf<[]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"a", ".">>>();
expectTypeOf<[]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"a.", ".">>>();
expectTypeOf<["a"]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"a.b", ".">>>();
expectTypeOf<["a"]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"a.b.", ".">>>();
expectTypeOf<["a", "b"]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"a.b.c", ".">>>();

// test GetFromProperties
expectTypeOf<Person["roles"]>().toEqualTypeOf<
	GetFromProperties<Person, SplitString<"roles", ".">>
>();
expectTypeOf<["roles"]>().toEqualTypeOf<GetFromProperties<Person, SplitString<"roles.", ".">>>();
expectTypeOf<["roles", "0"]>().toEqualTypeOf<
	GetFromProperties<Person, SplitString<"roles.0", ".">>
>();
expectTypeOf<["children", "0"]>().toEqualTypeOf<
	GetFromProperties<Person, SplitString<"children.0.childName", ".">>
>();
