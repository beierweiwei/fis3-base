// 设置项目属性
fis.set('project.name', 'fis3-base');
fis.set('project.static', '/static');
fis.set('project.files', ['*.html', 'map.json', '/test/*']);

// 引入模块化开发插件，设置规范为 commonJs 规范。

fis.hook('commonjs', {
    // baseUrl: './modules',
     extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
});

/*************************目录规范*****************************/
//npm模块管理
fis.match('/node_modules/**.js', {
    isMod: true,
    useSameNameRequire: true
});


fis.match('*', {
    release: '${project.static}/$0'
});

// 所有模板放到 tempalte 目录下
fis.match('**.html', {
    release: '/template/$0'
});

//page页面放到项目顶层
fis.match('/pages/(*.html)', {
    release:'/$1'
});

fis.match('/pages/**/(*.html)', {
    release:'/$1',
});
//mods源码目录下是需要包装的js组件
fis.match('/mods/**', {
    isMod: true,
    useSameNameRequire: true
});

fis.match('**.{scss, css}',{
    release: '/${project.static}/style/$0',
})
fis.match('**.{js, es}',{
    release: '/${project.static}/js/$0',
})
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
fis.unhook('components')
fis.hook('node_modules')
// 开启同名依赖
fis.match('/common/widgets/**', {
    useSameNameRequire: true
});

fis.match('/pages/**', {
    useSameNameRequire: true
});



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
        // include_paths: ['modules/css', 'components'] // 加入文件查找目录
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
        browsers: ['IE >= 8', 'Chrome >= 30', 'last 2 versions'] // pc
            // browsers: ['Android >= 4', 'ChromeAndroid > 1%', 'iOS >= 6'] // wap
    })
});



// 配置js
// fis.match(/^\/modules\/(.*\.es)$/i, {
//     parser: fis.plugin('babel-5.x'),
//     rExt: 'js',
//     isMod: true,
//     release: '${project.static}/$1'
// });
// fis.match(/^\/modules\/(.*\.js)$/i, {
//     isMod: true,
//     release: '${project.static}/$1'
// });


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
fis.match('/test/**', {
    release: '$0'
});
fis.match('/test/server.conf', {
    release: '/config/server.conf'
});


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
        host: 'http://yanhaijing.com',
        path: '/${project.name}'
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
        .match('/lib/es5-{shim,sham}.js', {
            packTo: '/pkg/es5-shim.js'
        })
        .match('/common/**.{scss, css}', {
            packTo: '/pkg/common.css'
        })
        .match('/common/**.js', {
            packTo: '/pkg/common.js'
        })
        .match('/common/widgets/**.js', {
            packTo: '/pkg/widgets.js'
        })
        .match('/common/widgets/**.{scss, css}', {
            packTo: '/pkg/widgets.css'
        })

});


// 压缩css js html
Object.keys(map)
    .filter(function(v) {
        return v.indexOf('debug') < 0
    })
    .forEach(function(v) {
        fis.media(v)
            // .match('**.html', {
            //     optimizer: fis.plugin('html-compress')
            // })
            .match('**.{es,js}', {
                optimizer: fis.plugin('uglify-js')
            })
            .match('**.{scss,less,css}', {
                optimizer: fis.plugin('clean-css', {
                    'keepBreaks': true //保持一个规则一个换行
                })
            });
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
// ['rd', 'rd-debug'].forEach(function(v) {
//     fis.media(v)
//         .match('*', {
//             deploy: [
//                 fis.plugin('skip-packed', {
//                     // 默认被打包了 js 和 css 以及被 css sprite 合并了的图片都会在这过滤掉，
//                     // 但是如果这些文件满足下面的规则，则依然不过滤
//                     ignore: []
//                 }),
//                 fis.plugin('http-push', {
//                     receiver: 'xxx/fisreceiver.php',
//                     to: 'xxx/' + fis.get('project.name')
//                 })
//             ]
//         });
// });
