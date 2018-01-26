##目录规范
     页面为基础
传统jquery开发方式组件化其实只是单纯的将页面分割。
组件代码只是简单的嵌入。

##模块依赖
未模块化的插件
已模块化的插件
模块加载器

##css、font、图片资源

##公共文件
  common.css
  common.js 
  images>
##守屏加载
  index.html 
    index.css + common.css (reset.css, bootsrop.css, ...) 
  other.html common.css common.js page.js page.css 
         

lib(不依赖编译，在页面级别中直接引用的类库)
    mod.js 
    babel.js 

mods(需要mod包装的模块话插件) mods.js
   jquery
   loadsh
   fetch 
common common.css common.js 
   widget
       header 
       footer
       header2
    css
      index.css
    js 
    images            
page index.html index.js index.css  xxx.html pages.js pages.css widget.js widget.css  
  home
    widget
      swiper
      banner
  user 
  login 
static 
asset
  style 
    _fn
    _var
    _mixin
  fonticon
  images
test

打包后

dest 
    static
      images
      wedget  
      css
      js    
    html
  



  