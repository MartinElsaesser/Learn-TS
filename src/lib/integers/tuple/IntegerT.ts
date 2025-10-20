import { CreateZeroesTuple } from "./zeroTuples";

export type IntegerT<Sign extends "+" | "-", N extends number> = {
	number: CreateZeroesTuple<N>;
	sign: Sign;
};

export type AnyIntegerT = {
	number: number[];
	sign: "+" | "-";
};
