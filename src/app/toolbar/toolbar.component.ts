import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  /* holds the selected date */
  currentDate: Date = new Date();

  /* Output to AppComponent */
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();

  /**
   * Moves the current date to the previous month and emits an event with the updated date.
   * Updates 'currentDate' to the first day of the previous month.
   */
  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.emitDateChanged();
  }

  /**
   * Moves the current date to the next month and emits an event with the updated date.
   * Updates 'currentDate' to the first day of the next month.
   */
  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.emitDateChanged();
  }

  /**
   * Emits an event with the current date when it has been changed.
   * Emits the 'currentDate' via the 'dateChanged' event emitter.
   */
  private emitDateChanged() {
    this.dateChanged.emit(this.currentDate);
  }
}
