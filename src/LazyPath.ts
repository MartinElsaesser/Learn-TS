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

type EndsOn<S extends string, LastChar extends string> =
	S extends `${string}${LastChar}${infer Tail}` ?
		Tail extends "" ?
			true
		:	false
	:	false;

type Person = {
	favoritePet: {
		petName: "Fido";
		petAge: 4;
	};
	roles: ["admin", "user"];
	children: [{ childName: "Alice"; childAge: 5 }];
	favoriteColor: "green";
	age: 30;
};

type ParsePropertyPath<S extends string> =
	S extends `${infer Prev}.${infer Rest}` ?
		[ParseNumberProperty<Prev>, ...ParsePropertyPath<Rest>]
	:	[];
type ParseNumberProperty<S extends string> = S extends `${number}` ? number : S;
type Cast<T, U> = T extends U ? T : U;

type LazyPropertyPath<
	Obj,
	Path extends string,
	Properties extends Property[] = ParsePropertyPath<Path>,
	ResolvedObj = GetObjectFromProperties<Obj, Properties>,
> =
	[ResolvedObj] extends [never] ? "Error (no further path)"
	: ResolvedObj extends any[] ? JoinProperties<[...Properties, number]>
	: JoinProperties<[...Properties, Cast<keyof ResolvedObj, string>]>;

type DebugLazyPropertyPath<
	Obj,
	Path extends string,
	Properties extends Property[] = ParsePropertyPath<Path>,
	ResolvedObj = GetObjectFromProperties<Obj, Properties>,
> = {
	Properties: Properties;
	ResolvedObj: ResolvedObj;
	Return: LazyPropertyPath<Obj, Path>;
};
/*   DEBUGGING   */

type _1 = DebugLazyPropertyPath<Person, "favoritePet.petName">;

type DebugProperties = _1["Properties"];
//   ^?
type DebugJoinedProperties = _1["JoinedProperties"];
//   ^?
type DebugResolvedObj = _1["ResolvedObj"];
//   ^?
type DebugReturn = _1["Return"];
//   ^?

/*   IMPLEMENTATION   */
declare function get<path extends string, Obj>(
	path: LazyPropertyPath<Obj, path>,
	obj: Obj
): LazyPropertyPath<Obj, path>;

const person = {
	favoritePet: {
		petName: "Fido",
		petAge: 4,
	},
	roles: ["admin", "user"],
	children: [{ childName: "Alice", childAge: 5 }],
	favoriteColor: "green",
	age: 30,
} as const;

const test2 = get("children", person);

/*   TESTS   */
// test ConcatStrings
expectTypeOf<"">().toEqualTypeOf<ConcatStrings<"", "", ".">>();
expectTypeOf<"a">().toEqualTypeOf<ConcatStrings<"a", "", ".">>();
expectTypeOf<"b">().toEqualTypeOf<ConcatStrings<"", "b", ".">>();
expectTypeOf<"a.b">().toEqualTypeOf<ConcatStrings<"a", "b", ".">>();

// test JoinProperties
expectTypeOf<"">().toEqualTypeOf<JoinProperties<[""]>>();
expectTypeOf<"a">().toEqualTypeOf<JoinProperties<["a"]>>();
expectTypeOf<"a.b">().toEqualTypeOf<JoinProperties<["a", "b"]>>();
expectTypeOf<"a.b.c">().toEqualTypeOf<JoinProperties<["a", "b", "c"]>>();
expectTypeOf<`a.${number}.c`>().toEqualTypeOf<JoinProperties<["a", number, "c"]>>();

// test ResolveIndexable
expectTypeOf<Person>().toEqualTypeOf<GetObjectFromProperties<Person, []>>();
expectTypeOf<Person["roles"]>().toEqualTypeOf<GetObjectFromProperties<Person, ["roles"]>>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
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
expectTypeOf<"Error (no further path)">().toEqualTypeOf<LazyPropertyPath<Person, "roles.0.">>();
expectTypeOf<`children.${number}`>().toEqualTypeOf<LazyPropertyPath<Person, "children.0">>();
expectTypeOf<
	`children.${number}.childName` | `children.${number}.childAge` | "children.0."
>().toEqualTypeOf<LazyPropertyPath<Person, "children.0.">>();
expectTypeOf<`children.${number}.childName` | `children.${number}.childAge`>().toEqualTypeOf<
	LazyPropertyPath<Person, "children.0.childName">
>();
expectTypeOf<"Error (no further path)">().toEqualTypeOf<
	LazyPropertyPath<Person, "children.0.childName.">
>();

// test ParsePropertyPath
expectTypeOf<[]>().toEqualTypeOf<ParsePropertyPath<"roles">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.0">>();
expectTypeOf<["children", number]>().toEqualTypeOf<ParsePropertyPath<"children.0.childName">>();
