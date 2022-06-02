import getCliCleanOption from '@configs/getCliCleanOption';
import getCliCreateOption from '@configs/getCliCreateOption';
import getCliSingleOption from '@configs/getCliSingleOption';
import consola from 'consola';
import * as findUp from 'find-up';
import fs from 'fs';
import minimist from 'minimist';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import { existsSync } from 'my-node-fp';

export default function preLoadConfig() {
  try {
    const argv = minimist([...process.argv.slice(2)]);

    const configFilePath =
      isNotEmpty(argv.config) || isNotEmpty(argv.c)
        ? findUp.sync([argv.config, argv.c])
        : findUp.sync('.ctirc');

    const tsconfigPath =
      isNotEmpty(argv.project) || isNotEmpty(argv.p)
        ? findUp.sync([argv.project, argv.p])
        : findUp.sync('tsconfig.json');

    if (isEmpty(configFilePath) || isFalse(existsSync(configFilePath))) {
      return {
        p: tsconfigPath,
        project: tsconfigPath,
        f: argv.f ?? argv.exportFilename ?? 'index.ts',
        exportFilename: argv.f ?? argv.exportFilename ?? 'index.ts',
      };
    }

    if (isEmpty(tsconfigPath) || isFalse(existsSync(tsconfigPath))) {
      return {};
    }

    const [command] = argv._;

    const configBuf = fs.readFileSync(configFilePath);

    if (command === 'create') {
      return getCliCreateOption(configBuf, argv, configFilePath, tsconfigPath);
    }

    if (command === 'single') {
      return getCliSingleOption(configBuf, argv, configFilePath, tsconfigPath);
    }

    if (command === 'clean') {
      return getCliCleanOption(configBuf, argv, configFilePath, tsconfigPath);
    }

    return {};
  } catch (catched) {
    const err = catched instanceof Error ? catched : new Error('unknown error raised');
    consola.error(err);

    return {};
  }
}
