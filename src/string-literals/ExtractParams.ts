// source: https://dev.to/bytimo/useful-types-extract-route-params-with-typescript-5fhn
type ExtractParam<Path, NextPart> = Path extends `:${infer Param}`
  ? Record<Param, string> & NextPart
  : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
  ? ExtractParam<Segment, ExtractParams<Rest>>
  : ExtractParam<Path, {}>;

type ExtractParamsWithSlash<Path> = Path extends `/${infer PathWithoutSlash}`
  ? ExtractParams<PathWithoutSlash>
  : {};

type Foo1 = ExtractParamsWithSlash<'/card'>;
type Foo2 = ExtractParamsWithSlash<'/card/:cardId/:testId'>;
type A = Omit<Foo2, never>;
