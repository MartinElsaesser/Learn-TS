import { expectTypeOf as expected } from "expect-type";

namespace $String {
	export type Join<S1 extends string, Separator extends string, S2 extends string> =
		S1 extends "" ?
			S2 extends "" ?
				""
			:	S2
		: S2 extends "" ? S1
		: `${S1}${Separator}${S2}`;

	[
		expected<"">().toEqualTypeOf<Join<"", ".", "">>(),
		expected<"a">().toEqualTypeOf<Join<"a", ".", "">>(),
		expected<"b">().toEqualTypeOf<Join<"", ".", "b">>(),
		expected<"a.b">().toEqualTypeOf<Join<"a", ".", "b">>(),
	];

	type TupleWithoutEmptyString<S extends string> = S extends "" ? [] : [S];
	export type Split<S extends string, Separator extends string> =
		S extends `${infer Prev}${Separator}${infer Rest}` ? [Prev, ...Split<Rest, Separator>]
		:	[S];
	[
		expected<[""]>().toEqualTypeOf<Split<"", ".">>(),
		expected<["a"]>().toEqualTypeOf<Split<"a", ".">>(),
		expected<["a", "b", "c"]>().toEqualTypeOf<Split<"a.b.c", ".">>(),

		expected<["a", ""]>().toEqualTypeOf<Split<"a.", ".">>(),
		expected<["a", "b", "c", ""]>().toEqualTypeOf<Split<"a.b.c.", ".">>(),
		expected<["", "b"]>().toEqualTypeOf<Split<".b", ".">>(),
		expected<["", "", ""]>().toEqualTypeOf<Split<"..", ".">>(),
	];

