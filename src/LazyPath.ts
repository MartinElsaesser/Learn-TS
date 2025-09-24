import { expectTypeOf } from "expect-type";

type ConcatStrings<S1 extends string, S2 extends string, Separator extends string> =
	S1 extends "" ?
		S2 extends "" ?
			""
		:	S2
	: S2 extends "" ? S1
	: `${S1}${Separator}${S2}`;

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

type Person = {
	favoritePet: {
		petName: "Fido";
		petAge: 4;
	};
	roles: ["admin", "user"];
	children: [{ childName: "Alice"; childAge: 5 }, { childName: "Marco"; childAge: 10 }];
	favoriteColor: "green";
	age: 30;
};

type ParsePropertyPath<S extends string> =
	S extends `${infer Prev}.${infer Rest}` ? [Prev, ...ParsePropertyPath<Rest>] : [];
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
	Properties extends Property[] = ParsePropertyPath<Path>,
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
	Properties extends Property[] = ParsePropertyPath<Path>,
	ResolvedObj = GetObjectFromProperties<Obj, Properties>,
	PathEndsOnDot extends boolean = EndsOn<Path, ".">,
> = {
	Properties: Properties;
	ResolvedObj: ResolvedObj;
	Return: LazyPropertyPath<Obj, Path>;
	PathEndsOnDot: PathEndsOnDot;
	Condition: EndsOn<Path, ".">;
};
/*   DEBUGGING   */

type path = "roles.a";
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

declare function get<path extends string, Obj>(
	obj: Obj,
	path: LazyPropertyPath<Obj, path>
): LazyPropertyPath<Obj, path>;

const test2 = get(person, "roles.0.");

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

// test ParsePropertyPath
expectTypeOf<[]>().toEqualTypeOf<ParsePropertyPath<"roles">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.0">>();
expectTypeOf<["children", "0"]>().toEqualTypeOf<ParsePropertyPath<"children.0.childName">>();
