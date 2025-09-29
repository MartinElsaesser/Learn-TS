export type Integer<TNum extends number, TTup extends number[] = []> =
	TTup["length"] extends TNum ? TTup : Integer<TNum, [0, ...TTup]>;

// add
type AddT<A extends number[], B extends number[]> = [...A, ...B];

type AddI<A extends number, B extends number> = AddT<Integer<A>, Integer<B>>["length"];

// subtract
type SubT<A extends number[], B extends number[], TRes extends number[] = []> =
	[...TRes, ...B] extends A ? TRes : SubT<A, B, [0, ...TRes]>;

type SubI<A extends number, B extends number> = (SubT<Integer<A>, Integer<B>> & number[])["length"];

// multiply
type MultT<
	A extends number[],
	B extends number[],
	CountA extends number[] = [],
	TRes extends number[] = [],
> = A extends CountA ? TRes : MultT<A, B, AddT<[0], CountA>, AddT<B, TRes>>;

type MultI<A extends number, B extends number> = (MultT<Integer<A>, Integer<B>> &
	number[])["length"];

// divide
type DivT<A extends number[], B extends number[], TRes extends number[] = []> =
	MultT<TRes, B> extends A ? TRes : DivT<A, B, AddT<[0], TRes>>;

type DivI<A extends number, B extends number> = (DivT<Integer<A>, Integer<B>> & number[])["length"];

type calc = DivI<AddI<MultI<2, 3>, 6>, 4>; // ((2*3) +7) / 4
//   ^?
