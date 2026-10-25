import { sendError } from '../utils/response.js';

/**
 * Validate request data against a Zod schema
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const result = await schema.safeParseAsync(dataToValidate);

      if (!result.success) {
        // Support both Zod 3 (.errors) and Zod 4 (.issues)
        const issues = result.error.issues || result.error.errors || [];
        const formattedErrors = issues.map((err) => ({
          field: Array.isArray(err.path) ? err.path.join('.') : String(err.path),
          message: err.message
        }));

        return sendError(res, 'Validation failed. Please verify your input.', 400, formattedErrors);
      }

      // Replace with parsed/sanitized data
      req[source] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
};
