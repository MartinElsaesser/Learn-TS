import { describe, it } from "vitest";
import { attest, bench } from "@ark/attest";
import { Add } from "./stringNumbers.js";
import { AddTI } from "./tuple/AddTI.js";
import { IntegerT } from "./tuple/IntegerT.js";

bench("AddTi (baseline)", () => {
	// old addition implementation
	return {} as AddTI<IntegerT<"+", 300>, IntegerT<"+", 400>>;
}).types([84945, "instantiations"]);

const stringAddBaseline = 412;
bench("Add (baseline)", () => {
	// new addition implementation
	return {} as Add<300, 400>;
}).types([412, "instantiations"]);

bench("Add (4503599627370495 + 4503599627370495)", () => {
	// new addition implementation
	return {} as Add<4503599627370495, 4503599627370495>;
}).types([stringAddBaseline, "instantiations"]);
