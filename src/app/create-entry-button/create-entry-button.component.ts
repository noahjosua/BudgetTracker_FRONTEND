import {Component, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-create-entry-button',
  templateUrl: './create-entry-button.component.html'
})
export class CreateEntryButtonComponent implements OnChanges {

  isDialogVisible: boolean = false;
  title = "Neuer Eintrag";

  /* Input from AppComponent */
  @Input() currentDate: any;

  /* holds the value of the currentDate from the AppComponent */
  selectedDate: any;

  onOpenDialog() {
    this.isDialogVisible = true;
  }

  /**
   * Responds to changes in input properties.
   * Updates the 'selectedDate' property if the 'currentDate' input changes.
   *
   * @param changes - Object containing the changed properties mapped by property name.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }
  }
}
