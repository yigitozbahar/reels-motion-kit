// The bundler's require.context (webpack/rspack): Root.tsx uses it to find the story parts in src/stories/.
declare const require: { context(dir: string, deep: boolean, filter: RegExp): { keys(): string[]; (key: string): unknown } };
