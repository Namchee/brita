/**
 * Utility object to replace normal `Map` with simple
 * key-value object for faster performance and handles
 * JSON serialization issues
 */
export interface StringMap {
  [key: string]: any;
}
