export type FailReturnType = {
  success: false;
  error: string;
};

export type SuccessReturnType<T> = {
  success: true;
  data: T;
};

export type ApiReturnType<T> = SuccessReturnType<T> | FailReturnType;
