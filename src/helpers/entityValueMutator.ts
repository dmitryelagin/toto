import { TEntityValueMutator } from '@common/modules/Entity/types';

export const asArray: TEntityValueMutator<any[]> = (value) => {
  throwEmpty(value);
  return Array.isArray(value) ? value : Array.from(value);
};

export const asBoolean: TEntityValueMutator<boolean> = (value) => {
  throwEmpty(value);
  return Boolean(value);
};

export const asDate: TEntityValueMutator<Date> = (value) => {
  throwEmpty(value);
  const date = (value instanceof Date)
    ? value
    : new Date(isNaN(value) ? asString(value) : asInteger(value));
  if (!Number.isNaN(date.getDate())) {
    return date;
  }
  throw new TypeError('A value can not be converted to date.');
};

export const asInteger: TEntityValueMutator<number> = (value) => {
  throwEmpty(value);
  const result = (typeof value === 'number') ? value : asNumber(value);
  return Number.isInteger(result) ? result : Math.round(result);
};

export const asNumber: TEntityValueMutator<number> = (value) => {
  throwEmpty(value);
  const result = (typeof value === 'number') ? value : Number.parseFloat(asString(value));
  if (!Number.isNaN(result)) {
    return result;
  }
  throw new TypeError('Value can not be converted to number.');
};

export const asString: TEntityValueMutator<string> = (value) => {
  throwEmpty(value);
  return String(value);
};

function throwEmpty(value: any): void {
  if (value == null) {
    throw new TypeError('Value to convert should not be null or undefined.');
  }
}
