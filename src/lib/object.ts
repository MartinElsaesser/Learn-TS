import { expectTypeOf as expected } from "expect-type";
export type PropertyPathLookupOnlyObjects<Obj, Properties extends PropertyKey[]> =
	Properties extends [infer F, ...infer R extends PropertyKey[]] ?
		F extends keyof Obj ?
			PropertyPathLookupOnlyObjects<Obj[F], R>
		:	never
	:	ReturnIfIsObject<Obj>;

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
	expected<never>().toEqualTypeOf<PropertyPathLookupOnlyObjects<TestPerson, ["doesNotExist"]>>(),
];

type ReturnIfIsObject<T> = T extends object ? T : never;

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

export type Intersection<A, B> = A & B extends infer U ? { [P in keyof U]: U[P] } : never;
