import { EntityBaseMapper } from '@common/modules/Entity/mappers';
import { INewable } from '@common/modules/Util/types';

type TFindPredicate<Value> = (value: Value, index: number, obj: Value[]) => boolean;
type TErrorLogger = (error: Error) => void;

class EntityResultSyntax<Result> {

  constructor(private results: (Result | Result[])[]) {}

  public get(config: number | TFindPredicate<Result | Result[]> = 0): Result | Result[] {
    const result = (typeof config === 'number')
      ? this.results[config]
      : this.results.find(config);
    if (result != null) return result;
    throw new Error(`Unable to find mapped entity with config: ${config}`);
  }

  public all(): (Result | Result[])[] {
    return this.results;
  }

}

class EntityFromSyntax<Model extends object> {

  private static modelError: symbol = Symbol('entityCompoundMapperFromSyntaxError');

  constructor(
    private mappers: EntityBaseMapper[],
    private ModelCtor: INewable<Model>,
    private logError: TErrorLogger,
  ) {}

  public from<Input = any>(data: Input | Input[]): EntityResultSyntax<Model> {
    return new EntityResultSyntax(
      this.mappers
        .filter((mapper): mapper is EntityBaseMapper<Model> => (
          mapper.ModelCtor === this.ModelCtor
        ))
        .map((mapper) => {
          try {
            return Array.isArray(data)
              ? mapper.mapIterableFrom(data)
              : mapper.mapFrom(data);
          } catch (error) {
            this.logError(new Error(`An error occurred in mapper's [mapFrom]: ${error}`));
            return EntityFromSyntax.modelError;
          }
        })
        .filter((model): model is Model => model !== EntityFromSyntax.modelError),
    );
  }

}

class EntityToSyntax<Model extends object> {

  private static modelError: symbol = Symbol('entityCompoundMapperToSyntaxError');

  constructor(
    private mappers: EntityBaseMapper[],
    private model: Model | Model[],
    private args: any[],
    private logError: TErrorLogger,
  ) {}

  public to<Output = any>(ModelCtor?: INewable<Model>): EntityResultSyntax<Output> {
    return new EntityResultSyntax(
      this.mappers
        .filter((mapper): mapper is EntityBaseMapper<Model> => (
          (this.model instanceof mapper.ModelCtor) || (mapper.ModelCtor === ModelCtor)
        ))
        .map((mapper) => {
          try {
            return Array.isArray(this.model)
              ? mapper.mapIterableTo(this.model, ...this.args)
              : mapper.mapTo(this.model, undefined, ...this.args);
          } catch (error) {
            this.logError(new Error(`An error occurred in mapper's [mapTo]: ${error}`));
            return EntityToSyntax.modelError;
          }
        })
        .filter(model => model !== EntityToSyntax.modelError),
    );
  }

}

export class EntityCompoundMapper {

  constructor(
    private mappers: EntityBaseMapper[],
    private logError: TErrorLogger = () => undefined,
  ) {}

  public map<Model extends object>(ModelCtor: INewable<Model>): EntityFromSyntax<Model>;
  public map<Model extends object>(model: Model | Model[], ...args: any[]): EntityToSyntax<Model>;
  public map<Model extends object>(
    first: INewable<Model> | Model | Model[],
    ...rest: any[]
  ): EntityFromSyntax<Model> | EntityToSyntax<Model> {
    return (typeof first === 'function')
      ? new EntityFromSyntax(this.mappers, first, this.logError)
      : new EntityToSyntax(this.mappers, first, rest, this.logError);
  }

}
