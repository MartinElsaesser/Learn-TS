export type NumberWithCarry = { carry: number; digit: number };
export type ParseNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
export type StringToNumberTuple<S extends string> =
	S extends `${infer F extends number}${infer R}` ? [F, ...StringToNumberTuple<R>] : [];
