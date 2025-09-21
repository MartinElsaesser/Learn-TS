type colorArr = ["red", "green", "#024a74", "#a3b497"];

// return filtered array as intersection
type hexColorsFromArr<C extends string[], L = C[number]> = L extends `#${string}` ? L : never;
type nonHexColorsFromArr<C extends string[], L = C[number]> = L extends `#${string}` ? never : L;
type hexColorIntersection = hexColorsFromArr<colorArr>;
type nonHexColorIntersection = nonHexColorsFromArr<colorArr>;

// return filtered array as array
type FilterHexColorArr<C extends string[]> =
	C extends [infer F extends string, ...infer R extends string[]] ?
		F extends `#${string}` ?
			[F, ...FilterHexColorArr<R>]
		:	FilterHexColorArr<R>
	:	[];
type hexColorArr = FilterHexColorArr<colorArr>;

type FilterArr<C extends string[]> =
	C extends [infer F extends string, ...infer R extends string[]] ?
		F extends `#${string}` ?
			[F, ...FilterHexColorArr<R>]
		:	FilterHexColorArr<R>
	:	[];