	export type SplitExceptTrailingEmpty<S extends string, Separator extends string> =
		S extends `${infer Prev}${Separator}${infer Rest}` ?
			[Prev, ...SplitExceptTrailingEmpty<Rest, Separator>]
		:	TupleWithoutEmptyString<S>;
	[
		expected<[]>().toEqualTypeOf<SplitExceptTrailingEmpty<"", ".">>(),
		expected<["a"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a", ".">>(),
		expected<["a", "b", "c"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a.b.c", ".">>(),

		expected<["a"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a.", ".">>(),
		expected<["a", "b", "c"]>().toEqualTypeOf<SplitExceptTrailingEmpty<"a.b.c.", ".">>(),
		expected<["", "b"]>().toEqualTypeOf<SplitExceptTrailingEmpty<".b", ".">>(),
		expected<["", ""]>().toEqualTypeOf<SplitExceptTrailingEmpty<"..", ".">>(),
	];

	export type SplitWithoutEmpty<S extends string, Separator extends string> =
		S extends `${infer Prev}${Separator}${infer Rest}` ?
			[...TupleWithoutEmptyString<Prev>, ...SplitWithoutEmpty<Rest, Separator>]
		:	TupleWithoutEmptyString<S>;

	[
		expected<[]>().toEqualTypeOf<SplitWithoutEmpty<"", ".">>(),
		expected<["a"]>().toEqualTypeOf<SplitWithoutEmpty<"a", ".">>(),
		expected<["a", "b", "c"]>().toEqualTypeOf<SplitWithoutEmpty<"a.b.c", ".">>(),

		expected<["a"]>().toEqualTypeOf<SplitWithoutEmpty<"a.", ".">>(),
		expected<["a", "b", "c"]>().toEqualTypeOf<SplitWithoutEmpty<"a.b.c.", ".">>(),
		expected<["b"]>().toEqualTypeOf<SplitWithoutEmpty<".b", ".">>(),
		expected<[]>().toEqualTypeOf<SplitWithoutEmpty<"..", ".">>(),
	];

	export type GetLastChar<T extends string> =
		T extends `${infer F}${infer R}` ?
			R extends "" ?
				F
			:	GetLastChar<R>
		:	never;
	[
		expected<never>().toEqualTypeOf<GetLastChar<"">>(),
		expected<"a">().toEqualTypeOf<GetLastChar<"a">>(),
		expected<"b">().toEqualTypeOf<GetLastChar<"ab">>(),
		expected<"z">().toEqualTypeOf<GetLastChar<"abcdefghijklmnopqrstuvwxyz">>(),
	];

	export type EmptyToNever<S extends string> = S extends "" ? never : S;
	export type EndsOn<S extends string, LastChar extends string> =
		[GetLastChar<S>, EmptyToNever<LastChar>] extends [EmptyToNever<LastChar>, GetLastChar<S>] ?
			true
		:	false;

	[
		expected<true>().toEqualTypeOf<EndsOn<"", "">>(),
		expected<true>().toEqualTypeOf<EndsOn<"a", "a">>(),
		expected<true>().toEqualTypeOf<EndsOn<"ab", "b">>(),
		expected<true>().toEqualTypeOf<EndsOn<"abcdefghijklmnopqrstuvwxyz", "z">>(),
		expected<false>().toEqualTypeOf<EndsOn<"", "a">>(),
		expected<false>().toEqualTypeOf<EndsOn<"abcdefghijklmnopqrstuvwxyz", "">>(),
		expected<false>().toEqualTypeOf<EndsOn<"abcdefghijklmnopqrstuvwxyz", "b">>(),
	];
}

namespace $Array {
	export type ExcludeLastElement<T extends readonly unknown[]> =
		T extends [infer F, ...infer R] ?
			R extends [] ?
				[]
			:	[F, ...ExcludeLastElement<R>]
		:	[];

	[
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

	[
		expected<never>().toEqualTypeOf<OnlyLastElement<[]>>(),
		expected<"a">().toEqualTypeOf<OnlyLastElement<["a"]>>(),
		expected<"b">().toEqualTypeOf<OnlyLastElement<["a", "b"]>>(),
		expected<"c">().toEqualTypeOf<OnlyLastElement<["a", "b", "c"]>>(),
	];
}

namespace $Object {
	const testPerson = {
		pet: {
			name: "Fido",
			age: 4,
		},
		roles: ["admin", "user"],
		children: [
			{ name: "Alice", age: 5 },
			{ name: "Marco", age: 10 },
		],
		age: 30,
	} as const;
	type TestPerson = typeof testPerson;
	export type PropertyPathLookupOnlyObjects<Obj, Properties extends PropertyKey[]> =
		Properties extends [infer F, ...infer R extends PropertyKey[]] ?
			F extends keyof Obj ?
				PropertyPathLookupOnlyObjects<Obj[F], R>
			:	never
		:	ReturnIfIsObject<Obj>;
	const testSuite1 = [
		expected<TestPerson>().toEqualTypeOf<PropertyPathLookupOnlyObjects<TestPerson, []>>(),
		expected<TestPerson["roles"]>().toEqualTypeOf<
			PropertyPathLookupOnlyObjects<TestPerson, ["roles"]>
		>(),
		expected<TestPerson["children"]["0"]>().toEqualTypeOf<
			PropertyPathLookupOnlyObjects<TestPerson, ["children", "0"]>
		>(),
		expected<TestPerson["children"][number]>().toEqualTypeOf<
			PropertyPathLookupOnlyObjects<TestPerson, ["children", number]>
		>(),
		// path lookup failed
		expected<never>().toEqualTypeOf<
			PropertyPathLookupOnlyObjects<TestPerson, ["children", "0", "name"]>
		>(),
		expected<never>().toEqualTypeOf<
			PropertyPathLookupOnlyObjects<TestPerson, ["doesNotExist"]>
		>(),
	];

	export type PropertyPathLookup<Obj, Properties extends PropertyKey[]> =
		Properties extends [infer F, ...infer R extends PropertyKey[]] ?
			F extends keyof Obj ?
				PropertyPathLookup<Obj[F], R>
			:	never
		:	Obj;

	const testSuite2 = [
		expected<TestPerson>().toEqualTypeOf<PropertyPathLookup<TestPerson, []>>(),
		expected<TestPerson["roles"]>().toEqualTypeOf<PropertyPathLookup<TestPerson, ["roles"]>>(),
		expected<TestPerson["children"]["0"]>().toEqualTypeOf<
			PropertyPathLookup<TestPerson, ["children", "0"]>
		>(),
		expected<TestPerson["children"][number]>().toEqualTypeOf<
			PropertyPathLookup<TestPerson, ["children", number]>
		>(),
		expected<TestPerson["children"]["0"]["name"]>().toEqualTypeOf<
			PropertyPathLookup<TestPerson, ["children", "0", "name"]>
		>(),
		expected<TestPerson["pet"]["name"]>().toEqualTypeOf<
			PropertyPathLookup<TestPerson, ["pet", "name"]>
		>(),
		// path lookup failed
		expected<never>().toEqualTypeOf<PropertyPathLookup<TestPerson, ["doesNotExist"]>>(),
	];
}

type JoinProperties<Properties extends PropertyKey[]> =
	Properties extends [infer F extends PropertyKey, ...infer R extends PropertyKey[]] ?
		$String.Join<F, ".", JoinProperties<R>>
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
	Properties extends string[] = $String.Split<Path, ".">,
	LastProperty extends string = $Array.OnlyLastElement<Properties>,
	AllButLastProperties extends string[] = $Array.ExcludeLastElement<Properties>,
	SubObj = $Object.PropertyPathLookupOnlyObjects<Obj, AllButLastProperties>,
	PathEndsOnDot extends boolean = $String.EndsOn<Path, ".">,
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
	:	JoinProperties<[...AllButLastProperties, Cast<keyof SubObj, string>]>;

type DebugLazyPropertyPath<
	Obj,
	Path extends string,
	Properties extends string[] = $String.Split<Path, ".">,
	LastProperty extends string = $Array.OnlyLastElement<Properties>,
	AllButLastProperties extends string[] = $Array.ExcludeLastElement<Properties>,
	SubObj = $Object.PropertyPathLookupOnlyObjects<Obj, AllButLastProperties>,
	PathEndsOnDot extends boolean = $String.EndsOn<Path, ".">,
> = {
	Properties: Properties;
	LastProperty: LastProperty;
	AllButLastProperties: AllButLastProperties;
	SubObj: SubObj;
	PathEndsOnDot: PathEndsOnDot;
};
/*   DEBUGGING   */

type path = "roles.";
type _0 = LazyPropertyPath<Person, path>;
type _1 = DebugLazyPropertyPath<Person, path>;

/*   IMPLEMENTATION   */

const person = {
	pet: {
		name: "Fido",
		age: 4,
	},
	roles: ["admin", "user"],
	children: [
		{ name: "Alice", age: 5 },
		{ name: "Marco", age: 10 },
	],
	favoriteColor: "green",
	age: 30,
} as const;

type lel = keyof typeof person;

declare function get<
	Path extends string,
	Obj,
	Properties extends string[] = $String.Split<Path, ".">,
>(obj: Obj, Path: LazyPropertyPath<Obj, Path>): $Object.PropertyPathLookup<Obj, Properties>;

const test2 = get(person, "children.0.name");

/*   TESTS   */
// test ConcatStrings

// test IsNumeric
expected<true>().toEqualTypeOf<IsValidNumeric<"0">>();
expected<true>().toEqualTypeOf<IsValidNumeric<"1">>();
expected<true>().toEqualTypeOf<IsValidNumeric<"1000">>();
expected<true>().toEqualTypeOf<IsValidNumeric<"-2">>();
expected<false>().toEqualTypeOf<IsValidNumeric<"a">>();
expected<false>().toEqualTypeOf<IsValidNumeric<"pet">>();

// test JoinProperties
expected<"">().toEqualTypeOf<JoinProperties<[""]>>();
expected<"a">().toEqualTypeOf<JoinProperties<["a"]>>();
expected<"a.b">().toEqualTypeOf<JoinProperties<["a", "b"]>>();
expected<"a.b.c">().toEqualTypeOf<JoinProperties<["a", "b", "c"]>>();
expected<`a.${number}.c`>().toEqualTypeOf<JoinProperties<["a", number, "c"]>>();

// test ResolveIndexable

// test LazyPropertyPath

const testTopLevelResolution = [
	expected<keyof Person>().toEqualTypeOf<LazyPropertyPath<Person, "">>(),
	expected<keyof Person>().toEqualTypeOf<LazyPropertyPath<Person, "roles">>(),
	expected<keyof Person>().toEqualTypeOf<LazyPropertyPath<Person, "ro">>(),
];

const testTrailingDot = [
	expected<"Input a number">().toEqualTypeOf<LazyPropertyPath<Person, "roles.">>(),
	expected<"Input a number">().toEqualTypeOf<LazyPropertyPath<Person, "children.">>(),
	expected<`pet.${keyof Person["pet"]}`>().toEqualTypeOf<LazyPropertyPath<Person, "pet.">>(),
	expected<`children.0.${keyof Person["children"]["0"]}`>().toEqualTypeOf<
		LazyPropertyPath<Person, "children.0.">
	>(),
	expected<"Access error: cannot access this path">().toEqualTypeOf<
		LazyPropertyPath<Person, "roles.0.">
	>(),
	expected<"Access error: cannot access this path">().toEqualTypeOf<
		LazyPropertyPath<Person, "pet.name.">
	>(),
];

const testNestedResolution = [
	expected<`roles.${number}`>().toEqualTypeOf<LazyPropertyPath<Person, "roles.0">>(),
	expected<`children.${number}`>().toEqualTypeOf<LazyPropertyPath<Person, "children.0">>(),
	expected<`children.0.name` | `children.0.age`>().toEqualTypeOf<
		LazyPropertyPath<Person, "children.0.name">
	>(),
	expected<`Index error: tried to index an array element through a string`>().toEqualTypeOf<
		LazyPropertyPath<Person, "roles.a">
	>(),
];

expected<[]>().toEqualTypeOf<$Array.ExcludeLastElement<$String.Split<"a", ".">>>();
expected<["a"]>().toEqualTypeOf<$Array.ExcludeLastElement<$String.Split<"a.", ".">>>();
expected<["a"]>().toEqualTypeOf<$Array.ExcludeLastElement<$String.Split<"a.b", ".">>>();
expected<["a", "b"]>().toEqualTypeOf<$Array.ExcludeLastElement<$String.Split<"a.b.", ".">>>();
expected<["a", "b"]>().toEqualTypeOf<$Array.ExcludeLastElement<$String.Split<"a.b.c", ".">>>();

// test $Object.PropertyPathLookup
expected<Person["roles"]>().toEqualTypeOf<
	$Object.PropertyPathLookup<Person, $String.Split<"roles", ".">>
>();
expected<never>().toEqualTypeOf<$Object.PropertyPathLookup<Person, $String.Split<"roles.", ".">>>();
expected<Person["roles"]["0"]>().toEqualTypeOf<
	$Object.PropertyPathLookup<Person, $String.Split<"roles.0", ".">>
>();
expected<Person["children"]["0"]["name"]>().toEqualTypeOf<
	$Object.PropertyPathLookup<Person, $String.Split<"children.0.name", ".">>
>();
