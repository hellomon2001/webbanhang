import { HandleError } from "./handleErrorMiddleware.js";

export function UsagiController(controller) {
  const output = {};
  Object.keys(controller).forEach(
    (item) => (output[item] = HandleError(controller[item]))
  );
  return output
}
