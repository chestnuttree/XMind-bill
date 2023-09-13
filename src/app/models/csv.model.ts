export interface Bill {
  time: number;
  type: number;
  category?: string;
  amount: number;
}
export interface Category {
  value: string;
  type: number; // 0: Income, 1: Expenditure
  text: string;
  amount?: number;
}
