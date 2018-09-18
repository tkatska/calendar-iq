// Event simple data
var events16 = [{
        date: new Date(2018, 8, 16),
        eventTitle: 'Test 16',
        type: 1
    },
    {
        date: new Date(2018, 8, 16),
        eventTitle: 'Test 162',
        type: 2
    },
    {
        date: new Date(2018, 8, 16),
        eventTitle: 'Test 163',
        type: 0
    }
];
var events22 = [{
        date: new Date(2018, 8, 22),
        eventTitle: 'Test 22',
        type: 2
    },
    {
        date: new Date(2018, 8, 22),
        eventTitle: 'Test 222',
        type: 1
    }
];
var dayEvents = new Map();
dayEvents.set(16, events16);
dayEvents.set(22, events22);

var monthEvents = new Map();
monthEvents.set(9, dayEvents);

var eventsMap = new Map();
eventsMap.set(2018, monthEvents);


// create calendar
calendar(eventsMap, document.getElementById('calendar'));