##目录规范
     页面为基础
传统jquery开发方式组件化其实只是单纯的将页面分割。
组件代码只是简单的嵌入。

##模块依赖
未模块化的插件
已模块化的插件
模块加载器

## 目录规范
lib(第三公共方库，每个页面需要使用，所以文件会打包成单一lib.js)

mods(第三方库，通过fis包装成commonJs模块化js)，按需加载

common
   widget(公共组件，上线时会被打包成widget.js, widget.css ....)
       header 
       footer
       header2
    css(公共样式库，工具)
      index.scss(html文件引用，最终会被打包成common.css)
      util.scss(scss工具库，开发时每个scss文件引用)
    images(上线打包到/static/images/common...)
pages(同名依赖，js，css)
  home
  user 
  login
test

打包后

dest 
    static
      images
      css
      js    
    .html
#全局安装

# hook类
npm install -g fis3-hook-commonjs

# parser类
## 下面两个sass插件二选一，还需要更改fisconf里对应的插件
npm install -g fis-parser-sass # node版本需 <= 0.12
npm install -g fis-parser-node-sass # node >= 4

npm install -g fis-parser-less
npm install -g fis-parser-template
npm install -g fis-parser-babel-5.x

# preprocessor类
npm install -g fis3-preprocessor-js-require-file
npm install -g fis3-preprocessor-js-require-css

# postprocessor类
npm install -g fis-postprocessor-autoprefixer

# postpackager类
npm install -g fis3-postpackager-loader

# optimizer类
# npm install -g fis3-optimizer-html-compress # 此插件已废弃，可跳过

# deploy类
npm install -g fis3-deploy-skip-packed
npm install fis3-deploy-sftp-client



  