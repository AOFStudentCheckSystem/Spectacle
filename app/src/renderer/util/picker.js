/**
 * Created by dummy on 4/17/17.
 */
export const datePicker = (element, container, changeCallback, dateObj) => {
    const today = dateObj || new Date()
    return {
        input: element,
        // container: container,
        toolbar: false,
        rotateEffect: true,

        value: [String(today.getMonth()), today.getDate(), today.getFullYear()],

        onChange: function (picker, values, displayValues) {
            let daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate()
            if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth)
            }
            changeCallback(picker, values, displayValues)
        },
        formatValue: function (p, values, displayValues) {
            return displayValues[0] + ' ' + values[1] + ', ' + values[2]
        },
        cols: [
            // Months
            {
                values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                displayValues: ('January February March April May June July August September October November December').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            },
            // Years
            {
                values: (function () {
                    let arr = []
                    for (let i = 1950; i <= 2030; i++) {
                        arr.push(i)
                    }
                    return arr
                })()
            }
        ]
    }
}

export const timePicker = (element, container, changeCallback, dateObj) => {
    const today = dateObj || new Date()
    return {
        input: element,
        // container: container,
        toolbar: false,
        rotateEffect: true,
        value: [today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
        formatValue: function (p, values, displayValues) {
            return displayValues[0] + ':' + values[1]
        },
        onChange: changeCallback,
        cols: [
            // Hours
            {
                values: (function () {
                    let arr = []
                    for (let i = 0; i <= 23; i++) {
                        arr.push(i)
                    }
                    return arr
                })()
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    let arr = []
                    for (let i = 0; i <= 59; i++) {
                        arr.push(i < 10 ? '0' + i : i)
                    }
                    return arr
                })()
            }
        ]
    }
}
