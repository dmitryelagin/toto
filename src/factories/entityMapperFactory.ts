import { createEntityPropertyMutator } from '@common/modules/Entity/factories';
import { EntityPropertyMutator } from '@common/modules/Entity/helpers';
import { EntityBaseMapper } from '@common/modules/Entity/mappers';
import { TEntityValueAcceptor } from '@common/modules/Entity/types';
import { INewable } from '@common/modules/Util/types';

export const createEntityMapper = <Model extends object = object, Input = any, Output = Input>(
  ModelCtor: INewable<Model>,
) => class EntityMapper extends EntityBaseMapper<Model, Input, Output> {

  public readonly ModelCtor: INewable<Model> = ModelCtor;

  constructor(
    valueMutator: EntityPropertyMutator = createEntityPropertyMutator(),
    valueAcceptor: TEntityValueAcceptor = value => value != null,
  ) {
    super(valueMutator, valueAcceptor);
  }

  public mapToModel(_data: Input, _index: number): Partial<Model> {
    throw new Error(`Method [mapToModel] of [${
      this.constructor.name
    }] mapper was not implemented.`);
  }

  public mapFromModel(_model: Model, _index: number, ..._args: any[]): Output {
    throw new Error(`Method [mapFromModel] of [${
      this.constructor.name
    }] mapper was not implemented.`);
  }

};
