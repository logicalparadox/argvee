/*!
 * argvee
 * Copyright (c) 2012-2020 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

interface ArgumentStruct {
  // the original argument array, untouched
  args: string[];

  // parsed untagged parts of args
  commands: string[];

  // parsed tagged (- or --) parts of args
  modes: string[];

  // parsed key:value pairs or args
  params: Record<string, string[]>;
}

/**
 * Take the raw node.js args array and parse out commands, modes, and parameters.
 *
 * @remarks
 * All values remain strings, so type parsing is up to the end user. Use helper
 * methods for quick checking and conversions.
 *
 * The skip argument will skip over the first `n` items when parsing, default to
 * 2 as when passing `process.argv` contains the executor (`node`) and the filename.
 *
 * The lowerCase argument will convert commands, modes, and param keys to lowercase
 * for easy filtering/matching. Single-letter modes are always case-sensitive.
 *
 * @param args - argument array (defaults to `process.argv`)
 * @param skip - number of arg items to skip
 * @param lowerCase - convert relevant elements to lower-case, see remarks
 */

export function parse(
  args: string[] = process.argv,
  skip = 2,
  lowerCase = true,
): ArgumentStruct {
  const res: ArgumentStruct = {
    args: args,
    commands: [],
    modes: [],
    params: {},
  };

  let isStr = false;
  let paramKey: string | null = null;
  let argv: string[] = [];

  // commit stored param key as mode if it exists
  const checkParamKey = () => {
    if (paramKey != null) {
      res.modes.push(paramKey);
      paramKey = null;
    }
  };

  // remove '=' notification to make logic easier
  argv = args.slice(skip).flatMap((part: string): string[] => part.split('='));

  for (let part of argv) {
    // node example.js --string
    if (part.substr(0, 2) === '--') {
      checkParamKey();
      paramKey = part.substr(2);
      if (lowerCase) paramKey = paramKey.toLowerCase();
      continue;
    }

    if (part[0] === '-') {
      checkParamKey();
      part = part.substr(1);

      // node example.js -s
      if (part.length === 1) {
        paramKey = part;
        continue;
      }

      // node example.js -abc
      res.modes = res.modes.concat(part.split(''));
      continue;
    }

    // node.example.js string
    if (paramKey === null) {
      res.commands.push(lowerCase ? part.toLowerCase() : part);
      continue;
    }

    // node example.js --say "hello node world"
    if (part[0] === '"' && !isStr) {
      // first part of string
      isStr = true;
      addParam(res.params, paramKey, part.substr(1));
    } else if (isStr && part[part.length - 1] == '"') {
      // last part of string
      isStr = false;
      appendParam(res.params, paramKey, part.substr(0, part.length - 1));
      paramKey = null;
    } else if (isStr) {
      // middle part of string
      appendParam(res.params, paramKey, part);
    } else {
      // just a normal param
      addParam(res.params, paramKey, part);
      paramKey = null;
    }
  }

  // finalize dealing out args
  checkParamKey();
  return res;
}

/**
 * Helper function to determine if at least one of the specified values
 * exists in source array. Case-sensitive.
 *
 * @example
 * ```ts
 * const bShowVersion:boolean = argvee.match(argv, 'v', 'version');
 * ```
 *
 * @param input - use `commands` or `modes` part of parsed object
 * @param params - array of keys to combine into final result
 */

export function match(input: string[], ...params: string[]): boolean {
  for (const p of params) {
    if (~input.indexOf(p)) {
      return true;
    }
  }

  return false;
}

/**
 * Select the params object for values of a specific set of keys.
 *
 * @example
 * ```ts
 * const fileNames:string[] = argvee.selectString(argv, 'f', 'file');
 * ```
 *
 * @param input - use `params` part of parsed object
 * @param params - [] of keys to combine into final result
 */

export function selectString(
  input: Record<string, string[]>,
  ...params: string[]
): string[] {
  let res: string[] = [];

  for (const p of params) {
    if (p in input) {
      res = res.concat(input[p]);
    }
  }

  return res;
}

/**
 * Select the params object for values of a specific set of keys.
 * Converts numbers where appropriate.
 *
 * @example
 * ```ts
 * const mixed:(string|number)[] = argvee.select(argv.params, 'host', 'port');
 * ```
 *
 * @param input - use `params` part of parsed object
 * @param params - array of key-value combined into final result
 */

export function select(
  input: Record<string, string[]>,
  ...params: string[]
): (string | number)[] {
  let res: (string | number)[] = [];
  const isNumber = (a: string) =>
    a != null && a != '' && !isNaN(Number(a.toString()));
  const toNumber = (a: string) => Number(a.toString());

  for (const p of params) {
    if (p in input) {
      const valArr = input[p].map((a) => (isNumber(a) ? toNumber(a) : a));
      res = res.concat(valArr);
    }
  }

  return res;
}

/**
 * Select the params object for values of a specific set of keys.
 *
 * @example
 * ```ts
 * const serverPort:number[] = argvee.selectNumber(argv.params, 'p', 'port')[0];
 * ```
 *
 * @param input - use `params` part of parsed object
 * @param params - [] of keys to combine into final result
 */

export function selectNumber(
  input: Record<string, string[]>,
  ...params: string[]
): number[] {
  let res: number[] = [];
  const isNumber = (a: string) =>
    a != null && a != '' && !isNaN(Number(a.toString()));
  const toNumber = (a: string) => Number(a.toString());

  for (const p of params) {
    if (p in input) {
      const numArr = input[p].filter(isNumber).map(toNumber);
      res = res.concat(numArr);
    }
  }

  return res;
}

/*!
 * Add a param to the param list, creating necissary records as needed.
 */

function addParam(
  params: Record<string, string[]>,
  key: string,
  value: string,
) {
  key = key.toLowerCase();
  (params[key] || (params[key] = [])).push(value);
}

/*!
 * Append a string to the last param. Used when params are
 * surrounded in quotes.
 */

function appendParam(
  params: Record<string, string[]>,
  key: string,
  value: string,
) {
  const curr = params[key];
  curr[curr.length - 1] += ' ' + value;
}
