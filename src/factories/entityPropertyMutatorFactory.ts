import {
  asArray,
  asBoolean,
  asDate,
  asNumber,
  asString,
  EntityPropertyMutator,
} from '@common/modules/Entity/helpers';
import { EntityBaseMapper } from '@common/modules/Entity/mappers';
import { TEntityValueMutator } from '@common/modules/Entity/types';
import { INewable } from '@common/modules/Util/types';

export function createEntityPropertyMutator(
  mutations: (
    Map<INewable<object>, TEntityValueMutator | EntityBaseMapper> | EntityBaseMapper[]
  ) = [],
): EntityPropertyMutator {
  const valueMutator = (new EntityPropertyMutator())
    .addMutator(asArray, Array)
    .addMutator(asBoolean, Boolean)
    .addMutator(asDate, Date)
    .addMutator(asNumber, Number)
    .addMutator(asString, String);
  if (Array.isArray(mutations)) {
    mutations.forEach(mutator => valueMutator.addMutator(mutator));
  } else {
    mutations.forEach((mutator, type) => valueMutator.addMutator(mutator, type));
  }
  return valueMutator;
}
