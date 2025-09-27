type Num<TNum extends number, TTup extends number[] = []> =
	TTup["length"] extends TNum ? TTup : Num<TNum, [0, ...TTup]>;

// add
type AddT<A extends number[], B extends number[]> = [...A, ...B];

type Add<A extends number, B extends number> = AddT<Num<A>, Num<B>>["length"];

// subtract
type SubT<A extends number[], B extends number[], TRes extends number[] = []> =
	[...TRes, ...B] extends A ? TRes : SubT<A, B, [0, ...TRes]>;

type Sub<A extends number, B extends number> = (SubT<Num<A>, Num<B>> & number[])["length"];

// multiply
type MultT<
	A extends number[],
	B extends number[],
	CountA extends number[] = [],
	TRes extends number[] = [],
> = A extends CountA ? TRes : MultT<A, B, AddT<[0], CountA>, AddT<B, TRes>>;

type Mult<A extends number, B extends number> = (MultT<Num<A>, Num<B>> & number[])["length"];

// divide
type DivT<A extends number[], B extends number[], TRes extends number[] = []> =
	MultT<TRes, B> extends A ? TRes : DivT<A, B, AddT<[0], TRes>>;

type Div<A extends number, B extends number> = (DivT<Num<A>, Num<B>> & number[])["length"];

type calc = Add<Mult<2, 3>, 7>; // 2*3 +7
