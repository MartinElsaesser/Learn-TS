import { describe, it } from "vitest";
import { attest, bench } from "@ark/attest";
import { UnsignedAdd, AddWithCarry } from "./numberTuple/add.js";
import { AddTI } from "./tuple/AddTI.js";
import { IntegerT } from "./tuple/IntegerT.js";

bench("AddTi (baseline)", () => {
	// old addition implementation
	return {} as AddTI<IntegerT<"+", 300>, IntegerT<"+", 400>>;
}).types([84945, "instantiations"]);

const stringAddBaseline = 412;
bench("Add (baseline)", () => {
	// new addition implementation
	return {} as UnsignedAdd<300, 400>;
}).types([412, "instantiations"]);

bench("Add (4503599627370495 + 4503599627370495)", () => {
	// new addition implementation
	return {} as UnsignedAdd<4503599627370495, 4503599627370495>;
}).types([stringAddBaseline, "instantiations"]);

const addNumbersWithCarryBaseline = 89;
bench("AddWithCarry (baseline)", () => {
	// add single numbers with carry
	return {} as AddWithCarry<1, 1, 1>;
}).types([89, "instantiations"]);

bench("AddWithCarry (9+8+7)", () => {
	// add single numbers with carry
	return {} as AddWithCarry<9, 8, 7>;
}).types([89, "instantiations"]);
