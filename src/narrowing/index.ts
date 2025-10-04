import { expectTypeOf as expect } from "expect-type";

type Primitives = [
	boolean,
	string,
	number,
	undefined,
	null,
	any,
	unknown,
	never,
	void,
	bigint,
	symbol,
];

type CommonObjects = [
	Date,
	Error,
	Array<string>,
	Map<string, string>,
	Set<string>,
	RegExp,
	Promise<string>,
];

type Literals = [
	{ field: string },
	(arg: number) => string,
	string[],
	Array<string>,
	[string, number],
];

type IsNarrower<A, B> = A extends B ? true : false;
expect<IsNarrower<"Horse", string>>().toEqualTypeOf<true>();
expect<IsNarrower<string, "Horse">>().toEqualTypeOf<false>();

// objects
expect<IsNarrower<{ name: "Camila" }, Record<string, any>>>().toEqualTypeOf<true>();
expect<IsNarrower<{ name: "Camila"; age: 9 }, Record<string, any>>>().toEqualTypeOf<true>();
expect<IsNarrower<{ name: "Camila"; age: 9 }, { name: "Camila" }>>().toEqualTypeOf<true>();

expect<IsNarrower<{ name: "Camila" }, { name: "Camila"; age: 9 }>>().toEqualTypeOf<false>(); // not narrower

let obj = { name: "Camila", age: 9 } as const;
let rec: Record<string, any> = { test: [1, 2] };

// obj is narrower than rec
rec = obj;

// @ts-expect-error (rec is wider than obj)
obj = rec;
