import { expectTypeOf } from "expect-type";

// https://gist.github.com/palashmon/db68706d4f26d2dbf187e76409905399?permalink_comment_id=5589776#gistcomment-5589776
export type PrettifyRecursive<T> =
	T extends object ? { [K in keyof T]: PrettifyRecursive<T[K]> } : T;

type IsIndexable<T> =
	T extends Date ? false
	: T extends Function ? false
	: T extends Map<any, any> ? false
	: T extends Array<any> ? false
	: T extends BigInt ? false
	: T extends object ? true
	: false;

type MyPrettify<T> =
	IsIndexable<T> extends true ?
		{
			[P in keyof T]: MyPrettify<T[P]>;
		}
	:	T;
type test0 = MyPrettify<{ age: number } & { name: "martin" }>;
//     ^?

// don't expand
type test1 = MyPrettify<Date>;
//    ^?
type test2 = MyPrettify<Function>;
//    ^?
type test3 = MyPrettify<() => number>;
//    ^?
type test4 = MyPrettify<BigInt>;
//    ^?
type test5 = MyPrettify<number>;
//    ^?
type test6 = MyPrettify<0>;
//    ^?
type test7 = MyPrettify<string>;
//    ^?
type test8 = MyPrettify<"test">;
//    ^?
type test9 = MyPrettify<Map<string, number>>;
//    ^?

type test10 = MyPrettify<{}>;
//     ^?
type test11 = MyPrettify<object>;
//     ^?
type test12 = MyPrettify<Map<string, number>>;
//     ^?
type test13 = MyPrettify<{ age: number } & { name: "martin" }>;
//     ^?
type test14 = MyPrettify<{ age: number }>;
//     ^?
type test15 = MyPrettify<[1, 2]>;
//     ^?
type test16 = MyPrettify<number[]>;
//     ^?
type test17 = MyPrettify<Record<string, number>>;
//     ^?
type test18 = MyPrettify<Array<{ name: "Marvin" } & { age: number }>>;
//     ^?

type test = keyof Record<any, any> extends never ? "never" : "something";
