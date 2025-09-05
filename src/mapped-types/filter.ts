// FILTER PROPERTIES STARTING WITH _

// with Omit
type AllConfigOptions = {
	METHOD: "POST" | "GET" | "PUT" | "PATCH";
	_FETCH_IMPLEMENTATION: "FETCH" | "AXIOS";
};
type ConfigOptions = Omit<AllConfigOptions, `_${string}`>;

// with as
type FilterUnderscores<T> = T extends `_${string}` ? never : T;
type FilterUnderScoreProps<TObj> = {
	[TKey in keyof TObj as FilterUnderscores<TKey>]: TObj[TKey];
};
type ConfigOptions2 = FilterUnderScoreProps<AllConfigOptions>;

// Filter colors
type ColorConfig = {
	blueLight: "light-blue";
	blueDark: "dark-blue";

	redLight: "light-red";
	redDark: "dark-red";
};

type KeepColor<T, TColor extends string> = T extends `${TColor}${string}` ? T : never;
type KeepColors<TObj, TColor extends string> = {
	[TKey in keyof TObj as KeepColor<TKey, TColor>]: TObj[TKey];
};
type Colors = KeepColors<ColorConfig, "red">;

// Filter undefined values
type FilterUndefined<Key, Val> = undefined extends Val ? never : Key;
type FilterUndefinedProps<TObj> = {
	[TKey in keyof TObj as FilterUndefined<TKey, TObj[TKey]>]: TObj[TKey];
};

type T = FilterUndefinedProps<{
	a: string;
	b: undefined;
	c?: number;
}>;
