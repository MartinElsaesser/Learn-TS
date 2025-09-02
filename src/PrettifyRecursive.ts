export type PrettifyRecursive<T> =
	T extends object ? { [K in keyof T]: PrettifyRecursive<T[K]> } : T;
