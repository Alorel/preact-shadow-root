import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import {copyPlugin} from '@alorel/rollup-plugin-copy';
import {threadedTerserPlugin} from '@alorel/rollup-plugin-threaded-terser';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import {promises as fs} from 'fs';
import {join} from 'path';
import typescript from 'rollup-plugin-typescript2';
import * as pkgJson from './package.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pick = require('lodash/pick');

const distDir = join(__dirname, 'dist', 'prop-types');
const srcDir = join(__dirname, 'src');
const umdExternals = ['@alorel/preact-shadow-root'];
const external = umdExternals.concat('prop-types');
const banner$ = fs.readFile(join(__dirname, 'LICENSE'), 'utf8')
  .then(f => `/*\n${f.trim()}\n*/\n`);

const baseSettings = {
  external,
  input: join(srcDir, 'prop-types.js'),
  preserveModules: false,
  watch: {
    exclude: 'node_modules/*'
  }
};

const baseOutput = {
  assetFileNames: '[name][extname]',
  banner: () => banner$,
  dir: distDir,
  sourcemap: false
};

const umdBaseOutput = {
  ...baseOutput,
  format: 'umd',
  globals: {
    '@alorel/preact-shadow-root': 'PreactShadowRoot'
  },
  name: 'PreactShadowRootPropTypes'
};


const aliasConfig = {
  entries: [
    {find: '@alorel/preact-shadow-root', replace: join(srcDir, 'index.ts')}
  ]
};

const nodeResolveConfig = {
  extensions: ['.js', '.ts'],
  mainFields: [
    'fesm5',
    'esm5',
    'module',
    'browser',
    'main'
  ]
};

const cjsConfig = {
  include: ['node_modules/prop-types/**/*']
};

export default [
  {
    ...baseSettings,
    output: [
      {
        ...baseOutput,
        entryFileNames: 'index.js',
        format: 'cjs'
      },
      {
        ...baseOutput,
        entryFileNames: 'index.esm5.js',
        format: 'esm'
      }
    ],
    plugins: [
      cleanPlugin({dir: distDir}),
      alias(aliasConfig),
      nodeResolve(nodeResolveConfig),
      typescript(),
      commonjs(cjsConfig),
      copyPlugin({
        copy: ['LICENSE', 'CHANGELOG.md'],
        defaultOpts: {
          emitNameKind: 'fileName',
          glob: {
            cwd: __dirname
          }
        }
      })
    ]
  },
  {
    ...baseSettings,
    external: umdExternals,
    output: [
      {
        ...umdBaseOutput,
        entryFileNames: 'index.umd.js'
      },
      {
        ...umdBaseOutput,
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
    ],
    plugins: [
      alias(aliasConfig),
      nodeResolve(nodeResolveConfig),
      typescript(),
      commonjs(cjsConfig),
      {
        name: 'rollup-plugin-create-pkg-json',
        renderStart() {
          const writePkg = {
            description: 'Prop types for @alorel/preact-shadow-root',

            main: 'index.js',
            name: '@alorel/preact-shadow-root-proptypes',
            peerDependencies: {
              '@alorel/preact-shadow-root': pkgJson.version,
              'prop-types': '>=15.6.0'
            },
            ...pick(pkgJson, [
              'version',
              'browser',
              'module',
              'esm5',
              'jsdelivr',
              'types',
              'publishConfig',
              'typings',
              'repository',
              'author',
              'license'
            ])
          };

          this.emitFile({
            fileName: 'package.json',
            source: `${JSON.stringify(writePkg, null, 2)}\n`, // eslint-disable-line no-magic-numbers
            type: 'asset'
          });
        }
      }
    ]
  }
];
