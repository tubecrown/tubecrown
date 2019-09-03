import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import { createBinaryWithOptions } from '../binaries'
import { findPackages } from '../find-packages'

const npm = createBinaryWithOptions('npm')

const shouldWatch = (pkgPath: string, scriptName: string): boolean => {
  if (!fs.existsSync(path.join(pkgPath, 'src'))) {
    return false
  }
  const pkgJson = require(path.join(pkgPath, 'package.json'))
  return pkgJson.scripts && pkgJson.scripts[scriptName]
}

interface HandleFileChangeOptions {
  rootPath: string
  scriptName: string
  infoPath?: string
}

const handleFileChange = ({ rootPath, scriptName, infoPath }: HandleFileChangeOptions) => {
  return async (filePath: string) => {
    const pkgPath = path.join(rootPath, path.relative(rootPath, filePath).split('src')[0])
    try {
      const exitCode = await npm(['run', scriptName], { cwd: pkgPath })
      if (exitCode) {
        console.log(`${pkgPath}: '${scriptName}' failed with exit code ${exitCode}`)
      } else if (infoPath) {
        fs.writeFileSync(infoPath, `rebuild: ${new Date()}`)
      }
    } catch (err) {
      console.log(`${pkgPath}: '${scriptName}' failed`)
      console.log(err)
    }
    console.log('Done')
  }
}

export const watch = async (argv: string[]): Promise<number> => {
  const rootPath = process.cwd()
  const scriptName = argv[0]
  const infoPath = path.join(rootPath, argv[1])
  if (infoPath) {
    fs.mkdirSync(path.dirname(infoPath), { recursive: true })
  }
  const packages = findPackages(rootPath, (pkgPath) => shouldWatch(pkgPath, scriptName))
  console.log(`Watching the following packages to run '${scriptName}' script:`)
  console.log()
  packages.forEach((pkgPath) => {
    console.log(`- ${path.relative(rootPath, pkgPath)}`)
  })
  console.log()
  const watcher = chokidar.watch(packages.map((pkgPath) => path.join(pkgPath, 'src')))
  watcher.on('change', handleFileChange({ rootPath, scriptName, infoPath }))
  watcher.on('error', console.error)
  if (infoPath) {
    fs.writeFileSync(infoPath, `ready: ${new Date()}`)
  }
  return 0
}
