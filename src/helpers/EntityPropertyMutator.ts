import { EntityBaseMapper } from '@common/modules/Entity/mappers';
import { TEntityValueMutator } from '@common/modules/Entity/types';
import { entityMetadataKeyMap } from '@common/modules/Entity/values';
import { INewable } from '@common/modules/Util/types';

export class EntityPropertyMutator {

  private mutators: Map<INewable<object>, TEntityValueMutator> = new Map();

  public mutate<Model extends object>(
    ModelCtor: INewable<Model>,
    key: keyof Model,
    value: any,
  ): any {
    const prop = (typeof key === 'symbol') ? key : key.toString();
    let type = Reflect.getMetadata('design:type', ModelCtor.prototype, prop);
    type = entityMetadataKeyMap.has(type)
      ? Reflect.getMetadata(entityMetadataKeyMap.get(type), ModelCtor.prototype, prop)
      : type;
    return this.mutators.has(type) ? this.mutators.get(type)!(value) : value;
  }

  public addMutator<Model extends object>(
    mutator: TEntityValueMutator<Model> | EntityBaseMapper<Model>,
    type?: INewable<Model>,
  ): EntityPropertyMutator {
    if (mutator instanceof EntityBaseMapper) {
      this.setMapperMutator(mutator);
    } else if (typeof mutator === 'function' && type != null) {
      this.setValueMutator(mutator, type);
    }
    return this;
  }

  public removeMutator<Model extends object>(type: INewable<Model>): EntityPropertyMutator {
    this.mutators.delete(type);
    return this;
  }

  private setValueMutator(mutator: TEntityValueMutator, type: INewable<object>): void {
    this.mutators.set(type, value => (
      Array.isArray(value) ? value.map(mutator) : mutator(value)
    ));
  }

  private setMapperMutator(mutator: EntityBaseMapper): void {
    this.mutators.set(mutator.ModelCtor, value => (
      Array.isArray(value) ? mutator.mapIterableFrom(value) : mutator.mapFrom(value)
    ));
  }

}
