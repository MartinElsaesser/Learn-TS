import { expectTypeOf } from "expect-type";

type Join<S1 extends string, S2 extends string, Separator extends string> =
	S1 extends "" ?
		S2 extends "" ?
			""
		:	S2
	: S2 extends "" ? S1
	: `${S1}${Separator}${S2}`;

expectTypeOf<"">().toEqualTypeOf<Join<"", "", ".">>();
expectTypeOf<"a">().toEqualTypeOf<Join<"a", "", ".">>();
expectTypeOf<"b">().toEqualTypeOf<Join<"", "b", ".">>();
expectTypeOf<"a.b">().toEqualTypeOf<Join<"a", "b", ".">>();

type JoinArr<SArr extends string[]> =
	SArr extends [infer F extends string, ...infer R extends string[]] ? Join<F, JoinArr<R>, ".">
	:	"";

expectTypeOf<"">().toEqualTypeOf<JoinArr<[""]>>();
expectTypeOf<"a">().toEqualTypeOf<JoinArr<["a"]>>();
expectTypeOf<"a.b">().toEqualTypeOf<JoinArr<["a", "b"]>>();
expectTypeOf<"a.b.c">().toEqualTypeOf<JoinArr<["a", "b", "c"]>>();

type ResolveObjPath<PathSegments extends string[], Obj> =
	PathSegments extends [infer Segment, ...infer Rest extends string[]] ?
		Segment extends keyof Obj ?
			ResolveObjPath<Rest, Obj[Segment]>
		:	never
	:	Obj;

expectTypeOf<Person>().toEqualTypeOf<ResolveObjPath<[], Person>>();
expectTypeOf<Person["roles"]>().toEqualTypeOf<ResolveObjPath<["roles"], Person>>();
expectTypeOf<Person["children"][number]>().toEqualTypeOf<
	ResolveObjPath<["children", "0"], Person>
>();
expectTypeOf<Person["children"][number]["childName"]>().toEqualTypeOf<
	ResolveObjPath<["children", "0", "childName"], Person>
>();
expectTypeOf<never>().toEqualTypeOf<
	ResolveObjPath<["children", "0", "childName", "doesNotExist"], Person>
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

type ShouldPathResolve<Path extends string> =
	EndsOn<Path, "."> extends true ? true
	: Path extends "" ? true
	: false;
type LazyPath<
	Path extends string,
	Obj,
	PathSegments extends string[] = ParsePreviousPathSegments<Path>,
	JoinedPathSegments extends string = JoinArr<PathSegments>,
> =
	ResolveObjPath<PathSegments, Obj> extends never ? "Error (no further path)"
	: ResolveObjPath<PathSegments, Obj> extends any[] ? Join<JoinedPathSegments, `${number}`, ".">
	: Join<JoinedPathSegments, keyof ResolveObjPath<PathSegments, Obj>, ".">;

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

type path = "children.0.";
type pathSegments = ParsePreviousPathSegments<path>;
//   ^?
type joinedSegments = JoinArr<pathSegments>;
//   ^?
type resolvedObj = ResolveObjPath<pathSegments, Person>;
//   ^?

type reconstructed =
	//   ^?
	resolvedObj extends never ? "Error (no further path)"
	: resolvedObj extends any[] ? Join<joinedSegments, `${number}`, ".">
	: Join<joinedSegments, keyof resolvedObj, ".">;

type test = LazyPath<path, Person>;
//   ^?
type lel = ParsePreviousPathSegments<"children.0.">;

type ParsePreviousPathSegments<S extends string> =
	S extends `${infer Prev}.${infer Rest}` ?
		[ParseNumbers<Prev>, ...ParsePreviousPathSegments<Rest>]
	:	[];
type ParseNumbers<S extends string> = S extends `${number}` ? number : S;

type _1 = ParseNumbers<"100">;

expectTypeOf<[]>().toEqualTypeOf<ParsePreviousPathSegments<"roles">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePreviousPathSegments<"roles.">>();
expectTypeOf<["roles"]>().toEqualTypeOf<ParsePreviousPathSegments<"roles.0">>();
expectTypeOf<["children", number]>().toEqualTypeOf<
	ParsePreviousPathSegments<"children.0.childName">
>();

declare function get<path extends string, Obj>(
	path: LazyPath<NoInfer<path>, Obj> | path,
	obj: Obj
): LazyPath<path, Obj>;

const test2 = get("roles.", person);
