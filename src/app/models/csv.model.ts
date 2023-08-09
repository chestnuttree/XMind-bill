export interface Bill {
  time: number;
  type: number;
  category?: string;
  amount: number;
}
export interface Category {
  id: string;
  type: number; // 0: Income, 1: Expenditure
  name: string;
}
