import {TranslateService} from "@ngx-translate/core";
import {Constants} from "./constants";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function translateCategories(categories: any[], translatedCategories: any[], translate: TranslateService) {
  const categoryNames = categories.map(c => c.name.toLowerCase());
  for (const category of categoryNames) {
    translate.get(Constants.CATEGORIES_KEY + category).subscribe(translations => {
      translatedCategories.push({name: translations, value: category.toUpperCase()});
    });
  }
  return translatedCategories;
}
