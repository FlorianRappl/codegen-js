import { dirname, resolve } from 'path';
import { createCodegenHost } from 'codegen-lib';
import type { Plugin } from 'esbuild';

export interface CodegenPluginOptions {
  outDir?: string;
  rootDir?: string;
}

const defaultOptions: CodegenPluginOptions = { rootDir: process.cwd() };

export const codegenPlugin = (options = defaultOptions): Plugin => ({
  name: 'codegen-loader',
  setup(build) {
    const { rootDir = defaultOptions.rootDir } = options;
    const codegen = createCodegenHost(rootDir);

    build.onLoad({ filter: /\.codegen$/ }, async (args) => {
      const outDir =
        options.outDir ||
        (build.initialOptions.outdir
          ? resolve(rootDir, build.initialOptions.outdir)
          : dirname(resolve(rootDir, build.initialOptions.outfile)));
      const name = args.path;
      const watchFiles = [];
      const result = await codegen.generate({
        name,
        options: {
          outDir,
          rootDir,
        },
        addDependency: (file) => {
          watchFiles.push(file);
        },
      });
      return {
        watchFiles,
        contents: result.value,
      };
    });
  },
});
