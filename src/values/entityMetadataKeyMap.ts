import { INewable } from '@common/modules/Util/types';

export const entityMetadataKeyMap = new Map<INewable<any>, string>([
  [Array, 'app:arraytype'],
  [Object, 'app:objecttype'],
]);
