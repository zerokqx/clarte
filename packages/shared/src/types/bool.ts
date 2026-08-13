export type ToBool<T> = T extends false | null | undefined | '' | 0 | 0n
  ? false
  : // 2. Проверяем на NaN (число, которое не равно самому себе)
    [T] extends [never]
    ? false
    : // 3. Любой чистый объект, массив, функция или Symbol в JS всегда Truthy
      T extends object | symbol
      ? true
      : // 4. Для широких типов (string, number, boolean, bigint) вернется boolean
        boolean extends T
        ? boolean
        : true;
