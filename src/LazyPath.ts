import { expectTypeOf } from "expect-type";

type ConcatStrings<S1 extends string, S2 extends string, Separator extends string> =
	S1 extends "" ?
		S2 extends "" ?
			""
		:	S2
	: S2 extends "" ? S1
	: `${S1}${Separator}${S2}`;

expectTypeOf<"">().toEqualTypeOf<ConcatStrings<"", "", ".">>();
expectTypeOf<"a">().toEqualTypeOf<ConcatStrings<"a", "", ".">>();
expectTypeOf<"b">().toEqualTypeOf<ConcatStrings<"", "b", ".">>();
expectTypeOf<"a.b">().toEqualTypeOf<ConcatStrings<"a", "b", ".">>();

type Property = string | number;
type JoinProperties<SArr extends Property[]> =
	SArr extends [infer F extends Property, ...infer R extends Property[]] ?
		ConcatStrings<`${F}`, JoinProperties<R>, ".">
	:	"";

expectTypeOf<"">().toEqualTypeOf<JoinProperties<[""]>>();
expectTypeOf<"a">().toEqualTypeOf<JoinProperties<["a"]>>();
expectTypeOf<"a.b">().toEqualTypeOf<JoinProperties<["a", "b"]>>();
expectTypeOf<"a.b.c">().toEqualTypeOf<JoinProperties<["a", "b", "c"]>>();
expectTypeOf<`a.${number}.c`>().toEqualTypeOf<JoinProperties<["a", number, "c"]>>();

type ReturnIfIsObject<T> = T extends object ? T : never;

type ResolveIndexable<PathSegments extends Property[], Obj> =
	PathSegments extends [infer Segment, ...infer Rest extends Property[]] ?
		Segment extends keyof Obj ?
			ResolveIndexable<Rest, Obj[Segment]>
		:	never
	:	ReturnIfIsObject<Obj>;

expectTypeOf<Person>().toEqualTypeOf<ResolveIndexable<[], Person>>();
expectTypeOf<Person["roles"]>().toEqualTypeOf<ResolveIndexable<["roles"], Person>>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
	ResolveIndexable<["children", "0"], Person>
>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
	ResolveIndexable<["children", number], Person>
>();
expectTypeOf<never>().toEqualTypeOf<ResolveIndexable<["children", "0", "childName"], Person>>();

expectTypeOf<never>().toEqualTypeOf<
	ResolveIndexable<["children", "0", "childName", "doesNotExist"], Person>
>();
expectTypeOf<never>().toEqualTypeOf<
	ResolveIndexable<["children", number, "childName", "doesNotExist"], Person>
>();

type EndsOn<S extends string, LastChar extends string> =
	S extends `${string}${LastChar}${infer Tail}` ?
		Tail extends "" ?
			true
		:	false
	:	false;
expectTypeOf<false>().toEqualTypeOf<EndsOn<"abc", "a">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"a", "a">>();
expectTypeOf<true>().toEqualTypeOf<EndsOn<"abc", "c">>();
expectTypeOf<false>().toEqualTypeOf<EndsOn<"", "c">>();

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

type LazyPropertyPath<
	Path extends string,
	Obj,
	PathSegments extends Property[] = ParsePropertyPath<Path>,
	JoinedPathSegments extends string = JoinProperties<PathSegments>,
	ResolvedObj = ResolveIndexable<PathSegments, Obj>,
> =
	[ResolvedObj] extends [never] ? "Error (no further path)"
	: ResolvedObj extends any[] ? ConcatStrings<JoinedPathSegments, `${number}`, ".">
	: ConcatStrings<JoinedPathSegments, Cast<keyof ResolvedObj, string>, ".">;

type Cast<T, U> = T extends U ? T : U;

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

type path = "roles.0.";
type pathSegments = ParsePropertyPath<path>;
//   ^?
type joinedSegments = JoinProperties<pathSegments>;
//   ^?
type resolvedObj = ResolveIndexable<pathSegments, Person>;
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

type ParsePropertyPath<S extends string> =
	S extends `${infer Prev}.${infer Rest}` ?
		[ParseNumberProperty<Prev>, ...ParsePropertyPath<Rest>]
	:	[];
type ParseNumberProperty<S extends string> = S extends `${number}` ? number : S;

expectTypeOf<[]>().toEqualTypeOf<ParsePropertyPath<"roles">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePropertyPath<"roles.0">>();
expectTypeOf<["children", number]>().toEqualTypeOf<ParsePropertyPath<"children.0.childName">>();

declare function get<path extends string, Obj>(
	path: LazyPropertyPath<NoInfer<path>, Obj> | path,
	obj: Obj
): LazyPropertyPath<path, Obj>;

const test2 = get("roles.", person);
