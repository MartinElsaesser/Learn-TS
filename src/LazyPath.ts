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

type Indexes = string | number;
type JoinIndexes<SArr extends Indexes[]> =
	SArr extends [infer F extends Indexes, ...infer R extends Indexes[]] ?
		ConcatStrings<`${F}`, JoinIndexes<R>, ".">
	:	"";

expectTypeOf<"">().toEqualTypeOf<JoinIndexes<[""]>>();
expectTypeOf<"a">().toEqualTypeOf<JoinIndexes<["a"]>>();
expectTypeOf<"a.b">().toEqualTypeOf<JoinIndexes<["a", "b"]>>();
expectTypeOf<"a.b.c">().toEqualTypeOf<JoinIndexes<["a", "b", "c"]>>();
expectTypeOf<`a.${number}.c`>().toEqualTypeOf<JoinIndexes<["a", number, "c"]>>();

type ReturnIfIsObject<T> = T extends object ? T : never;

type ResolveIndexable<PathSegments extends Indexes[], Obj> =
	PathSegments extends [infer Segment, ...infer Rest extends Indexes[]] ?
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

type LazyPath<
	Path extends string,
	Obj,
	PathSegments extends Indexes[] = ParsePath<Path>,
	JoinedPathSegments extends string = JoinIndexes<PathSegments>,
	ResolvedObj = ResolveIndexable<PathSegments, Obj>,
> =
	[ResolvedObj] extends [never] ? "Error (no further path)"
	: ResolvedObj extends any[] ? ConcatStrings<JoinedPathSegments, `${number}`, ".">
	: ConcatStrings<JoinedPathSegments, Cast<keyof ResolvedObj, string>, ".">;

type Cast<T, U> = T extends U ? T : U;

expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPath<"", Person>
>();
expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPath<"roles", Person>
>();

expectTypeOf<"favoritePet" | "favoriteColor" | "age" | "roles" | "children">().toEqualTypeOf<
	LazyPath<"ro", Person>
>();
expectTypeOf<`roles.${number}`>().toEqualTypeOf<LazyPath<"roles.", Person>>();
expectTypeOf<`roles.${number}`>().toEqualTypeOf<LazyPath<"roles.0", Person>>();
expectTypeOf<"Error (no further path)">().toEqualTypeOf<LazyPath<"roles.0.", Person>>();
expectTypeOf<`children.${number}`>().toEqualTypeOf<LazyPath<"children.0", Person>>();
expectTypeOf<`children.${number}.childName` | `children.${number}.childAge`>().toEqualTypeOf<
	LazyPath<"children.0.", Person>
>();
expectTypeOf<`children.${number}.childName` | `children.${number}.childAge`>().toEqualTypeOf<
	LazyPath<"children.0.childName", Person>
>();
expectTypeOf<"Error (no further path)">().toEqualTypeOf<
	LazyPath<"children.0.childName.", Person>
>();

type path = "roles.0.";
type pathSegments = ParsePath<path>;
//   ^?
type joinedSegments = JoinIndexes<pathSegments>;
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

type test = LazyPath<path, Person>;
//   ^?
type lel = ParsePath<"children.0.">;

type ParsePath<S extends string> =
	S extends `${infer Prev}.${infer Rest}` ? [ParseNumbers<Prev>, ...ParsePath<Rest>] : [];
type ParseNumbers<S extends string> = S extends `${number}` ? number : S;

expectTypeOf<[]>().toEqualTypeOf<ParsePath<"roles">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePath<"roles.">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePath<"roles.0">>();
expectTypeOf<["children", number]>().toEqualTypeOf<ParsePath<"children.0.childName">>();

declare function get<path extends string, Obj>(
	path: LazyPath<NoInfer<path>, Obj> | path,
	obj: Obj
): LazyPath<path, Obj>;

const test2 = get("roles.", person);
