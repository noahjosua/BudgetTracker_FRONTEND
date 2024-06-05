export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function getCategoryForBackend(selectedCategory: string) {
  switch (selectedCategory) {
    case 'Gehalt':
      return 'SALARY';
    case 'Taschengeld':
      return 'POCKET_MONEY';
    case 'Unterhalt':
      return 'ALIMENT';
    case 'Kapitalvermögen':
      return 'CAPITAL_ASSETS';
    case 'Vermietung':
      return 'RENTAL';
    case 'Lebensmittel':
      return 'GROCERIES';
    case 'Drogerie':
      return 'DRUGSTORE';
    case 'Freizeit':
      return 'FREE_TIME';
    case 'Miete':
      return 'RENT';
    case 'Versicherung':
      return 'INSURANCE';
    case 'Abonnement':
      return 'SUBSCRIPTIONS';
    case 'Bildung':
      return 'EDUCATION';
    case 'Sonstiges':
      return 'OTHER';
    default:
      return 'OTHER';
  }
}
