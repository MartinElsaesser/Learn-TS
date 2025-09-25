import { expectTypeOf } from "expect-type";

type ConcatStrings<S1 extends string, S2 extends string, Separator extends string> =
	S1 extends "" ?
		S2 extends "" ?
			""
		:	S2
	: S2 extends "" ? S1
	: `${S1}${Separator}${S2}`;
type SplitString<S extends string, Separator extends string> =
	S extends `${infer Prev}${Separator}${infer Rest}` ? [Prev, ...SplitString<Rest, Separator>]
	:	[S];

type AllButLastArrayElement<T extends readonly unknown[]> =
	T extends [infer F, ...infer R] ?
		R extends [] ?
			[]
		:	[F, ...AllButLastArrayElement<R>]
	:	[];

type LastArrayElement<T extends readonly unknown[]> =
	T extends [infer F, ...infer R] ?
		R extends [] ?
			F
		:	LastArrayElement<R>
	:	never;

type Property = string | number;
type JoinProperties<Properties extends Property[]> =
	Properties extends [infer F extends Property, ...infer R extends Property[]] ?
		ConcatStrings<`${F}`, JoinProperties<R>, ".">
	:	"";

type ReturnIfIsObject<T> = T extends object ? T : never;

type GetObjectFromProperties<Obj, Properties extends Property[]> =
	Properties extends [infer F, ...infer R extends Property[]] ?
		F extends keyof Obj ?
			GetObjectFromProperties<Obj[F], R>
		:	never
	:	ReturnIfIsObject<Obj>;
type GetLastChar<T extends string> =
	T extends `${infer F}${infer R}` ?
		R extends "" ?
			F
		:	GetLastChar<R>
	:	never;
type EndsOn<S extends string, LastChar extends string> =
	[GetLastChar<S>, LastChar] extends [LastChar, GetLastChar<S>] ? true : false;

type Person = typeof person;

type LastPropertyPath<S extends string> =
	S extends `${infer Prev}.${infer Rest}` ? LastPropertyPath<Rest> : S;
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
	Properties extends Property[] = SplitString<Path, ".">,
	AllButLastProperties extends Property[] = AllButLastArrayElement<Properties>,
	LastProperty extends Property = LastArrayElement<Properties>,
	ResolvedObj = GetObjectFromProperties<Obj, Properties>,
	PathEndsOnDot extends boolean = EndsOn<Path, ".">,
	IsNum extends boolean = IsValidNumeric<Cast<LastPropertyPath<Path>, string>>,
> =
	[ResolvedObj] extends [never] ? "Access error: cannot access this path"
	: ResolvedObj extends readonly any[] ?
		IsNum extends true ?
			IntersectionMerge<Path, JoinProperties<[...Properties, number]>, PathEndsOnDot>
		:	"Index error: tried to index an array element through a string"
	:	IntersectionMerge<
			Path,
			JoinProperties<[...Properties, Cast<keyof ResolvedObj, string>]>,
			PathEndsOnDot
		>;

type DebugLazyPropertyPath<
	Obj,
	Path extends string,
	Properties extends Property[] = SplitString<Path, ".">,
	AllButLastProperties extends Property[] = AllButLastArrayElement<Properties>,
	ResolvedObj = GetObjectFromProperties<Obj, Properties>,
	PathEndsOnDot extends boolean = EndsOn<Path, ".">,
	IsNum extends boolean = IsValidNumeric<Cast<LastPropertyPath<Path>, string>>,
> = {
	Properties: Properties;
	ResolvedObj: ResolvedObj;
	Return: LazyPropertyPath<Obj, Path>;
	PathEndsOnDot: PathEndsOnDot;
	Condition: EndsOn<Path, ".">;
	AllButLastProperties: AllButLastProperties;
};
/*   DEBUGGING   */

type path = "roles.0";
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

declare function get<path extends string, Obj>(obj: Obj, path: LazyPropertyPath<Obj, path>): any;

const test2 = get(person, "age");

/*   TESTS   */
// test ConcatStrings
expectTypeOf<"">().toEqualTypeOf<ConcatStrings<"", "", ".">>();
expectTypeOf<"a">().toEqualTypeOf<ConcatStrings<"a", "", ".">>();
expectTypeOf<"b">().toEqualTypeOf<ConcatStrings<"", "b", ".">>();
expectTypeOf<"a.b">().toEqualTypeOf<ConcatStrings<"a", "b", ".">>();

// test IsNumeric
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"0">>();
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"1">>();
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"1000">>();
expectTypeOf<true>().toEqualTypeOf<IsValidNumeric<"-2">>();
expectTypeOf<false>().toEqualTypeOf<IsValidNumeric<"a">>();
expectTypeOf<false>().toEqualTypeOf<IsValidNumeric<"pet">>();

// test LastPropertyPath
expectTypeOf<"0">().toEqualTypeOf<LastPropertyPath<"0">>();
expectTypeOf<"b">().toEqualTypeOf<LastPropertyPath<"a.b">>();
expectTypeOf<"c">().toEqualTypeOf<LastPropertyPath<"a.b.c">>();

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

// test EndsOn
expectTypeOf<false>().toEqualTypeOf<EndsOn<"abc", "a">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"a", "a">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"abc", "c">>();
expectTypeOf<false>().toEqualTypeOf<EndsOn<"", "c">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"children.0.", ".">>();

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
expectTypeOf<`roles.${number}` | "roles.">().toEqualTypeOf<LazyPropertyPath<Person, "roles.">>();
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

// test AllButLastArrayElement
expectTypeOf<[]>().toEqualTypeOf<AllButLastArrayElement<[]>>();
expectTypeOf<[]>().toEqualTypeOf<AllButLastArrayElement<["a"]>>();
expectTypeOf<["a"]>().toEqualTypeOf<AllButLastArrayElement<["a", "b"]>>();

// test LastArrayElement
expectTypeOf<never>().toEqualTypeOf<LastArrayElement<[]>>();
expectTypeOf<"a">().toEqualTypeOf<LastArrayElement<["a"]>>();
expectTypeOf<"b">().toEqualTypeOf<LastArrayElement<["a", "b"]>>();
expectTypeOf<"c">().toEqualTypeOf<LastArrayElement<["a", "b", "c"]>>();

// test ParsePropertyPath
expectTypeOf<[]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"roles", ".">>>();
expectTypeOf<["roles"]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"roles.", ".">>>();
expectTypeOf<["roles"]>().toEqualTypeOf<AllButLastArrayElement<SplitString<"roles.0", ".">>>();
expectTypeOf<["children", "0"]>().toEqualTypeOf<
	AllButLastArrayElement<SplitString<"children.0.childName", ".">>
>();
