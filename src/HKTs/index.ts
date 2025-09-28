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

/*
	MAP
*/
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

type MakeMappable<Arr extends unknown[], _Idx extends number[] = [], _Arr = Arr> =
	Arr extends [infer First, ...infer Rest] ?
		[
			{
				elem: First;
				idx0: _Idx["length"];
				idx1: [..._Idx, 0]["length"];
				arr: _Arr;
			},
			...MakeMappable<Rest, [0, ..._Idx], _Arr>,
		]
	:	[];
type arr = MakeMappable<["a", "b", 0, 1]>;
//   ^?
/*
	FILTER
*/
interface FilterString extends HKT {
	func: (
		x: Cast<
			this["_1"],
			{
				elem: unknown;
				idx0: number;
				idx1: number;
				arr: unknown[];
			}
		>
	) => (typeof x)["idx1"] extends arr["length"] ? true : false;
}
type FilterTuple<Arr extends HKTInput<F>[], F extends HKT> =
	Arr extends [infer First, ...infer Rest extends HKTInput<F>[]] ?
		[...(Apply<F, First> extends true ? [First] : []), ...FilterTuple<Rest, F>]
	:	[];

type filteredTuple = FilterTuple<MakeMappable<["a", "b", 0, 1]>, FilterString>;
//    ^?
type mappedTuple = MapTuple<MakeMappable<["a", "b", 0, 1]>, FilterString>;
//   ^?
