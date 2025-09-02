// source: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
interface Person {
	name: string;
	age: number;
	location: string;
}

type Getters<TObj extends Record<string, any>> = {
	[TKey in keyof TObj as `get${Capitalize<TKey & string>}`]: () => TObj[TKey];
};

type Test = Getters<Person>;
