import type { BunPlugin } from 'bun';
import { createCodegenHost } from 'codegen-lib';

export interface CodegenPluginOptions {
  outDir?: string;
  rootDir?: string;
}

const defaultOptions: CodegenPluginOptions = { rootDir: process.cwd() };

export function loader(options = defaultOptions): BunPlugin {
  return {
    name: 'codegen-loader',
    setup(build) {
      const { rootDir = defaultOptions.rootDir, outDir } = options;
      const codegen = createCodegenHost(rootDir);

      build.onLoad({ filter: /\.codegen$/ }, async (args) => {
        const watchFiles = [];
        const result = await codegen.generate({
          // we expect the file to be a valid ESM - either because
          // we changed it, or because only such files are provided
          type: 'esm',
          name: args.path,
          options: {
            outDir,
            rootDir,
          },
          addDependency: (file) => {
            watchFiles.push(file);
          },
        });
        return {
          contents: result.value,
        };
      });
    },
  };
}
