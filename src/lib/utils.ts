/**
 * Safely parses a JSON string, returning the original value if parsing fails
 * @param val The value to parse (can be string or any other type)
 * @returns Parsed object if val is a valid JSON string, otherwise the original value
 */
export function safeParse<T>(val: any): T | null {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as unknown as T;
    }
  }
  return val ?? null;
}

/**
 * API error handler that logs errors and returns a standardized error response
 * @param error The error object
 * @param context Context description for logging
 * @throws Error Always throws an error to be caught by apiHandler
 */
export function handleApiError(error: any, context: string = 'API'): never {
  console.error(`${context} error:`, error);
  throw new Error(`Internal server error in ${context}`);
}

/**
 * Creates a standardized success response
 * @param data The data to return
 * @param status HTTP status code (default: 200)
 * @returns NextResponse object with JSON data
 */
export function apiSuccess<T>(data: T, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Creates a standardized error response
 * @param message Error message
 * @param status HTTP status code (default: 500)
 * @returns NextResponse object with error JSON
 */
export function apiError(message: string, status: number = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Wrapper for API route handlers that provides consistent error handling with optional fallback
 * @param fn Async function that returns the response data
 * @param context Context description for logging
 * @param fallbackData Optional data to return if the main function fails
 * @param useFallbackOnError Whether to use fallback data on error (default: false)
 * @returns Promise that resolves to a NextResponse
 */
export function apiHandler<T>(
  fn: () => Promise<T>,
  context: string = 'API',
  fallbackData?: T,
  useFallbackOnError: boolean = false
): Promise<Response> {
  return fn()
    .then((result) => {
      // If result is already a Response, return it directly
      if (result instanceof Response) {
        return result;
      }
      return apiSuccess(result);
    })
    .catch((error) => {
      console.error(`${context} error:`, error);

      // If fallback data is provided and useFallbackOnError is true, return it
      if (useFallbackOnError && fallbackData !== undefined) {
        return apiSuccess(fallbackData);
      }

      return apiError('Internal server error');
    });
}