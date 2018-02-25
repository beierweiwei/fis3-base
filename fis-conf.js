// 设置项目属性
fis.set('project.name', 'reportcharts');
fis.set('project.static', '/static');
fis.set('project.files', ['*.html', 'map.json', '/test/*', '/lib/**','/mock/*']);

// 引入模块化开发插件，设置规范为 commonJs 规范。
fis.hook('commonjs', {
    // baseUrl: './modules',
     extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
});

/*************************文件处理*****************************/
fis.match('*', {
  release: '${project.static}/$0'
});

//js文件
fis.match('**.{js,es}',{
  release: '/${project.static}/js/$0'
})

//css、scss
fis.match('**.{scss, css}',{
  useSprite: true,
  release: '/${project.static}/css/$0'
})

/*************************目录规范*****************************/

//common
fis.match('/common/style/(**)', {
  release: '/${project.static}/css/$1'
})


fis.match('/common/images/(**)', {
  release: '/${project.static}/images/$1'
})

//widgets
fis.match('/common/widgets/**', {
  useSameNameRequire: true
});
fis.match('widgets/**.html', {
    release: false
});

//page页面

fis.match('/pages/(*.html)', {
    release:'/$1'
});

fis.match('/pages/**/(*.html)', {
    release:'/$1',
});

fis.match('/pages/**.js', {
  isMod: true,
})
//page
fis.match('/pages/**', {
  useSameNameRequire: true
});


//mods源码目录下是需要包装的js组件
fis.match('/mods/**', {
    isMod: true,
    useSameNameRequire: true
});

//lib目录直接产出到static/lib
fis.match('/lib/**', {
  release: '/${project.static}/$0'
})

fis.match('/lib/layer/need/layer.css', {
  release: '/${project.static}/js/need/layer.css'
})

//npm模块管理
fis.match('/node_modules/(**.js)', {
  isMod: true,
  useSameNameRequire: true,
  release: '/${project.static}/js/mods/$1',
});

fis.match('/node_modules/(**.{css,scss})', {
  isMod: true,
  useSameNameRequire: true,
  release: '/${project.static}/css/mods/$1',
});

// test 目录直接产出出到 test 目录下
fis.match('/test/**/*', {
  release: '$0'
});

//以_开头的文件不产出
fis.match('_*', {
  release: false,
})


//模块化开发
// 禁用components，结合mod.js 兼容npm安装的库
//https://github.com/fex-team/fis3-hook-node_modules/issues
fis.unhook('components');
fis.hook('node_modules');

// ------ 全局配置
// 允许你在 js 中直接 require css+文件
fis.match('*.{js,es}', {
    preprocessor: [
        fis.plugin('js-require-file'),
        fis.plugin('js-require-css', {
            mode: 'dependency'
        })
    ]
});

// 配置图片压缩
fis.match('**.png', {
    optimizer: fis.plugin('png-compressor', {
        type: 'pngquant'
    })
});

// 配置css
fis.match('*.scss', {
    parser: fis.plugin('node-sass', {
        // include_paths: ['modules/style', 'components'] // 加入文件查找目录
    })
});
// fis.match(/^\/modules\/(.*\.less)$/i, {
//     parser: fis.plugin('less', {
//         paths: []
//     })
// });
fis.match(/^\/(.*\.(scss|less|css))$/i, {
    rExt: '.css',
    // isMod: true,
    // release: '${project.static}/$1',
    postprocessor: fis.plugin('autoprefixer', {
        //browsers: ['IE >= 8', 'Chrome >= 30', 'last 2 versions'] // pc
        browsers: ['Android >= 4', 'ChromeAndroid > 1%', 'iOS >= 6'] // wap
    })
});

// fis.match('*.{css, scss}', {
//   postprocessor: fis.plugin('px2rem', {
//     remUnit: 75,
//     threeVersion: false,
//     remVersion: true,
//     baseDpr: 2,
//     remPrecision: 6
//   })
// })

// 配置js
fis.match('/pages/**.{js, es}', {
    parser: fis.plugin('babel-5.x'),
    rExt: 'js',
    isMod: true,
});

fis.match('/common/widgets/**.{js, es}', {
  parser: fis.plugin('babel-5.x'),
  rExt: 'js',
  isMod: false,
});


// ------ 配置前端模版 使用template.js
// fis.match('**.tmpl', {
//     parser: fis.plugin('template', {
//         sTag: '<#',
//         eTag: '#>',
//         global: 'template'
//     }),
//     isJsLike: true,
//     release: false
// });
//
// var pugConf = {
//   doctype: 'html', // default html
//   pretty: ' ', // default '  '
// };

