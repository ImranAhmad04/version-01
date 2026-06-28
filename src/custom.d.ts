/**
 * @file custom.d.ts
 * @description Declares modules for static asset imports (images) so TypeScript knows they resolve to URL strings at runtime.
 */

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.json" {
  const value: any;
  export default value;
}

