const fs = require("fs");
const path = require("path");
const { getEnvironmentData, parentPort } = require("node:worker_threads");

/**
 *
 * @param {string} directory
 * @param {number} maxDepht
 * @returns {number[]}
 */
const dirStats = (directory, maxDepht = 30) => {
  if (maxDepht < 1) return [];
  const files = fs.readdirSync(directory);
  const sizes = [];
  for (const file of files) {
    const stat = fs.statSync(path.join(directory, file));
    if (stat.isDirectory()) {
      for (const size in dirStats(path.join(directory, file), maxDepht - 1))
        sizes.push(size);
    } else sizes.push(stat.size);
  }
  return sizes;
};
const p = getEnvironmentData("path");
if (p.debugMode) console.log("worker:running:" + p.path.split("\\").at(-2));
parentPort.postMessage({
  sizes: dirStats(p.path),
  path: p.path,
  diffDate: p.diffDate,
});