// fis.match('**.{pug,jade}', {
//   parser: fis.plugin('pug', pugConf),
//   release: '${project.static}/$&'
// });


// ------ 配置模拟数据
fis.match('/mock/**', {
    release: '$0'
});
// fis.match('/test/server.conf', {
//     release: '/config/server.conf'
// });

/*************************打包规范*****************************/

// 因为是纯前端项目，依赖不能自断被加载进来，所以这里需要借助一个 loader 来完成，
// 注意：与后端结合的项目不需要此插件!!!

fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});
fis.match('/lib/**.js', {
  packTo: '/pkg.lib.js'
})
.match('/lib/**.css', {
  packTo: '/pkg.lib.css'
})

// debug后缀 不会压缩
var map = {
    'rd': {
        host: '',
        path: ''
    },
    'rd-debug': {
        host: '',
        path: ''
    },
    'prod': {
        host: '',
        // path: '/${project.name}'
        //path: '/'
    },
    'prod-debug': {
        host: '',
        path: ''
    }
};


// 通用 1.替换url前缀 2.添加mr5码 3.打包 4.合图 5.重新定义资源路径
Object.keys(map).forEach(function(v) {
    var o = map[v];
    var domain = o.host + o.path;

    fis.media(v)
        .match('**.{es,js}', {
            useHash: true,
            domain: domain
        })
        .match('**.{scss,less,css}', {
            useSprite: true,
            useHash: true,
            domain: domain
        })
        .match('::image', {
            useHash: true,
            domain: domain
        })
        .match('**/(*_{x,y,z}.png)', {
            release: '/pkg/$1'
        })
        // 启用打包插件，必须匹配 ::package
        .match('::package', {
            spriter: fis.plugin('csssprites', {
                layout: 'matrix',
                // scale: 0.5, // 移动端二倍图用
                margin: '10'
            }),
            postpackager: fis.plugin('loader', {
                // allInOne: true,
            })
        })
        /*打包分为3个层：
         * 插件: /lib/**.js => lib.js   /lib/**.css => lib.css  /lib/**.jpg => common/lib/**.jpg
         * 公共逻辑: /common/js/**.js => common.js  /common/style/**.css => common.css
         * 公共组件：/common/widgets/**.js,css => widgets.js,css
         * 页面单独逻辑js,css
         *
         * */
        .match('/lib/es5-{shim,sham}.js', {
          packTo: '/pkg.es5-shim.js'
        })
        .match('/common/**.{scss, css}', {
          packTo: '/pkg.common.css'
        })
        .match('/common/**.js', {
          packTo: '/pkg.common.js'
        })
        .match('/common/widgets/**.js', {
          packTo: '/pkg.widgets.js'
        })
        .match('/common/widgets/**.{scss, css}', {
          packTo: '/pkg.widgets.css'
        })
});


//不带debug模式 压缩css js html
Object.keys(map)
    .filter(function(v) {
        return v.indexOf('debug') < 0
    })
    .forEach(function(v) {
        fis.media(v)
            .match('**.html', {
                optimizer: fis.plugin('html-compress')
            })
            .match('**.{es,js}', {
                optimizer: fis.plugin('uglify-js')
            })
            .match('**.{scss,less,css}', {
                optimizer: fis.plugin('clean-css', {
                    'keepBreaks': true //保持一个规则一个换行
                })
            })
    });

// 本地产出发布
fis.media('prod')
    .match('**', {
        deploy: [
            fis.plugin('skip-packed', {
                // 默认被打包了 js 和 css 以及被 css sprite 合并了的图片都会在这过滤掉，
                // 但是如果这些文件满足下面的规则，则依然不过滤
                ignore: []
            }),

            fis.plugin('local-deliver', {
                to: 'output'
            })
        ]
    });


// 发布到指定的机器
['rd', 'rd-debug'].forEach(function(v) {
    fis.media(v)
        .match('*', {
            deploy: [
                fis.plugin('skip-packed', {
                    // 默认被打包了 js 和 css 以及被 css sprite 合并了的图片都会在这过滤掉，
                    // 但是如果这些文件满足下面的规则，则依然不过滤
                    ignore: []
                }),
                // fis.plugin('http-push', {
                //     receiver: '127.0.0.1:8080',
                //     to: '/' + fis.get('project.name'),
                // })
                fis.plugin('sftp-client', {
                from: ['/'],
                to: ['xxxx/'],   // 远程文件目录，注意！！！设置错误将导致文件被覆盖
                host: 'xxxx',
                // port: '22',
                username: 'xxxx',
                password: 'xxx'
              })
            ]


        });
});
