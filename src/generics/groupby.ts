// source: https://www.youtube.com/watch?v=ExhQxFapKCs

function groupBy<TObj extends Record<string, unknown>, TKey extends keyof TObj>(
	arr: TObj[],
	key: TKey
) {
	const result = {} as Record<TObj[TKey] & PropertyKey, TObj[]>;

	arr.forEach(elem => {
		const resultKey = elem[key] as TObj[TKey] & PropertyKey;
		if (result.hasOwnProperty(resultKey)) {
			result[resultKey].push(elem);
		} else {
			result[resultKey] = [elem];
		}
	});
	return result;
}

const grouped = groupBy(
	[
		{
			name: "Martin",
			age: 10,
		},
		{
			name: "John",
			age: 10,
		},
	],
	"age"
);
grouped[10].forEach(item => {
	type typeofItem = typeof item;
	//	 	^?
});

console.log(grouped);
