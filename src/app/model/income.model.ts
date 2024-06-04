export interface Income {
  id?: number;
  datePlanned: Date;
  dateCreated: Date;
  category: string;
  description: string;
  amount: number;
  type?: string;
}
