import IReason from '@cli/interfaces/IReason';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import prettierApply from '@writes/prettierApply';
import chalk from 'chalk';
import dayjs from 'dayjs';
import fs from 'fs';
import { exists } from 'my-node-fp';
import path from 'path';

function getFirstLineComment(option: TCreateOrSingleOption): string {
  const today = dayjs();

  if (option.useComment && option.useTimestamp) {
    return `// created from ctix ${today.format('YYYY-MM-DD HH:mm:ss')}${option.eol}${option.eol}`;
  }

  if (option.useComment) {
    return `// created from ctix${option.eol}${option.eol}`;
  }

  if (option.useTimestamp) {
    return `// ${today.format('YYYY-MM-DD HH:mm:ss')}${option.eol}${option.eol}`;
  }

  return '';
}

export default async function indexFileWrite(
  indexInfos: ICreateIndexInfos[],
  option: TCreateOrSingleOption,
) {
  const nullableReasons = await Promise.all(
    indexInfos.map(async (indexInfo) => {
      const indexFilePath = path.join(indexInfo.resolvedDirPath, option.exportFilename);
      const indexFileContent = indexInfo.exportStatements.join(option.eol);
      const firstLine = getFirstLineComment(option);
      const prettierApplied = await prettierApply(
        option.project,
        `${firstLine}${indexFileContent}${option.eol}`,
      );

      if ((option.overwrite ?? false) === true) {
        // index.ts file already exist, create backup file
        if ((await exists(indexFilePath)) && option.noBackup === false) {
          await fs.promises.writeFile(
            `${indexFilePath}.bak`,
            await fs.promises.readFile(indexFilePath),
          );
        }

        await fs.promises.writeFile(
          indexFilePath,
          `${`${firstLine}${prettierApplied.contents}`.trim()}${option.eol}`,
        );

        return undefined;
      }

      if ((await exists(indexFilePath)) === false) {
        await fs.promises.writeFile(
          indexFilePath,
          `${`${firstLine}${prettierApplied.contents}`.trim()}${option.eol}`,
        );

        return undefined;
      }

      const reason: IReason = {
        type: 'error',
        filePath: indexFilePath,
        message: `Already exist "${option.exportFilename}": "${chalk.yellow(indexFilePath)}"`,
      };

      return reason;
    }),
  );

  const reasons = nullableReasons.filter((reason): reason is IReason => reason != null);

  return reasons;
}
