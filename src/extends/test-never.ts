import { expectTypeOf } from "expect-type";

type FaultyIsNever<T> = T extends never ? "is-never" : "not-never";
expectTypeOf<"is-never">().toEqualTypeOf<FaultyIsNever<never>>();
expectTypeOf<"not-never">().toEqualTypeOf<FaultyIsNever<string>>();
expectTypeOf<"not-never">().toEqualTypeOf<FaultyIsNever<unknown>>();

type IsNever<T> = [T] extends [never] ? "is-never" : "not-never";
expectTypeOf<"is-never">().toEqualTypeOf<IsNever<never>>();
expectTypeOf<"not-never">().toEqualTypeOf<IsNever<string>>();
expectTypeOf<"not-never">().toEqualTypeOf<IsNever<unknown>>();
