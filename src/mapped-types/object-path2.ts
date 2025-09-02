import { expectTypeOf } from "expect-type";
import { PrettifyRecursive } from "../PrettifyRecursive";
import { JoinStrings } from "../string-literals/JoinStrings";

type Company = {
	name: string;
	languages: string[];
	addresses: {
		street: string;
		houseNumber: number;
		country: string;
		zipCode: string;
	}[];
	address: {
		street: string;
		houseNumber: number;
		country: string;
		zipCode: string;
	};
};

// cases:
// TObj is Record
// * TObj[Key] is Record[]
// * TObj[Key] is any[]
// * TObj[Key] is Record
// * TObj[Key] is any
// TObj is Record[]
// never fallback

declare const _path: unique symbol;
declare const _builtBy: unique symbol;

type BuildPathObject_Property<TPath extends string, Value> = Value & {
	_path: TPath;
	_builtBy: "Property";
};
type BuildPathObject_Record<TPath extends string, Value> = Value & {
	_path: TPath;
	_builtBy: "Record";
};
type BuildPathObject_RecordArray<TPath extends string, Value> = Value & {
	_path: TPath;
	_builtBy: "RecordArray";
};
type BuildPathObject_Array<TPath extends string, Value> = Value & {
	_path: TPath;
	_builtBy: "Array";
};

type NonIndexableArray = (string | number | boolean | Function | bigint)[];
type BuildPathObject<TObj, TPath extends string = ""> = {
	[Key in keyof TObj]: TObj[Key] extends NonIndexableArray ?
		// any[]
		BuildPathObject_Array<
			| JoinStrings<[TPath, Key & string, `${number}`], ".">
			| JoinStrings<[TPath, Key & string], ".">,
			TObj[Key]
		> & {}
	: TObj[Key] extends Record<any, any>[] ?
		// Record[]
		BuildPathObject_RecordArray<
			JoinStrings<[TPath, Key & string], ".">,
			BuildPathObject<TObj[Key], JoinStrings<[TPath, Key & string], ".">>
		> & {}
	: TObj[Key] extends Record<any, any> ?
		// Record
		BuildPathObject_Record<
			JoinStrings<[TPath, Key & string], ".">,
			BuildPathObject<TObj[Key], JoinStrings<[TPath, Key & string], ".">>
		> & {}
	:	// fallback
		BuildPathObject_Property<JoinStrings<[TPath, Key & string], ".">, TObj[Key]> & {};
} & {};

export type DEBUG________________ = BuildPathObject<Company>;

type Id<T> = {} & { [P in keyof T]: T[P] };

type B = Id<DEBUG________________>["addresses"];
type AAAAAAAAAAAAAAAAAA = PrettifyRecursive<
	BuildPathObject<{
		name: string;
		languages: string[];
		// addresses: {
		//   street: string;
		//   houseNumber: number;
		//   country: string;
		//   zipCode: string;
		// }[];
		address: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		};
	}>
>;

expectTypeOf<{
	name: string & { _path: "name"; _builtBy: "Property" };
}>().toEqualTypeOf<
	BuildPathObject<{
		name: string;
	}>
>();

// expectTypeOf<'actual'>().toEqualTypeOf<'expected'>();

expectTypeOf<
	BuildPathObject<{
		languages: string[];
	}>
>().toEqualTypeOf<{
	languages: string[] & {
		_path: `languages.${number}` | "languages";
		_builtBy: "Array";
	};
}>();

expectTypeOf<
	BuildPathObject<{
		languages: Function[];
	}>
>().toEqualTypeOf<{
	languages: Function[] & {
		_path: "languages" | `languages.${number}`;
		_builtBy: "Array";
	};
}>();

expectTypeOf<
	BuildPathObject<{
		address: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		};
	}>
