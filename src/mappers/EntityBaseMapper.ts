import { EntityPropertyMutator } from '@common/modules/Entity/helpers';
import { TEntityValueAcceptor } from '@common/modules/Entity/types';
import { INewable } from '@common/modules/Util/types';

export abstract class EntityBaseMapper<Model extends object = object, Input = any, Output = Input> {

  public abstract readonly ModelCtor: INewable<Model>;

  constructor(
    private valueMutator: EntityPropertyMutator,
    private valueAcceptor: TEntityValueAcceptor,
  ) {}

  public mapFrom(data: Input, index: number = 0): Model {
    return this.hydrateModel(this.mapToModel(data, index));
  }

  public mapIterableFrom(data: Input[]): Model[] {
    return Array.from(data).map((item, index) => this.mapFrom(item, index));
  }

  public mapTo(model: Model, index: number = 0, ...args: any[]): Output {
    return this.mapFromModel(model, index, ...args);
  }

  public mapIterableTo(model: Model[], ...args: any[]): Output[] {
    return Array.from(model).map((item, index) => this.mapTo(item, index, ...args));
  }

  protected abstract mapToModel(data: Input, index: number): Partial<Model>;

  protected abstract mapFromModel(model: Model, index: number, ...args: any[]): Output;

  private hydrateModel(mappedData: Partial<Model>): Model {
    return Object.entries(mappedData).reduce(
      (model: Model, [key, value]) => {
        const name = key as keyof Model;
        if (this.valueAcceptor(value)) {
          model[name] = this.valueMutator.mutate(this.ModelCtor, name, value);
        }
        return model;
      },
      new this.ModelCtor(),
    );
  }

}
