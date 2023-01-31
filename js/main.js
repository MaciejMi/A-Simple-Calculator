const numberBtns = document.querySelectorAll("[data-mode='number']")
const optionBtns = document.querySelectorAll("[data-mode='option']")
const operatorBtns = document.querySelectorAll("[data-mode='operator']")

const currentPrompt = document.querySelector("[data-type='current']")
const logPrompt = document.querySelector("[data-type='log']")
const warningPrompt = document.querySelector("[data-type='warning']")

let previousResult = ''
let enteredNumber = ''
let last_operation = null

const updateResult = () => {
	currentPrompt.textContent = enteredNumber
	if (last_operation != null) {
		logPrompt.textContent = previousResult + last_operation
	} else {
		logPrompt.textContent = ''
	}
}

const removeLastCharacter = () => {
	enteredNumber = enteredNumber.toString().slice(0, -1)
	updateResult()
}

const clearAll = () => {
	enteredNumber = ''
	previousResult = ''
	last_operation = null
	updateResult()
}

const clearEnteredNumber = () => {
	enteredNumber = ''
	updateResult()
}

const calculate = () => {
	let result = 0
	if (!previousResult || !enteredNumber) {
		return
	}

	const previous = parseFloat(previousResult)
	const entered = parseFloat(enteredNumber)

	if (isNaN(previous) || isNaN(entered)) {
		return
	}

	switch (last_operation) {
		case '+':
			result = previous + entered
			break
		case '-':
			result = previous - entered
			break
		case '×':
			result = previous * entered
			break
		case '÷':
			if (entered == 0) {
				clearAll()
				warningPrompt.textContent = 'Nie dziel przez zero!'
				return
			}
			result = previous / entered
			break
	}

	if (previous.toString().includes('.') || entered.toString().includes('.')) {
		result = Math.round(result * 100) / 100
	}

	enteredNumber = result
	last_operation = null
	previousResult = ''
}

const chooseOperation = operator => {
	if (enteredNumber === '') {
		return
	}
	if (previousResult !== '') {
		const previous = logPrompt.innerText
		if (enteredNumber.toString() === '0' && previous[previous.length - 1] === '÷') {
			clearAll()
			warningPrompt.textContent = 'Nie dziel przez zero!'
			return
		}
		calculate()
	}

	last_operation = operator
	previousResult = enteredNumber
	enteredNumber = ''
}

numberBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		if (enteredNumber.length < 20) {
			if (btn.textContent == '.') {
				if (!enteredNumber.includes('.') && enteredNumber.length > 0) {
					enteredNumber += '.'
				}
			} else {
				if (currentPrompt.textContent == '0') {
					enteredNumber = btn.textContent
				} else {
					enteredNumber += btn.textContent
				}
			}
			warningPrompt.textContent = ''
			currentPrompt.textContent = enteredNumber
		}
	})
})

document.addEventListener('keydown', e => {
	warningPrompt.textContent = ''
	if (enteredNumber.length < 20) {
		for (let i = 0; i < 10; i++) {
			if (e.key == `${i}`) {
				if (currentPrompt.textContent == '0') {
					enteredNumber = i
				} else {
					enteredNumber += i
				}
			}
		}
		if (e.key == '.') {
			if (!enteredNumber.includes('.') && enteredNumber.length > 0) {
				enteredNumber += '.'
			}
		}
	}
	switch (e.key) {
		case '=':
			calculate()
			break
		case '+':
			chooseOperation('+')
			break
		case '-':
			chooseOperation('-')
			break
		case '/':
			chooseOperation('÷')
			break
		case '*':
			chooseOperation('×')
			break
	}

	if (e.key == 'Backspace' || e.key == 'Delete') {
		removeLastCharacter()
	}
	updateResult()
})

optionBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		switch (btn.textContent) {
			case 'CE':
				clearEnteredNumber()
				break
			case 'C':
				clearAll()
				break
			case '':
				removeLastCharacter()
				break
			case '=':
				calculate()
				updateResult()
		}
	})
})

operatorBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		chooseOperation(btn.textContent)
		updateResult()
	})
})
