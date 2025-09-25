type TypesEqual<T, U> =
	[T] extends [U] ?
		[U] extends [T] ?
			true
		:	false
	: [U] extends [T] ?
		[T] extends [U] ?
			true
		:	false
	:	false;

type debug4 = TypesEqual<{ a: "A" }, { readonly a: "A" }>;
