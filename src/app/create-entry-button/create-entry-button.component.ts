import {Component, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-create-entry-button',
  templateUrl: './create-entry-button.component.html',
  styleUrl: './create-entry-button.component.css'
})
export class CreateEntryButtonComponent implements OnChanges{

  isDialogVisible: boolean = false;
  title = "Neuer Eintrag";
  @Input() currentDate: any;
  selectedDate: any;

  onOpenDialog() {
    this.isDialogVisible = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }
  }
}
