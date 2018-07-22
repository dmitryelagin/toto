import { INewable } from '@common/modules/Util/types';

export function entityFactory(target: any, prop: string, descriptor: PropertyDescriptor): void {
  if (typeof descriptor.value !== 'function') {
    throw new Error(`Can not create factory from non-callable [${prop}] property.`);
  }
  const method: Function = descriptor.value;
  const ModelCtor: INewable<object> = Reflect.getMetadata('design:returntype', target, prop);
  if (typeof ModelCtor !== 'function') {
    throw new Error(`Can not create factory if [${prop}] return type is not a constructor.`);
  }
  descriptor.value = function(this: typeof Function, ...args: any[]): any {
    return Object.assign(new ModelCtor(), method.apply(this, args));
  };
}
