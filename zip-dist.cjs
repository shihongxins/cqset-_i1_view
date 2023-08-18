/**
 * @requires "compressing"
 * @requires "glob"
 */

const { argv } = require('node:process');
const path = require('node:path');
const fs = require('node:fs');
const compressing = require('compressing');
const glob = require('glob');

const rm = (p) => {
  const _p = path.resolve(p);
  if (fs.existsSync(_p)) {
    const stat = fs.statSync(_p);
    if (stat.isFile()) {
      fs.unlinkSync(_p);
    }
    if (stat.isDirectory()) {
      const contents = fs.readdirSync(_p);
      for (let i = 0; i < contents.length; i++) {
        rm(`${p}${path.sep}${contents[i]}`);
      }
      fs.rmdirSync(_p);
    }
  }
};

const cp = (from = 'dist', to = '') => {
  const fp = path.resolve(from);
  if (!fs.existsSync(fp)) {
    throw new Error(`ENOENT: no such file or directory '${from}'`);
  }
  const fpStat = fs.statSync(fp);
  if (!fpStat.isDirectory()) {
    throw new Error(`ENOENT: '${from}' must be a directory`);
  }
  const tp = path.resolve(to);
  if (!fs.existsSync(tp)) {
    fs.mkdirSync(tp);
  }
  if (fp === tp) {
    return;
  }
  fs.cpSync(fp, tp + path.sep + from, { recursive: true, force: true });
};

const zipDist = ({ dir: to = 'dist', mark = false } = {}) => {
  let markText;
  if (mark !== 'none') {
    const d = new Date();
    markText = (d.toISOString().substr(0, 10) + d.toLocaleTimeString()).replace(/[^\d]/gm, '');
    if (['indir', 'both'].includes(mark)) {
      fs.writeFileSync(path.resolve(`dist/${markText}.txt`), markText);
    }
  }
  if (to !== 'dist') {
    cp('dist', to);
  }
  return compressing.zip.compressDir(
    to,
    `${to}${['onzip', 'both'].includes(mark) ? markText : ''}.zip`
  );
};

const parseCommandArgs = () => {
  const args = {
    help: false,
    dir: 'dist',
    mark: 'none', // "none", 'onzip', 'indir', 'both'
  };
  argv.slice(2).forEach((arg) => {
    const help = /-h(elp)?/i.test(arg);
    const dir = /dir=(\w+)/i.exec(arg);
    const mark = /mark=(\w+)/i.exec(arg);
    if (help) {
      args.help = true;
    }
    if (dir) {
      args.dir = dir?.[1] || 'dist';
    }
    if (mark) {
      const m = mark?.[1]?.toString().toLowerCase() || 'none';
      args.mark = [false, 'indir', 'onzip', 'both'].includes(m) ? m : 'none';
    }
  });
  return args;
};

const glob_rm = (pattern) => {
  if (!pattern) {
    return;
  }
  glob.sync(pattern).forEach((matchedPath) => {
    try {
      rm(matchedPath);
    } catch (error) {
      console.warn(error);
    }
  });
};

function help() {
  console.log(`
    --dir: the target to zip, default "dist", otherwase mean to copy "dist" to [--dir].\r\n
    --mark: ["none", "indir", "onzip", "both"], default "none".\r\n
    --help, -h: show help. \r\n
  `);
}

function main() {
  const args = parseCommandArgs();
  console.log(args);
  if (args.help) {
    help();
  }
  glob_rm(`{dist.zip,${args.dir !== 'dist' ? args.dir + '*' : ''}}`);
  zipDist(args)
    .then(() => {
      glob_rm(`{dist,${args.dir}}*/`);
    })
    .catch((reason) => {
      glob_rm(`${args.dir}*`);
      throw new Error(reason);
    });
}

main();
