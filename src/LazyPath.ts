import { expectTypeOf as expected } from "expect-type";
import * as $String from "./lib/string";
import * as $Tuple from "./lib/tuple";
import * as $Object from "./lib/object";

type Prop = string | number;
type JoinProperties<Properties extends Prop[]> =
	Properties extends [infer F extends Prop, ...infer R extends Prop[]] ?
		$String.Join<`${F}`, ".", JoinProperties<R>>
	:	"";

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
	_Properties extends string[] = $String.Split<Path, ".">,
	_LastProperty extends string = $Tuple.OnlyLastElement<_Properties>,
	_AllButLastProperties extends string[] = $Tuple.ExcludeLastElement<_Properties>,
	_SubObj = $Object.PropertyPathLookupOnlyObjects<Obj, _AllButLastProperties>,
	_PathEndsOnDot extends boolean = $String.EndsOn<Path, ".">,
> =
	[_SubObj] extends [never] ? "Access error: cannot access this path"
	: _SubObj extends readonly any[] ?
		_LastProperty extends `${number}` ?
			IntersectionMerge<
				Path,
				JoinProperties<[..._AllButLastProperties, number]>,
				_PathEndsOnDot
			>
		: _LastProperty extends "" ? "Input a number"
		: "Index error: tried to index an array element through a string"
	:	JoinProperties<[..._AllButLastProperties, Cast<keyof _SubObj, string>]>;

type DebugLazyPropertyPath<
	Obj,
	Path extends string,
	_Properties extends string[] = $String.Split<Path, ".">,
	_LastProperty extends string = $Tuple.OnlyLastElement<_Properties>,
	_AllButLastProperties extends string[] = $Tuple.ExcludeLastElement<_Properties>,
	_SubObj = $Object.PropertyPathLookupOnlyObjects<Obj, _AllButLastProperties>,
	_PathEndsOnDot extends boolean = $String.EndsOn<Path, ".">,
> = {
	_Properties: _Properties;
	_LastProperty: _LastProperty;
	_AllButLastProperties: _AllButLastProperties;
	_SubObj: _SubObj;
	_PathEndsOnDot: _PathEndsOnDot;
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

function get<
	Path extends string,
	Obj extends Record<string | number, any>,
	_Properties extends string[] = $String.Split<Path, ".">,
	_Return = $Object.PropertyPathLookup<Obj, _Properties>,
>(obj: Obj, path: LazyPropertyPath<Obj, Path>): _Return {
	let resolvedObj = obj;
	let segments = (path as string).split(".");

	segments.forEach(segment => {
		if (Array.isArray(resolvedObj)) {
			if (segment === "") {
				throw new Error("Input a number");
			}
			if (!/^\d+$/.test(segment)) {
				throw new Error("Index error: tried to index an array element through a string");
			}
		}
		if (!resolvedObj[segment]) {
			throw new Error("Access error: cannot access this path");
		}
		resolvedObj = resolvedObj[segment];
	});
	return resolvedObj as unknown as _Return;
}

const test2 = get(person, "children.3");
//    ^?
console.log(test2);

/*   TESTS   */
const testIsNumeric = [
	expected<true>().toEqualTypeOf<IsValidNumeric<"0">>(),
	expected<true>().toEqualTypeOf<IsValidNumeric<"1">>(),
	expected<true>().toEqualTypeOf<IsValidNumeric<"1000">>(),
	expected<true>().toEqualTypeOf<IsValidNumeric<"-2">>(),
	expected<false>().toEqualTypeOf<IsValidNumeric<"a">>(),
	expected<false>().toEqualTypeOf<IsValidNumeric<"pet">>(),
];

const testJoinProperties = [
	expected<"">().toEqualTypeOf<JoinProperties<[""]>>(),
	expected<"a">().toEqualTypeOf<JoinProperties<["a"]>>(),
	expected<"a.b">().toEqualTypeOf<JoinProperties<["a", "b"]>>(),
	expected<"a.b.c">().toEqualTypeOf<JoinProperties<["a", "b", "c"]>>(),
	expected<`a.${number}.c`>().toEqualTypeOf<JoinProperties<["a", number, "c"]>>(),
];

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

expected<[]>().toEqualTypeOf<$Tuple.ExcludeLastElement<$String.Split<"a", ".">>>();
expected<["a"]>().toEqualTypeOf<$Tuple.ExcludeLastElement<$String.Split<"a.", ".">>>();
expected<["a"]>().toEqualTypeOf<$Tuple.ExcludeLastElement<$String.Split<"a.b", ".">>>();
expected<["a", "b"]>().toEqualTypeOf<$Tuple.ExcludeLastElement<$String.Split<"a.b.", ".">>>();
expected<["a", "b"]>().toEqualTypeOf<$Tuple.ExcludeLastElement<$String.Split<"a.b.c", ".">>>();

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
