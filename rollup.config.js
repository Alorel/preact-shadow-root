import {join} from 'path';
import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import {copyPkgJsonPlugin} from '@alorel/rollup-plugin-copy-pkg-json';
import {copyPlugin} from '@alorel/rollup-plugin-copy';
import nodeResolve from '@rollup/plugin-node-resolve';
import {promises as fs} from 'fs';
import {threadedTerserPlugin} from '@alorel/rollup-plugin-threaded-terser';
import {dtsPlugin} from '@alorel/rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

const umdName = 'PreactShadowRoot';
const umdGlobals = {
  preact: 'preact',
  'preact/compat': 'preactCompat',
  'preact/hooks': 'preactHooks'
};

const distDir = join(__dirname, 'dist', 'main');
const srcDir = join(__dirname, 'src');
const external = ['preact', 'preact/compat', 'preact/hooks'];
const clean$ = cleanPlugin({dir: distDir});
const banner$ = fs.readFile(join(__dirname, 'LICENSE'), 'utf8')
  .then(f => `/*\n${f.trim()}\n*/\n`);

function mkNodeResolve() {
  return nodeResolve({
    extensions: ['.js', '.ts'],
    mainFields: [
      'fesm5',
      'esm5',
      'module',
      'browser',
      'main'
    ]
  });
}

const baseInput = join(srcDir, 'index.ts');

const baseSettings = {
  external: external.concat('tslib'),
  input: join(srcDir, 'index.ts'),
  preserveModules: false,
  watch: {
    exclude: 'node_modules/*'
  }
};

const baseOutput = {
  assetFileNames: '[name][extname]',
  dir: distDir,
  entryFileNames: '[name].js',
  sourcemap: false
};

export default function({watch}) { // eslint-disable-line max-lines-per-function
  const cjs = {
    ...baseSettings,
    input: baseInput,
    output: {
      ...baseOutput,
      format: 'cjs',
      plugins: watch ?
        [] :
        [
          copyPkgJsonPlugin({
            unsetPaths: ['devDependencies', 'scripts']
          }),
          dtsPlugin({
            cliArgs: ['--rootDir', 'src']
          })
        ]
    },
    plugins: [
      clean$,
      !watch && copyPlugin({
        copy: ['LICENSE', 'CHANGELOG.md', 'README.md'],
        defaultOpts: {
          emitNameKind: 'fileName',
          glob: {
            cwd: __dirname
          }
        }
      }),
      mkNodeResolve(),
      typescript()
    ].filter(Boolean)
  };

  if (watch) {
    return cjs;
  }

  return [
    cjs,
    {
      ...baseSettings,
      output: [
        {
          ...baseOutput,
          banner: () => banner$,
          entryFileNames: 'index.esm5.js',
          format: 'es'
        }
      ],
      plugins: [
        mkNodeResolve(),
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              target: 'es5'
            }
          }
        })
      ]
    },
    {
      ...baseSettings,
      output: [
        {
          ...baseOutput,
          banner: () => banner$,
          entryFileNames: 'index.esm2015.js',
          format: 'es'
        }
      ],
      plugins: [mkNodeResolve(), typescript()]
    },
    {
      ...baseSettings,
      external,
      output: (() => {
        const base = {
          ...baseOutput,
          banner: () => banner$,
          format: 'umd',
          globals: umdGlobals,
          name: umdName
        };

        return [
          {
            ...base,
            entryFileNames: 'index.umd.js'
          },
          {
            ...base,
            entryFileNames: 'index.umd.min.js',
            plugins: [
              threadedTerserPlugin({
                terserOpts: {
                  compress: {
                    drop_console: true,
                    ecma: 5,
                    keep_infinity: true,
                    typeofs: false
                  },
                  ecma: 5,
                  ie8: true,
                  mangle: {
                    safari10: true
                  },
                  output: {
                    comments: false,
                    ie8: true,
                    safari10: true
                  },
                  safari10: true,
                  sourceMap: false
                }
              })
            ]
          }
        ];
      })(),
      plugins: [
        mkNodeResolve(),
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              target: 'es5'
            }
          }
        })
      ]
    }
  ].filter(Boolean);
}
