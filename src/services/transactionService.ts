import { Transaction } from '@/models';

export default class TransactionService {
  async filterByType(type: string) {
    return await Transaction.query().where('type', type);
  }

  async filterByDateRange(startDate: Date, endDate: Date) {
    return await Transaction.query().whereBetween('date', [startDate, endDate]);
  }

  async filterByTag(tag: string) {
    return await Transaction.query().where('tag', tag);
  }

  async filterByDay(day: number) {
    const startDate = new Date();
    startDate.setDate(day);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(day);
    endDate.setHours(23, 59, 59, 999);
    return await Transaction.query().whereBetween('date', [startDate, endDate]);
  }

  async filterByMonth(month: number) {
    const startDate = new Date();
    startDate.setMonth(month - 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setMonth(month);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
    return await Transaction.query().whereBetween('date', [startDate, endDate]);
  }

  async filterByYear(year: number) {
    const startDate = new Date();
    startDate.setFullYear(year);
    startDate.setMonth(0);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setFullYear(year);
    endDate.setMonth(11);
    endDate.setDate(31);
    endDate.setHours(23, 59, 59, 999);
    return await Transaction.query().whereBetween('date', [startDate, endDate]);
  }
}
