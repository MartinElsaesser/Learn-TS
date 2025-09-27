// source: https://code.lol/post/programming/higher-kinded-types/
type GenericFunction = (...x: never[]) => unknown;

abstract class HKT {
	readonly _1?: unknown;
	new?: GenericFunction;
}

type Cast<T, U> = T extends U ? T : U;

type Apply<F extends HKT, _1> = ReturnType<
	(F & {
		readonly _1: _1;
	})["new"]
>;

interface DoubleString extends HKT {
	new: (x: Cast<this["_1"], string>) => `${typeof x}${typeof x}`;
}

type Result = Apply<DoubleString, "hi!">;
//    ^?
