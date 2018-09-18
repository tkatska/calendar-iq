function creatModal(calendarContainer, calendar) {
    var modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "exampleModal";

    modal.innerHTML =
        '<div class="modal-dialog">'+
            '<div class="modal-content">'+
                '<div class="modal-header">'+
                    '<h4 class="modal-title">Events on</h4>'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
                '<div class="modal-body" id="modalBody">'+
                '</div>'+
                '<div id="eventHolder" class="form-group">'+
                    '<label for="message-text" class="col-form-label">Title:</label>'+
                    '<input class="form-control" id="message-text" />'+
                    '<button type="button" id="addEvent" class="btn btn-primary float-right m-2">Add</button>'+
                '</div>'+
                '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                '</div>'+
            '</div>'+
        '</div>';
    calendarContainer.appendChild(modal);

    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var day = button.data('events');
        calendar.selectedDay = day;
        getForcastForSelectedDate();
        var modal = $(this);
        modal.find('.modal-body').empty();
        modal.find('.modal-title').text('Events on ' + calendar.SelectedMonth.MonthLocalString + " " + day + ", " + calendar.SelectedMonth.Year);
        displayTemperature();
        displayEvents();
        createDropdownFromTypes();
    });

    $('#addEvent').click(function () {
        var event = $('#message-text').val();
        var events;
        var index = 0;
        var eventType = $('#typeSelect option:selected').val();
        if (event) {
            $('#message-text').val("");

            if (typeof calendar.eventsThisMonth !== 'undefined') {
                events = calendar.eventsThisMonth.get(calendar.selectedDay);
            }
            var newEvent = {
                date: new Date(calendar.SelectedMonth.Year, calendar.SelectedMonth.Month, calendar.selectedDay),
                eventTitle: event,
                type: eventType
            };
            if (typeof events !== 'undefined') {
                events.push(newEvent);
                index = events.length - 1;
            } else { // TODO add validation for year containing map for events
                calendar.events.get(calendar.SelectedMonth.Year).get(calendar.SelectedMonth.Month + 1).set(calendar.selectedDay, [newEvent]);
            }

            addEventElement(index, calendar.eventTypes[newEvent.type], newEvent.date, newEvent.eventTitle);
        }
    });

    $('#exampleModal').on('hidden.bs.modal', function () {
        createCalendar(calendar, calendarContainer, 0);
    });

    function displayTemperature() {
        forcast = document.createElement("div");
            forcast.id = "forcast";
            
        if (calendar.SelectedForcast !== null) {
            forcast.innerHTML = "Today's temperature forecast for " + calendar.city + " is: " + calendar.SelectedForcast.low + "C to " + calendar.SelectedForcast.high + "C, " + calendar.SelectedForcast.text;
        } else{
            forcast.innerHTML = "No forecast for today";
        }
        document.getElementById('modalBody').appendChild(forcast);
    }

    function displayEvents() {
        var events;
        if (typeof calendar.eventsThisMonth !== 'undefined') {
            events = calendar.eventsThisMonth.get(calendar.selectedDay);
        }
        if (typeof events !== 'undefined') {
            events.forEach(function (event, index) {
                addEventElement(index, calendar.eventTypes[event.type], event.date, event.eventTitle);
            });
        }
    }

    function addEventElement(index, eventType, date, eventTitle) {
        var eventElement = document.createElement("div");
        eventElement.id = "event" + index;
        eventElement.className = eventType;
        eventElement.addEventListener('click', function () {
            removeEvent(index);
        });
        eventElement.innerHTML = '<div class="float-left">' + eventType + ': ' + date.toLocaleDateString() + ': ' + eventTitle + '</div>' +
            '<button type="button" class="close float-right">&times;</button><br/>';
        document.getElementById('modalBody').appendChild(eventElement);
    }

    function removeEvent(index) {
        calendar.eventsThisMonth.get(calendar.selectedDay).splice(index, 1);
        $("#event" + index).remove();
    }

    function createDropdownFromTypes() {
        select = document.createElement("select");
        select.id = "typeSelect";
        select.className = "custom-select";
        for (var i = 0; i < Object.keys(calendar.eventTypes).length; i++) {
            var op = new Option();
            op.value = i;
            op.text = calendar.eventTypes[i];
            select.options.add(op);
        }
        document.getElementById('eventHolder').appendChild(select);
    }

    function getForcastForSelectedDate() {
        if (calendar.selectedDay >= calendar.UserDate.Day) {
            var index = calendar.selectedDay - calendar.UserDate.Day;
            if (calendar.Forcast.length > index) {
                calendar.SelectedForcast = calendar.Forcast[calendar.selectedDay - calendar.UserDate.Day].item.forecast;
            }
        }
    }
}