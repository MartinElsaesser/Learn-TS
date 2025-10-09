for (let number1 = 0; number1 <= 9; number1++) {
	for (let number2 = 0; number2 <= 9; number2++) {
		const sum = number1 + number2;
		const carry = Math.floor(sum / 10);
		const digit = sum % 10;
		console.log(
			`expectTypeOf<{ carry: ${carry}; digit: ${digit}}>().toEqualTypeOf<AddWithoutCarry[${number1}][${number2}]>();`
		);
	}
}

for (let number1 = 0; number1 <= 9; number1++) {
	for (let number2 = 0; number2 <= 9; number2++) {
		for (let carryIn = 0; carryIn <= 9; carryIn++) {
			const sum = number1 + number2 + carryIn;
			const carry = Math.floor(sum / 10);
			const digit = sum % 10;
			console.log(
				`expectTypeOf<{ carry: ${carry}; digit: ${digit} }>().toEqualTypeOf<AddWithCarry<${number1},${number2},${carryIn}>>();`
			);
		}
	}
}
