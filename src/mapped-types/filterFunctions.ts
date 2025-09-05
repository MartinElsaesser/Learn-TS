type FilterObjs<Key, Val> = {
	[K in
		| undefined
		| string
		| number
		| boolean as `remove${Capitalize<StringifyTypes<K>>}`]: K extends Val ? never : Key;
} & {
	[K in
		| undefined
		| string
		| number
		| boolean as `keep${Capitalize<StringifyTypes<K>>}`]: K extends Val ? Key : never;
};
type StringifyTypes<Type> =
	Type extends string ? "string"
	: Type extends number ? "number"
	: Type extends undefined ? "undefined"
	: Type extends boolean ? "boolean"
	: never;

type Filter<TFunc extends keyof FilterObjs<any, any>, TObj> = {
	[TKey in keyof TObj as FilterObjs<TKey, TObj[TKey]>[TFunc]]: TObj[TKey];
};

type FilterObjsVals = keyof FilterObjs<any, any>;
type TestFilter = Filter<
	"keepString",
	{
		str: string;
		optStr?: string;
		undef: undefined;
		num: number;
		optNum?: number;
	}
>;

// second filter implementation
type Methods = "keep" | "remove";
type Types = number | string;
type Filters<Key, Val, Method extends Methods, Type extends Types> =
	Method extends "keep" ?
		Type extends Val ?
			Key
		:	never
	: Type extends Val ? never
	: Key;

type Filter2<Method extends Methods, Type extends Types, TObj> = {
	[TKey in keyof TObj as Filters<TKey, TObj[TKey], Method, Type>]: TObj[TKey];
};

type TestFilter2 = Filter2<
	"keep",
	number,
	{
		str: string;
		optStr?: string;
		undef: undefined;
		num: number;
		optNum?: number;
	}
>;
