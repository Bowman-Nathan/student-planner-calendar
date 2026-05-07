import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FirebaseService } from '../../services/firebase';
import { CommonModule } from '@angular/common';
import { MonthView } from '../../components/month-view/month-view';
import { EventForm } from '../../components/event-form/event-form';
import { CalendarEvent } from '../../models/calendar-event';
import { Weather } from '../../weather';


@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MonthView, EventForm],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})

//gives the calendar page access to the Firebase user login data
export class Calendar implements OnInit {

  //Stores the moth currently being displayed
  currentDate: Date = new Date();

  //Stores the day currently selected by the user
  selectedDate: Date = new Date();

  //turns add even on and off for visiblity
  showEventForm: boolean = false;

  events: CalendarEvent[] =[];

  // Stores the event currently being edited
  editingEvent?: CalendarEvent;

  //temperature used from the weatherservice component
  temp: number | null = null;

  constructor(
    public firebaseService: FirebaseService,
    private router:  Router,
    private weatherService: Weather
  ) {}

async ngOnInit(): Promise<void> {

  this.weatherService.getTemperature().subscribe({
      next: temp => {
        this.temp = temp;
      },
      error: err => {
        console.error('Weather API failed:', err);
      }
    });

  const waitForUser = setInterval(async () => {

    const currentUser = this.firebaseService.currentUser;

    if (currentUser) {

      this.events = await this.firebaseService.getUserEvents(
        currentUser.uid
      );

      clearInterval(waitForUser);
    }

  }, 500);

}

  //moves the calendar back one month
  previousMonth(): void{
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() -1,
      1
    );
  }

  //moves the calendar forward one month
  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() +1,
      1
    );
  }

  //Updates the selected date when the child component sends a clicked day
  onDateSelected(date: Date): void{
    this.selectedDate = date;
  }

  //Logs the user out and returns to home page
  async logout(): Promise<void>{
    await this.firebaseService.logoutUser();

    this.router.navigate(['/']);
  }

  // Shows the add event 
  openEventForm(): void{
    this.showEventForm = true;
  }

  // Opens the edit form and populates it with the selected event's data
  openEditForm(event: CalendarEvent): void {

  this.editingEvent = event;

  this.selectedDate = new Date(event.date);

  this.showEventForm = true;
}

  // Hides the add event
  closeEventForm(): void {
    this.showEventForm = false;
  }

  // Saves a newly created event into Firestore and updates the UI
// Saves a newly created event into Firebase and updates the calendar UI
async addEvent(newEvent: CalendarEvent): Promise<void> {

  const currentUser = this.firebaseService.currentUser;

  if (!currentUser) {
    return;
  }

  const eventWithUser = {
    ...newEvent,
    userId: currentUser.uid
  };

  // EDIT EXISTING EVENT
  if (eventWithUser.id) {

    await this.firebaseService.updateEvent(
      eventWithUser.id,
      eventWithUser
    );

    // Update local UI array
    const index = this.events.findIndex(
      event => event.id === eventWithUser.id
    );

    if (index !== -1) {
      this.events[index] = eventWithUser;
    }

  }

  // CREATE NEW EVENT
  else {

    await this.firebaseService.saveEvent(eventWithUser);

    this.events.push(eventWithUser);
  }

  this.showEventForm = false;

  this.editingEvent = undefined;
}

}
