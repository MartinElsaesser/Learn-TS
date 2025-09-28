import { expectTypeOf as expected } from "expect-type";
export type And<Bool1 extends boolean, Bool2 extends boolean> =
	Bool1 extends true ?
		Bool2 extends true ?
			true
		:	false
	:	false;
export type Or<Bool1 extends boolean, Bool2 extends boolean> =
	Bool1 extends true ?
		Bool2 extends true ?
			true
		:	true
	: Bool2 extends true ? true
	: false;
export type Xor<Bool1 extends boolean, Bool2 extends boolean> =
	Bool1 extends true ?
		Bool2 extends true ?
			false
		:	true
	: Bool2 extends true ? true
	: false;

export type Not<Bool extends boolean> = Bool extends true ? false : true;

const testAnd = [
	expected<true>().toEqualTypeOf<And<true, true>>(),
	expected<false>().toEqualTypeOf<And<true, false>>(),
	expected<false>().toEqualTypeOf<And<false, true>>(),
	expected<false>().toEqualTypeOf<And<false, false>>(),
];
const testOr = [
	expected<true>().toEqualTypeOf<Or<true, true>>(),
	expected<true>().toEqualTypeOf<Or<true, false>>(),
	expected<true>().toEqualTypeOf<Or<false, true>>(),
	expected<false>().toEqualTypeOf<Or<false, false>>(),
];
const testXor = [
	expected<false>().toEqualTypeOf<Xor<true, true>>(),
	expected<true>().toEqualTypeOf<Xor<true, false>>(),
	expected<true>().toEqualTypeOf<Xor<false, true>>(),
	expected<false>().toEqualTypeOf<Xor<false, false>>(),
];
const testNot = [
	expected<false>().toEqualTypeOf<Not<true>>(),
	expected<true>().toEqualTypeOf<Not<false>>(),
];
