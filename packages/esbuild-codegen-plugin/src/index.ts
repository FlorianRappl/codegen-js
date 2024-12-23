import { dirname, resolve } from 'path';
import { createCodegenHost } from 'codegen-lib';
import type { Plugin } from 'esbuild';

export const codegenPlugin = (): Plugin => ({
  name: 'codegen-loader',
  setup(build) {
    const rootDir = process.cwd();
    const outDir = build.initialOptions.outdir
      ? resolve(rootDir, build.initialOptions.outdir)
      : dirname(resolve(rootDir, build.initialOptions.outfile));
    const codegen = createCodegenHost(rootDir);

    build.onLoad({ filter: /\.codegen$/ }, async (args) => {
      const name = args.path;
      const watchFiles = [];
      const contents = await codegen.generate({
        name,
        options: {
          outDir,
          rootDir,
        },
        addDependency: (file, options) => {
          watchFiles.push(file);
        },
      });
      return {
        watchFiles,
        contents,
      };
    });
  },
});
