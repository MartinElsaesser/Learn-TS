type Arr = ["0", "1", "2", "3"];
type Iterate<Arr extends string[], Count extends number = 0, Collect extends string[] = []> =
	Arr extends [infer F extends string, ...infer R extends string[]] ?
		Iterate<R, Add<Count, 1> & number, [...Collect, `${F}:${Count}`]>
	:	Collect;

type l = Iterate<Arr>;
//   ^?
