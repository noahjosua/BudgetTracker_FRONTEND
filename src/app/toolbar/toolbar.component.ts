import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  currentDate: Date = new Date();
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.emitDateChanged();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.emitDateChanged();
  }

  private emitDateChanged() {
    this.dateChanged.emit(this.currentDate);
  }
}
