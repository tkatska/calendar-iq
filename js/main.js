class Calendar {
    constructor(events, date) {
        this.events = events;
        this.weeksPerMonth = 6;
        this.daysPerWeek = 7;
        this.locale = "en-us";
        this.calendarHeaderElements = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.eventTypes = Object.freeze({
            0: "Appointment",
            1: "Task",
            2: "Meeting"
        });

        this.UserDate = new Date();
        this.UserDate.MonthLocalString = this.UserDate.toLocaleString(this.locale, {
            month: "long"
        });
        this.UserDate.Year = this.UserDate.getFullYear();
        this.UserDate.Day = this.UserDate.getDate();

        this.SelectedMonth = date;
        this.SelectedMonth.FirstDay = new Date(this.SelectedMonth.getFullYear(), this.SelectedMonth.getMonth(), 1).getDay();
        this.SelectedMonth.Days = getDaysInMonth(this.SelectedMonth.getFullYear(), this.SelectedMonth.getMonth() + 1, 0);
        this.SelectedMonth.Month = this.SelectedMonth.getMonth();
        this.SelectedMonth.MonthLocalString = this.SelectedMonth.toLocaleString(this.locale, {
            month: "long"
        });
        this.SelectedMonth.Year = this.SelectedMonth.getFullYear();
        this.PrevMonthNumberOfDays = getDaysInMonth(this.SelectedMonth.getFullYear(), this.SelectedMonth.getMonth(), 0);

        this.SelectedSameAsToday = this.UserDate.MonthLocalString === this.SelectedMonth.MonthLocalString &&
            this.UserDate.Year === this.SelectedMonth.Year;

        this.daysFromPrevMonthToShow = getDaysFromPrevMonthToShow(this.PrevMonthNumberOfDays, this.SelectedMonth.FirstDay);
        this.eventsThisMonth = getEvents(this.events, this.SelectedMonth);
        this.selectedDay = 0;
        this.Forcast = [];
        this.SelectedForcast = null;
        this.city = "Vancouver";
        getForcast(this.city, this);
    }
}

