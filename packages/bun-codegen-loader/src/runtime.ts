import type { BunPlugin } from 'bun';

export function runtimePlugin(): BunPlugin {
  return {
    name: 'codegen',
    async setup(build) {
      build.onLoad({ filter: /\.codegen$/ }, async (args) => {
        // @ts-ignore
        const content = await Bun.file(args.path).text();
        return {
          contents: content.replace('module.exports = function () {', 'export default function () {'),
          loader: 'js',
        };
      });
    },
  };
}
