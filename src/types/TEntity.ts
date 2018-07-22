export type TEntityValueAcceptor = (value: any) => boolean;

export type TEntityValueMutator<Value = any> = (value: any) => Value;
