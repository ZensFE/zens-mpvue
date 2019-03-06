const fs = require('fs')
const APP_ID_LIST = {
  'test': '{{ testAppid }}',
  'pre': '{{ appid }}',
  'product': '{{ appid }}'
}

const CONFIG_PATH_ROOT = './project.config.json'
const CONFIG_PATH_DIST = './dist/project.config.json'

/**
 * 读取配置文件
 * @param path
 * @returns {Promise<any>}
 */
const readConfigFile = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, {encoding: 'utf8'}, (err, content) => {
    if (err) {
      reject(err)
    } else {
      resolve(JSON.parse(content))
    }
  })
})

/**
 * 保存配置文件
 * @param path
 * @param config
 * @returns {Promise<any>}
 */
const saveConfigFile = (path, config) => new Promise((resolve, reject) => {
  fs.writeFile(path, JSON.stringify(config, null, '\t'), 'utf8', (err, content) => {
    if (err) {
      reject(err)
    } else {
      resolve('success')
    }
  })
})


/**
 * 修改AppId
 * @param path
 * @param env
 * @param root
 * @returns {Promise<any>}
 */
const changeAppId = (path, env, root = '/') => {
  return readConfigFile(path)
    .then(config => {
      let {...configObj} = config
      configObj.appid = APP_ID_LIST[env] || APP_ID_LIST['product']
      configObj.miniprogramRoot = root
      return saveConfigFile(path, configObj)
    })
}

/**
 * @param env 环境变量
 * @returns {Promise<any>}
 */
module.exports = (env) => new Promise((resolve, reject) => {
  // 优先取 ./dist文件夹的
  changeAppId(CONFIG_PATH_DIST, env)
    .then(resolve)
    .catch(() => {
      // ./dist 文件夹为空时，取根目录的
      changeAppId(CONFIG_PATH_ROOT, env, 'dist/')
        .then(resolve)
        .catch(reject)
    })
})