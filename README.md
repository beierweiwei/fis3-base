#基于[fis3](http://fis.baidu.com/)纯前端传统开发模式脚手架。

## 依赖
fis依赖node，了解node请看这里[nodejs.org](http://nodejs.org/)。

第一步，用下面的命令安装fis3（安装失败，可以试试[淘宝镜像](http://yanhaijing.com/tool/2015/09/01/my-npm-note/)）
    npm install -g fis3

第二步，安装fis插件
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

更多插件可以看[fis3插件开发](http://fis.baidu.com/fis3/docs/api/dev-plugin.html)和[fis3常用插件列表](http://fis.baidu.com/fis3/docs/common-plugin.html)。

第三步，接下来安装npm模块其他依赖模块
    npm install

## 如何运行
开启fis服务器

	fis3 server start

发布

    fis3 release

	fis3 release prod-debug # 本地查看发布产品库状态
    fis3 release prod # 发布产品库

    fis3 release rd # 发布到指定机器
	fis3 release rd-debug # 发布到指定机器调试

更多命令请[查看这里](http://fis.baidu.com/fis3/docs/api/command.html)。

## 目录说明
项目目录

    ┌─mods #需要包装的模块化js库，注意这里js库都是没有经过模块化包装的js库，会通过fis3自动包装
    ├─lib #页面常用的公共库，此文件夹的js和css在build阶段会被打包成单一文件，在开发阶段建议使用fis3内置依赖声明语法
    ├─pages #项目html页面，采用同名依赖，同一文件夹下的html会自动引用同名的css、js文件
    ├─common
    │  ├─style #css工具库，build阶段会被打包成common.css
    │  ├─widget #公共组件，此目录开启同名依赖，上线时会被打包成widget.js, widget.css ....
    │  │   ├─header
    │  │   ├─footer
    │  │   └─scrollBar
    │  ├─lib
    │  ├─images
    │  └─js 其他js文件
    └─test

说明：fis3内置[依赖声明](http://fis.baidu.com/fis3/docs/user-dev/require.html)语法

构建后

    dest
    ├─static
    ├─images
    ├─css
    ├─js
    ├─test
    └─html







  