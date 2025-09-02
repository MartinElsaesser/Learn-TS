import { expectTypeOf } from "expect-type";
import { PrettifyRecursive } from "../PrettifyRecursive";
import { JoinStrings } from "../string-literals/JoinStrings";

type Company = {
  name: string;
  languages: string[];
  addresses: {
    street: string;
    houseNumber: number;
    country: string;
    zipCode: string;
  }[];
  address: {
    street: string;
    houseNumber: number;
    country: string;
    zipCode: string;
  };
};

// cases:
// TObj is Record
// * TObj[Key] is Record[]
// * TObj[Key] is any[]
// * TObj[Key] is Record
// * TObj[Key] is any
// TObj is Record[]
// never fallback
type BuildPathObject<TObj, TPath extends string = ""> = TObj extends Record<
  any,
  any
>[]
  ? BuildPathObject<TObj[number], JoinStrings<[TPath, `${number}`], ".">>
  : {
      [Key in keyof TObj]: TObj[Key] extends Record<any, any>[]
        ? // Record[]
          BuildPathObject<TObj[Key], JoinStrings<[TPath, Key & string], ".">>
        : TObj[Key] extends any[]
          ? // any[]
            JoinStrings<[TPath, Key & string, `${number}`], ".">
          : TObj[Key] extends Record<any, any>
            ? // Record
              BuildPathObject<
                TObj[Key],
                JoinStrings<[TPath, Key & string], ".">
              >
            : // fallback
              JoinStrings<[TPath, Key & string], ".">;
    };

expectTypeOf<
  BuildPathObject<{
    name: string;
    languages: string[];
    addresses: {
      street: string;
      houseNumber: number;
      country: string;
      zipCode: string;
    }[];
    address: {
      street: string;
      houseNumber: number;
      country: string;
      zipCode: string;
    };
  }>
>().toEqualTypeOf<{
  name: "name";
  languages: `languages.${number}`;
  addresses: {
    street: `addresses.${number}.street`;
    houseNumber: `addresses.${number}.houseNumber`;
    country: `addresses.${number}.country`;
    zipCode: `addresses.${number}.zipCode`;
  };
  address: {
    street: "address.street";
    houseNumber: "address.houseNumber";
    country: "address.country";
    zipCode: "address.zipCode";
  };
}>();

type CompanyPathsObj = BuildPathObject<Company>;
type CompanyPathsObjPretty = PrettifyRecursive<BuildPathObject<Company>>;

// source: https://stackoverflow.com/questions/66379051/recursively-get-property-names-of-an-object-record
type RecursiveKeys<TObj extends Record<any, any>> = TObj extends object
  ? {
      [Key in keyof TObj]: Key | RecursiveKeys<TObj[Key]>;
    }[keyof TObj]
  : never;

type RecursiveProps<TObj extends Record<any, any>> = TObj extends object
  ? {
      [Key in keyof TObj]: ValueIfObject<TObj[Key], RecursiveProps<TObj[Key]>>;
    }[keyof TObj]
  : never;

type ValueIfObject<ReturnIfNotObject, Fallback> =
  ReturnIfNotObject extends object ? Fallback : ReturnIfNotObject;

type ObjectPath<TObj extends Record<any, any>> = RecursiveProps<
  BuildPathObject<TObj>
>;

expectTypeOf<
  ObjectPath<{
    name: string;
    languages: string[];
    addresses: {
      street: string;
      houseNumber: number;
      country: string;
      zipCode: string;
    }[];
    address: {
      street: string;
      houseNumber: number;
      country: string;
      zipCode: string;
    };
  }>
>().toEqualTypeOf<
  | "name"
  | `languages`
  | `languages.${number}`
  | `addresses`
  | `addresses.${number}.street`
  | `addresses.${number}.houseNumber`
  | `addresses.${number}.country`
  | `addresses.${number}.zipCode`
  | `address`
  | "address.street"
  | "address.houseNumber"
  | "address.country"
  | "address.zipCode"
>();

type Test4 = RecursiveProps<CompanyPathsObj>;

const path: ObjectPath<Company> = "languages.0";

function get<T extends Record<any, any>>(data: T, pathStr: ObjectPath<T>): any {
  const path = (pathStr as unknown as string).split(".");
  let returnData = data;
  while (path.length) returnData = returnData[path.shift()!];
  return returnData;
}

const company: Company = {
  name: "Konzepthaus",
  languages: ["english", "german"],
  addresses: [],
  address: {
    country: "germany",
    houseNumber: 32,
    street: "Sonthofener Stra",
    zipCode: "2",
  },
};

const d = get<Company>(company, "addresses.0.zipCode");
