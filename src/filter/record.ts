type dbDog = {
	name: "Marvin";
	age: 5;
	_id: 1;
};

type FilterKeys<T extends Record<string, unknown>> = {
	[P in keyof T as P extends `_${string}` ? never : P]: T[P];
};

type dog = FilterKeys<dbDog>;
