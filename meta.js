module.exports = {
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    }
  },
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    },
    "description": {
      "type": "string",
      "required": false,
      "message": "Project description",
      "default": "A Zens MiniProgram project"
    },
    "author": {
      "type": "string",
      "message": "Author"
    },
    "testAppid": {
      "type": "string",
      "required": false,
      "message": "测试号的appid（小号）",
      "default": "touristappid"
    },
    "appid": {
      "type": "string",
      "required": false,
      "message": "正式号的appid（大号）",
      "default": "touristappid"
    },
    "testHost": {
      "type": "string",
      "required": false,
      "message": "测试环境的服务端接口域名",
      "default": "ct-demo.zens.asia"
    },
    "preHost": {
      "type": "string",
      "required": false,
      "message": "预发布环境的服务端接口域名",
      "default": "ct-preview.zens.asia"
    },
    "productHost": {
      "type": "string",
      "required": false,
      "message": "线上环境的服务端接口域名",
      "default": "ct.zens.asia"
    },
    "prefix": {
      "type": "string",
      "required": false,
      "message": "接口地址前缀",
      "default": "/wxcx/"
    },
    "build": {
      "type": "list",
      "message": "Vue build",
      "choices": [
        // {
        //   "name": "Runtime + Compiler: recommended for most users",
        //   "value": "standalone",
        //   "short": "standalone"
        // },
        {
          "name": "Runtime-only: no custom render function, only can compile template in *.vue",
          "value": "runtime",
          "short": "runtime"
        }
      ]
    }
  },
  "filters": {
    // ".eslintrc.js": "lint",
    // ".eslintignore": "lint",
    // "config/test.env.js": "unit || e2e",
    // "test/unit/**/*": "unit",
    // "build/webpack.test.conf.js": "unit",
    // "test/e2e/**/*": "e2e"
    // "config/test.env.js": "test",
    // "test/unit/**/*": "test",
    // "build/webpack.test.conf.js": "test",
    // "test/e2e/**/*": "test",
    "src/pages/counter/*": "vuex",
  },
  // "completeMessage": "To get started:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n  npm run dev\n\nDocumentation can be found at https://vuejs-templates.github.io/webpack"
  "completeMessage": "To get started:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n  npm run dev\n\nDocumentation can be found at http://mpvue.com"
};