>().toEqualTypeOf<{
	address: {
		street: string & {
			_path: "address.street";
			_builtBy: "Property";
		};
		houseNumber: number & {
			_path: "address.houseNumber";
			_builtBy: "Property";
		};
		country: string & {
			_path: "address.country";
			_builtBy: "Property";
		};
		zipCode: string & {
			_path: "address.zipCode";
			_builtBy: "Property";
		};
	} & {
		_path: "address";
		_builtBy: "Record";
	};
}>();

expectTypeOf<
	BuildPathObject<{
		addresses: {}[];
	}>
>().toEqualTypeOf<{
	addresses: {}[] & {
		_path: "addresses";
		_builtBy: "RecordArray";
	};
}>();

expectTypeOf<
	BuildPathObject<{
		name: string;
		addresses: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		}[];
	}>
>().toEqualTypeOf<{
	name: string & { _path: "name" };
	addresses: {
		street: string & { _path: `address.${number}.street` };
		houseNumber: number & { _path: `address.${number}.houseNumber` };
		country: string & { _path: `address.${number}.country` };
		zipCode: string & { _path: `address.${number}.zipCode` };
	}[] & { _path: "addresses" };
}>();

expectTypeOf<
	BuildPathObject<{
		name: string;
		languages: string[];
		addresses: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		}[];
		address: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		};
	}>
>().toEqualTypeOf<{
	name: "name";
	languages: `languages.${number}`;
	addresses: {
		street: `addresses.${number}.street`;
		houseNumber: `addresses.${number}.houseNumber`;
		country: `addresses.${number}.country`;
		zipCode: `addresses.${number}.zipCode`;
	};
	address: {
		street: "address.street";
		houseNumber: "address.houseNumber";
		country: "address.country";
		zipCode: "address.zipCode";
	};
}>();

type CompanyPathsObj = BuildPathObject<Company>;
type CompanyPathsObjPretty = PrettifyRecursive<BuildPathObject<Company[]>>;

// source: https://stackoverflow.com/questions/66379051/recursively-get-property-names-of-an-object-record
type RecursiveKeys<TObj extends Record<any, any>> =
	TObj extends object ?
		{
			[Key in keyof TObj]: Key | RecursiveKeys<TObj[Key]>;
		}[keyof TObj]
	:	never;

type RecursiveProps<TObj extends Record<any, any>> =
	TObj extends object ?
		{
			[Key in keyof TObj]: ValueIfObject<TObj[Key], RecursiveProps<TObj[Key]>>;
		}[keyof TObj]
	:	never;

type ValueIfObject<ReturnIfNotObject, Fallback> =
	ReturnIfNotObject extends object ? Fallback : ReturnIfNotObject;

type ObjectPath<TObj extends Record<any, any>> = RecursiveProps<BuildPathObject<TObj>>;

expectTypeOf<
	ObjectPath<{
		name: string;
		languages: string[];
		addresses: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		}[];
		address: {
			street: string;
			houseNumber: number;
			country: string;
			zipCode: string;
		};
	}>
>().toEqualTypeOf<
	| "name"
	| `languages`
	| `languages.${number}`
	| `addresses`
	| `addresses.${number}.street`
	| `addresses.${number}.houseNumber`
	| `addresses.${number}.country`
	| `addresses.${number}.zipCode`
	| `address`
	| "address.street"
	| "address.houseNumber"
	| "address.country"
	| "address.zipCode"
>();

type Test4 = RecursiveProps<CompanyPathsObj>;

const path: ObjectPath<Company> = "languages.0";

function get<T extends Record<any, any>>(data: T, pathStr: ObjectPath<T>): any {
	const path = (pathStr as unknown as string).split(".");
	let returnData = data;
	while (path.length) returnData = returnData[path.shift()!];
	return returnData;
}

const company: Company = {
	name: "Konzepthaus",
	languages: ["english", "german"],
	addresses: [],
	address: {
		country: "germany",
		houseNumber: 32,
		street: "Sonthofener Stra",
		zipCode: "2",
	},
};

const d = get<Company>(company, "addresses.0.zipCode");
