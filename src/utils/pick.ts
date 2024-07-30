interface PickDataOptions {
  fields?: string[];
  object?: Record<string, any>;
}

const pickData = ({ fields = [], object = {} }: PickDataOptions): Record<string, any> => {
  if (fields.length === 0) return object;

  return fields.reduce(
    (result, key) => {
      if (key in object) {
        result[key] = object[key];
      }
      return result;
    },
    {} as Record<string, any>,
  );
};

const omitData = ({ fields = [], object = {} }: PickDataOptions): Record<string, any> => {
  if (fields.length === 0) return object;

  return Object.keys(object).reduce(
    (result, key) => {
      if (!fields.includes(key)) {
        result[key] = object[key];
      }
      return result;
    },
    {} as Record<string, any>,
  );
};

export { pickData, omitData };
