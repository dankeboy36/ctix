import {
  TCleanOption,
  TCreateOption,
  TInitOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function removeBuilder<
  T extends TCleanOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args.option('includeBackup', {
    alias: 'b',
    describe: 'clean with backup file',
    type: 'boolean',
  });

  return args;
}
