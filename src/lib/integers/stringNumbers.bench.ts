import { describe, it } from "vitest";
import { attest, bench } from "@ark/attest";
import { Add as AddT } from "./add.js";
import { Integer } from "./createInteger.js";
import { Add } from "./stringNumbers.js";

type baseLineTupleAdd = AddT<Integer<"+", 100>, Integer<"+", 100>>;
type baseLineStringAdd = Add<100, 100>;

bench("tuple based Addition", () => {
	// old addition implementation
	return {} as AddT<Integer<"+", 300>, Integer<"+", 400>>;
}).types([79572, "instantiations"]);

bench("string based Addition", () => {
	// new addition implementation
	return {} as Add<300, 400>;
}).types([355, "instantiations"]);
