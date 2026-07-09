export const freezeWith = <T>(target: object, props: T) => {
  Object.assign(target, props);
  Object.freeze(target);
};
