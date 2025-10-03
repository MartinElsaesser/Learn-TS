import { CreateZeroesTuple } from "./zeroTuples";

export type Integer<Sign extends "+" | "-", N extends number> = {
	number: CreateZeroesTuple<N>;
	sign: Sign;
};

export type AnyInteger = {
	number: number[];
	sign: "+" | "-";
};
