import _ from "lodash";

interface PickDataOptions {
  fields?: string[];
  object?: Record<string, any>;
}

const pickData = ({ fields = [], object = {} }: PickDataOptions): Record<string, any> => {
  if (fields.length === 0) return object;

  return _.pick(object, fields);
};

const omitData = ({ fields = [], object = {} }: PickDataOptions): Record<string, any> => {
  if (fields.length === 0) return object;

  return _.omit(object, fields);
};

export { pickData, omitData };
