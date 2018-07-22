import { entityMetadataKeyMap } from '@common/modules/Entity/values';
import { INewable } from '@common/modules/Util/types';

export function pt(target: any, prop: string): any;
export function pt(detailedType: INewable<any>): PropertyDecorator;
export function pt(
  detailedType: INewable<any> | Function | Object,
  key?: string,
): PropertyDecorator | void {
  if (key != null) return;
  return (target, prop) => {
    const type = Reflect.getMetadata('design:type', target, prop);
    if (entityMetadataKeyMap.has(type)) {
      Reflect.defineMetadata(entityMetadataKeyMap.get(type), detailedType, target, prop);
    }
  };
}
