type RevOrder<
	Arr extends string[],
	_Count extends number[] = [],
	_CountNum extends number = _Count["length"],
> =
	Arr extends [...infer F extends string[], infer L extends string] ?
		[...RevOrder<F, [0, ..._Count]>, `${L} ${_CountNum}`]
	:	[];

type ForwOrder<
	Arr extends string[],
	_Count extends number[] = [],
	_CountNum extends number = _Count["length"],
> =
	Arr extends [infer F extends string, ...infer R extends string[]] ?
		[`${F} ${_CountNum}`, ...ForwOrder<R, [0, ..._Count]>]
	:	[];
type r = RevOrder<["a", "b", "c"]>;
//   ^?
type f = ForwOrder<["a", "b", "c"]>;
//   ^?
