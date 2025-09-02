// source: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type OptionsFlags<TObj> = {
  [TKey in keyof TObj]: boolean;
};

type FeatureOptions = OptionsFlags<Features>;

/*
type FeatureOptions = {
    darkMode: boolean;
    newUserProfile: boolean;
}
*/




type OnlyBoolsAndStrings = {
  [Prop in "name" | "age"]: boolean | string;
};



const onlyBoolsAndStrings: OnlyBoolsAndStrings = {
  age: false,
  name: "asdf"
}

type Lel = {
  [Prop in "name" | "age"]: (propName: `_${Prop}`) => boolean
};


