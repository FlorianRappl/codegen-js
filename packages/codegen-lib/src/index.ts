import { createRequire } from 'module';

function reloadGenerator(requireModule: any, name: string) {
  const path = requireModule.resolve(name);
  delete requireModule.cache[path];
  return requireModule(name);
}

function noop() {}

export interface CodegenDetailsOptions {
  outDir?: string;
  rootDir?: string;
}

export type CodegenType = 'auto' | 'esm' | 'cjs';

export interface CodegenDetails {
  name: string;
  type?: CodegenType;
  options: CodegenDetailsOptions;
  addDependency?(file: string, options: CodegenDetailsOptions): void;
}

export interface CodegenContext {
  name: string;
  options: CodegenDetailsOptions;
  addDependency(file: string, options: CodegenDetailsOptions): void;
}

export interface CodegenResult {
  value: string;
  type: string;
}

export interface CodegenFile {
  (this: CodegenContext): string | CodegenResult | Promise<string | CodegenResult>;
  type?: string;
}

export interface CodegenHost {
  load(name: string, type: CodegenType): Promise<CodegenFile>;
  generate(details: CodegenDetails): Promise<CodegenResult>;
}

export function createCodegenHost(fileOrDirName: string): CodegenHost {
  const requireModule = createRequire(fileOrDirName);
  const host: CodegenHost = {
    load(name, type) {
      switch (type) {
        case 'cjs':
          return Promise.resolve(reloadGenerator(requireModule, name));
        case 'esm':
          return import(name).then((result) => result.default || result);
        case 'auto':
        default:
          if (
            name.endsWith('.mjs.codegen') ||
            name.endsWith('.esm.codegen') ||
            name.endsWith('.module.codegen') ||
            name.endsWith('.m.codegen')
          ) {
            return host.load(name, 'esm');
          }

          return host.load(name, 'cjs');
      }
    },
    async generate(details) {
      const { name, type = 'auto', options = {}, addDependency = noop } = details;

      if (typeof name !== 'string') {
        throw new Error(`You need to pass in a string for "name". Received: "${name}".`);
      }

      const generator = await host.load(name, type);

      if (typeof generator !== 'function') {
        throw new Error(`The codegen module "${name}" does not export a function and is invalid.`);
      }

      const result = await (generator.call({
        name,
        options,
        addDependency,
      }) as ReturnType<CodegenFile>);

      if (typeof result === 'string') {
        const type = typeof generator.type === 'string' ? generator.type : 'js';

        return {
          type,
          value: result,
        };
      }

      if (result && typeof result === 'object' && typeof result.value === 'string' && typeof result.type === 'string') {
        return result;
      }

      throw new Error(
        `The codegen module "${name}" did not generate a valid result (string or object). It returned: "${result}".`,
      );
    },
  };
  return host;
}
