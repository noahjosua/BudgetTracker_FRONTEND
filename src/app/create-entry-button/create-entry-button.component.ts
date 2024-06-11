import {Component} from '@angular/core';

@Component({
  selector: 'app-create-entry-button',
  templateUrl: './create-entry-button.component.html',
  styleUrl: './create-entry-button.component.css'
})
export class CreateEntryButtonComponent {

  isDialogVisible: boolean = false;
  title = "Neuer Eintrag"

  onOpenDialog() {
    this.isDialogVisible = true;
  }
}
