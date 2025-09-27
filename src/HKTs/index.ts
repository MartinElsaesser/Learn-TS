// source: https://code.lol/post/programming/higher-kinded-types/
type GenericFunction = (...x: never[]) => unknown;

interface HKT {
	readonly _1?: unknown;
	func: GenericFunction;
}

type Cast<T, U> = T extends U ? T : U;

type Apply<F extends HKT, _1> = ReturnType<
	(F & {
		readonly _1: _1;
	})["func"]
>;

type HKTInput<F extends HKT> = Parameters<F["func"]>[0];

// implementation

interface DoubleString extends HKT {
	func: (x: Cast<this["_1"], string>) => `${typeof x}${typeof x}`;
}

type MapTuple<Arr extends HKTInput<F>[], F extends HKT> = {
	[K in keyof Arr]: Apply<F, Arr[K]>;
};

type doubledString = Apply<DoubleString, "hi!">;
//    ^?

type mappedDoubleString = MapTuple<["a", "b"], DoubleString>;
//    ^?
