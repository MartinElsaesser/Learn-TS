import { CreateZeroesTuple } from "./zeroTuples";

export type Integer<N extends number, Sign extends "+" | "-"> = {
	number: CreateZeroesTuple<N>;
	sign: Sign;
};

export type AnyInteger = {
	number: number[];
	sign: "+" | "-";
};
