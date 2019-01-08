'use strict'

console.log()
process.on('exit', () => {
  console.log()
})

if (!process.argv[2]) {
  console.error('[路径]必填 - 请输入新页面的路径(英文)， 如orderDetail')
  process.exit(1)
}

const path = require('path')
const fileSave = require('file-save')
const fs = require('fs')
const pathName = process.argv[2]
const pathNameInList = `pages/${pathName}/main`
const pagePath = path.resolve(__dirname, '../../src/pages', pathName)
const entryJsPath = path.resolve(__dirname, '../../src/main.js')
const title = process.argv[3] || '哲品'
const entryAnchor = `// 此行注释勿删`
const entryReg = new RegExp(`${entryAnchor}([\\s\\S]*)${entryAnchor}`, 'g')


const vueTemplate = `<template>
  <clays>

  </clays>
</template>

<script>
// eslint-disable-next-line
import utils from '../../utils/utils'
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>
<style scoped lang="scss">
  /* 针对iPhoneX的特殊样式 */
  .xModel {

  }
</style>`

const mainJSTemlate = `import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    navigationBarTitleText: '${title}'
  }
}`
if (fs.existsSync(pagePath)) {
  console.log(`路径名称——${pathName} 已经存在`)
  process.exit(1)
}

fileSave(path.join(pagePath, 'index.vue'))
  .write(vueTemplate, 'utf8')
  .end('\n')

fileSave(path.join(pagePath, 'main.js'))
  .write(mainJSTemlate, 'utf8')
  .end('\n')

fs.readFile(entryJsPath, {encoding: 'utf8'}, (err, content) => {
  if (err) {
    console.error(err)
    return false
  }
  let pagesStr
  let pagesList = []
  const fileContent = content.replace(entryReg, ($1, $2) => {
    pagesStr = $2.trim()
    pagesList = pagesStr.split(',').map(i => i.trim())
    pagesList.push(`'${pathNameInList}'`)
    return `${entryAnchor}
      ${pagesList.join(',\n      ')}
      ${entryAnchor}`
  })
  fileSave(entryJsPath)
    .write(fileContent, 'utf8')
    .end('')
})

console.log('搞定 !')
