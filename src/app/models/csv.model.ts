export interface Bill {
  time: number;
  type: number;
  amount: number;
  category: string;
}
export interface Category {
  value: string;
  type: number; // 1: Income, 0: Expenditure
  text: string;
  amount?: number;
}
