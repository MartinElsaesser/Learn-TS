import { expectTypeOf } from "expect-type";
import { SmallerOrEqualT } from "./integers/zeroTuples";
import { Add } from "./integers/add";
import { Integer } from "./integers/generic";

type test = SmallerOrEqualT<[], []>;
//   ^?

// A				B
// [0,0]			[0,0,0]

type AddI<A extends number, B extends number> = Add<Integer<A>, Integer<B>>["length"];

// type SubI<A extends number, B extends number> = (SubT<Integer<A>, Integer<B>> & number[])["length"];

// multiply
type MultT<
	A extends number[],
	B extends number[],
	CountA extends number[] = [],
	TRes extends number[] = [],
> = A extends CountA ? TRes : MultT<A, B, Add<[0], CountA>, Add<B, TRes>>;

type MultI<A extends number, B extends number> = (MultT<Integer<A>, Integer<B>> &
	number[])["length"];

// divide
type DivT<A extends number[], B extends number[], TRes extends number[] = []> =
	MultT<TRes, B> extends A ? TRes : DivT<A, B, Add<[0], TRes>>;

type DivI<A extends number, B extends number> = (DivT<Integer<A>, Integer<B>> & number[])["length"];

type calc = DivI<AddI<MultI<2, 3>, 6>, 4>; // ((2*3) +7) / 4
//   ^?

// three representations:
// as tuple of zeroes e.g. [0,0,0]
// as number e.g. 3
// as GenericInteger e.g. { number: [0,0,0], sign: "+" }

// name type that takes a number (e.g. 3) and outputs a tuple of zeroes
type ToNumber<S extends string> = any;
type ToInteger<S extends string> = any;
type ToPositiveInteger<S extends string> = any;
type ToNegativeInteger<S extends string> = any;
type ToSimpleInteger<S extends string> = any;
