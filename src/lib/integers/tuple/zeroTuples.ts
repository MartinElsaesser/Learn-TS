export type CreateZeroesTuple<RepeatCount extends number, _Acc extends number[] = []> =
	_Acc["length"] extends RepeatCount ? _Acc : CreateZeroesTuple<RepeatCount, [0, ..._Acc]>;

export type SmallerT<A extends number[], B extends number[]> =
	A extends [infer A_First, ...infer A_Rest extends number[]] ?
		B extends [infer B_First, ...infer B_Rest extends number[]] ?
			SmallerT<A_Rest, B_Rest> // A is full && B is full
		:	false // A is full && B is empty
	: B extends [infer B_First, ...infer B_Rest] ?
		true // A is empty && B is full
	:	false; // A is empty && B is empty

export type SmallerOrEqualT<A extends number[], B extends number[]> =
	A extends [infer A_First, ...infer A_Rest extends number[]] ?
		B extends [infer B_First, ...infer B_Rest extends number[]] ?
			SmallerOrEqualT<A_Rest, B_Rest> // A is full && B is full
		:	false // A is full && B is empty
	: B extends [infer B_First, ...infer B_Rest] ?
		true // A is empty && B is full
	:	true; // A is empty && B is empty
export type SubtractWithSignT<A extends number[], B extends number[], _Acc extends number[] = []> =
	// A - B
	SmallerT<A, B> extends true ?
		// A < B (e.g. 2 - 4 = -2)
		[..._Acc, ...A] extends B ?
			{
				number: _Acc;
				sign: "-";
			}
		:	SubtractWithSignT<A, B, [0, ..._Acc]>
	: // A >= B
	// A == B (e.g. 4 - 4 = 0)
	// A > B (e.g. 4 - 2 = 2)
	[..._Acc, ...B] extends A ?
		{
			number: _Acc;
			sign: "+";
		}
	:	SubtractWithSignT<A, B, [0, ..._Acc]>;
