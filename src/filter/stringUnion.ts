type colors = "red" | "green" | "#024a74" | "#a3b497";

type FilterHexColors<C extends string> = C extends `#${string}` ? C : never;
type FilterNonHexColors<C extends string> = C extends `#${string}` ? never : C;
type hexColors = FilterHexColors<colors>;
type nonHexColors = FilterNonHexColors<colors>;
