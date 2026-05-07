import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../models/calendar-event';


@Component({
  selector: 'app-event-form',
  imports:[CommonModule, FormsModule],

  templateUrl: './event-form.html',
  styleUrl: './event-form.css'
})

export class EventForm implements OnChanges {

  //Recieves the selected date from the parent calendar page
  @Input() selectedDate!: Date;

  //Recieves the event being edited from the parent calendar page (if applicable)
  @Input() editingEvent?: CalendarEvent;

  //Sends a cancel message back to the parent page
  @Output() cancelForm = new EventEmitter<void>();

  @Output() saveNewEvent = new EventEmitter<CalendarEvent>();

  timeOptions: string [] = [
    '7:00 AM',
    '7:30 AM',
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM'
  ];

  colorOptions: string[] = [
    'yellow',
    'green',
    'red',
    'purple',
    'orange'
  ];

  //Stores form input values
  title: string = '';
  startTime: string = '8:00 AM';
  endTime: string = '9:00 AM';
  color: string = 'blue';
  details: string = '';

  //Temp saving point for test
  saveEvent(): void {
      const newEvent: CalendarEvent = {

        id: this.editingEvent?.id,
        
        title: this.title, 
        date: this.selectedDate.toDateString(),
        startTime: this.startTime,
        endTime: this.endTime,
        color: this.color,
        details: this.details
      };
    this.saveNewEvent.emit(newEvent);

  }

  cancel(): void{
    this.cancelForm.emit();
  }

  ngOnChanges(): void {

  if (this.editingEvent) {

    this.title = this.editingEvent.title;
    this.startTime = this.editingEvent.startTime;
    this.endTime = this.editingEvent.endTime;
    this.color = this.editingEvent.color;
    this.details = this.editingEvent.details;

  }

}

  

}
