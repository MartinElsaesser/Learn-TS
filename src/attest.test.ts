import { describe, it } from "vitest";
import { attest, bench } from "@ark/attest";
import { get, LazyPropertyPath, person } from "./LazyPath";

type Person = typeof person;
type baseLine = LazyPropertyPath<Person, "age">;

bench("access roles", () => {
	return {} as LazyPropertyPath<Person, "roles">;
	// This is an inline snapshot that will be populated or compared when you run the file
}).types([142, "instantiations"]);

bench("access children.age.0", () => {
	return {} as LazyPropertyPath<Person, "children.age.0">;
	// This is an inline snapshot that will be populated or compared when you run the file
}).types([393, "instantiations"]);
