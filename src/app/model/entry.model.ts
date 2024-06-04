export interface Entry {
  id?: number;
  datePlanned: Date;
  dateCreated: Date;
  category: any;
  description: string;
  amount: number;
  type?: string;
}
