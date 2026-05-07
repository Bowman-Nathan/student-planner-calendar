import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../models/calendar-event';
import { FirebaseService } from '../../services/firebase';

@Component({
  selector: 'app-event-tooltip',
  imports: [CommonModule],
  templateUrl: './event-tooltip.html',
  styleUrl: './event-tooltip.css',
})
export class EventTooltip {

  @Input() event?: CalendarEvent;

  constructor(private firebaseService: FirebaseService) {}

  async deleteEvent(): Promise<void> {

    if (!this.event?.id) return;

    const confirmed = confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) return;

    await this.firebaseService.deleteEvent(this.event.id);

    location.reload();
  }

}