// Re-Create calendar on every month load
function createCalendar(calendar, calendarContainer, direction) {
    if (typeof direction !== 'undefined') {
        var selectedMonth = new Date(calendar.SelectedMonth.Year, calendar.SelectedMonth.Month + direction, 1);
        calendar = new Calendar(calendar.events, selectedMonth);
        calendarContainer.innerHTML = '';
    }

    function createNavigation() {
        var navCell = document.createElement("div");
        navCell.className = 'row';
        navCell.id = 'navigation';
        navCell.innerHTML = calendar.SelectedMonth.MonthLocalString + " " + calendar.SelectedMonth.Year;
        calendarContainer.appendChild(navCell);

        // go back
        var back = document.createElement("div");
        back.className = 'ml-auto';
        back.addEventListener('click', function () {
            createCalendar(calendar, calendarContainer, -1);
        });
        back.innerHTML = '<div><i class="fas fa-chevron-left"></i></div>';
        document.getElementById('navigation').appendChild(back);

        // go forward
        var forward = document.createElement("div");
        forward.addEventListener('click', function () {
            createCalendar(calendar, calendarContainer, 1);
        });
        forward.innerHTML = '<div><i class="fas fa-chevron-right"></i></div>';
        document.getElementById('navigation').appendChild(forward);
    }

    function createHeader() {
        var gridCell = document.createElement("div");
        gridCell.className = 'grid-calendar';
        gridCell.id = 'header';
        calendarContainer.appendChild(gridCell);

        var headerCell = document.createElement("div");
        headerCell.className = 'row calendar-week-header';
        calendar.calendarHeaderElements.forEach(element => {
            headerCell.innerHTML += '<div class="col-xs-1 grid-cell"><div><div><span>' + element + '</span></div></div></div>';
        });
        document.getElementById('header').appendChild(headerCell);
    }

    function addWeeks() {
        var counter = 1; // first day of the month
        var nextWeekDays = 1;
        var prevWeekAdded = false;

        for (i = 0; i < calendar.weeksPerMonth; i++) {
            var weekRow = document.createElement("div");
            weekRow.className = 'row calendar-week';
            for (f = 0; f < calendar.daysPerWeek; f++) {
                if (!prevWeekAdded) {
                    addPrevMonthDays(weekRow, calendar.daysFromPrevMonthToShow);
                    f = f + calendar.daysFromPrevMonthToShow.length;
                }
                prevWeekAdded = true;
                var weekDay = document.createElement("div");
                if (counter <= calendar.SelectedMonth.Days) {
                    var eventsInThisDay = getEventsInThisDay(calendar.eventsThisMonth, counter);

                    weekDay.className = 'col-xs-1 grid-cell';
                    weekDay.id = 'day_' + counter;
                    weekDay.innerHTML = '<span class="eventCount">' + eventsInThisDay + '</span><div><div>' +
                        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-events=' + counter + '>' + counter + '</button>' +
                        '</div></div>';
                    counter++;
                } else {
                    weekDay.className = 'col-xs-1 grid-cell next-month';
                    weekDay.innerHTML = "<div><div><a>" + nextWeekDays + "</a></div></div>";
                    nextWeekDays++;
                }
                weekRow.appendChild(weekDay);
            }
            document.getElementById('header').appendChild(weekRow);
        }
    };

    function addPrevMonthDays(weekRow, daysFromPrevMonthToShow) {
        for (var i = daysFromPrevMonthToShow.length - 1; i >= 0; i--) {
            var weekDay = document.createElement("div");
            weekDay.className = 'col-xs-1 grid-cell previous-month';
            weekDay.innerHTML = "<div><div><span>" + daysFromPrevMonthToShow[i] + "</span></div></div>";
            weekRow.appendChild(weekDay);
        }
    };

    createNavigation();
    createHeader();
    addWeeks();
    creatModal(calendarContainer, calendar);

    // highlight current day
    if (calendar.SelectedSameAsToday) {
        document.getElementById('day_' + (new Date()).getDate()).className += ' currentDay';
    }
}

var getEventsInThisDay = function (eventsThisMonth, day) {
    if (typeof eventsThisMonth !== 'undefined' && eventsThisMonth.has(day)) {
        var eventsToday = eventsThisMonth.get(day);
        if (typeof eventsToday !== 'undefined') {
            return "Events: " + eventsToday.length;
        }
    }
    return '';
}

var getDaysFromPrevMonthToShow = function (prevMonthNumberOfDays, selectedMonthFirstDay) {
    var prevMonthDays = [];
    for (i = 0; i < selectedMonthFirstDay; i++) {
        prevMonthDays[i] = prevMonthNumberOfDays;
        prevMonthNumberOfDays--;
    }
    return prevMonthDays;
};

var getDaysInMonth = function (year, month) {
    return new Date(year, month, 0).getDate();
};

var getEvents = function (events, selectedMonth) {
    var eventsThisYear = events.get(selectedMonth.Year);
    if (typeof eventsThisYear !== 'undefined') {
        var monthEvents = eventsThisYear.get(selectedMonth.Month + 1);
        if (typeof monthEvents !== 'undefined') {
            return monthEvents;
        }else{
            var monthEventsNew = new Map();
            eventsThisYear.set(selectedMonth.Month + 1, monthEventsNew);
            return monthEventsNew;
        }
    }
   
};

var getForcast = function (city, calendar) {
    var searchtext = "select item.forecast from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'";

    $.ajax({
        url: "https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var jsonobject = data.query.results.channel;
            calendar.Forcast = jsonobject;
        }
    });

};

var calendar = function (events, calendarContainer) {
    var calendar = new Calendar(events, new Date());
    createCalendar(calendar, calendarContainer);
};