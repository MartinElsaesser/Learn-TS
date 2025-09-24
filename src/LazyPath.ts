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

type GetObjectFromProperties<Properties extends Property[], Obj> =
	Properties extends [infer F, ...infer R extends Property[]] ?
		F extends keyof Obj ?
			GetObjectFromProperties<R, Obj[F]>
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
	Path extends string,
	Obj,
	Properties extends Property[] = ParsePropertyPath<Path>,
	JoinedProperties extends string = JoinProperties<Properties>,
	ResolvedObj = GetObjectFromProperties<Properties, Obj>,
> =
	[ResolvedObj] extends [never] ? "Error (no further path)"
	: ResolvedObj extends any[] ? ConcatStrings<JoinedProperties, `${number}`, ".">
	: ConcatStrings<JoinedProperties, Cast<keyof ResolvedObj, string>, ".">;

/*   DEBUGGING   */
type path = "roles.0.";
type pathSegments = ParsePropertyPath<path>;
//   ^?
type joinedSegments = JoinProperties<pathSegments>;
//   ^?
type resolvedObj = GetObjectFromProperties<pathSegments, Person>;
//   ^?

type reconstructed =
	//   ^?
	resolvedObj extends never ? "Error (no further path)"
	: resolvedObj extends object ?
		resolvedObj extends any[] ?
			ConcatStrings<joinedSegments, `${number}`, ".">
		:	ConcatStrings<joinedSegments, Cast<keyof resolvedObj, string>, ".">
	:	"Error (no further path)";

type test = LazyPropertyPath<path, Person>;
//   ^?
type lel = ParsePropertyPath<"children.0.">;

/*   IMPLEMENTATION   */
declare function get<path extends string, Obj>(
	path: LazyPropertyPath<NoInfer<path>, Obj> | path,
	obj: Obj
): LazyPropertyPath<path, Obj>;

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

const test2 = get("roles.", person);

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
expectTypeOf<Person>().toEqualTypeOf<GetObjectFromProperties<[], Person>>();
expectTypeOf<Person["roles"]>().toEqualTypeOf<GetObjectFromProperties<["roles"], Person>>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
	GetObjectFromProperties<["children", "0"], Person>
>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
	GetObjectFromProperties<["children", number], Person>
>();
expectTypeOf<never>().toEqualTypeOf<
	GetObjectFromProperties<["children", "0", "childName"], Person>
>();

expectTypeOf<never>().toEqualTypeOf<
	GetObjectFromProperties<["children", "0", "childName", "doesNotExist"], Person>
>();
expectTypeOf<never>().toEqualTypeOf<
	GetObjectFromProperties<["children", number, "childName", "doesNotExist"], Person>
>();

// test EndsOn
expectTypeOf<false>().toEqualTypeOf<EndsOn<"abc", "a">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"a", "a">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"abc", "c">>();
expectTypeOf<false>().toEqualTypeOf<EndsOn<"", "c">>();

// test LazyPropertyPath
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPropertyPath<"", Person>
>();
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPropertyPath<"roles", Person>
>();
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPropertyPath<"ro", Person>
>();
expectTypeOf<`roles.${number}`>().toEqualTypeOf<LazyPropertyPath<"roles.", Person>>();
expectTypeOf<`roles.${number}`>().toEqualTypeOf<LazyPropertyPath<"roles.0", Person>>();
expectTypeOf<"Error (no further path)">().toEqualTypeOf<LazyPropertyPath<"roles.0.", Person>>();
expectTypeOf<`children.${number}`>().toEqualTypeOf<LazyPropertyPath<"children.0", Person>>();
expectTypeOf<`children.${number}.childName` | `children.${number}.childAge`>().toEqualTypeOf<
	LazyPropertyPath<"children.0.", Person>
>();
expectTypeOf<`children.${number}.childName` | `children.${number}.childAge`>().toEqualTypeOf<
	LazyPropertyPath<"children.0.childName", Person>
>();
expectTypeOf<"Error (no further path)">().toEqualTypeOf<
	LazyPropertyPath<"children.0.childName.", Person>
>();

// test ParsePropertyPath
expectTypeOf<[]>().toEqualTypeOf<ParsePropertyPath<"roles">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.0">>();
expectTypeOf<["children", number]>().toEqualTypeOf<ParsePropertyPath<"children.0.childName">>();
