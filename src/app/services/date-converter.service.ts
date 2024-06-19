import {Injectable} from "@angular/core";
import {Entry} from "../model/entry.model";

@Injectable({providedIn: 'root'})
export class DateConverterService {

  // Method to convert a Date to a string in the format 'YYYY-MM-DD'
  convertToDateString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Method to convert a Date to a string in the format 'DD.MM.YYYY'
  convertToEUFormat(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
  }

  // Method to handle CEST to UTC conversion from frontend to backend
  setTime(entry: Entry) {
    const date = entry.dateCreated;
    entry.datePlanned.setHours(date.getHours());
    entry.datePlanned.setMinutes(date.getMinutes());
    entry.datePlanned.setSeconds(date.getSeconds());
    return entry;
  }

}
