import { expectTypeOf } from "expect-type";

type CheckArrayTypes<TAny> =
	TAny extends (string | number | boolean | Function | bigint)[] ? "Non Indexable Array"
	: TAny extends (Record<any, any> | Map<any, any>)[] ? "Array"
	: "failed";

expectTypeOf<CheckArrayTypes<string[]>>().toEqualTypeOf<"Non Indexable Array">();

expectTypeOf<CheckArrayTypes<number[]>>().toEqualTypeOf<"Non Indexable Array">();

expectTypeOf<CheckArrayTypes<boolean[]>>().toEqualTypeOf<"Non Indexable Array">();

expectTypeOf<CheckArrayTypes<Function[]>>().toEqualTypeOf<"Non Indexable Array">();

expectTypeOf<CheckArrayTypes<bigint[]>>().toEqualTypeOf<"Non Indexable Array">();

expectTypeOf<CheckArrayTypes<Map<string, number>[]>>().toEqualTypeOf<"Array">();

expectTypeOf<CheckArrayTypes<number>>().toEqualTypeOf<"failed">();

expectTypeOf<CheckArrayTypes<number[][]>>().toEqualTypeOf<"Array">();

expectTypeOf<CheckArrayTypes<Array<Function>>>().toEqualTypeOf<"Non Indexable Array">();
