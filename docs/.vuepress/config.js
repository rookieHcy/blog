module.exports = {
  "title": "I Love Zsn",
  "description": "Later equals never. ",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  // 评论
  "themeConfig": {
    "valineConfig": {
      "appId": 'LVsgxsL3e7scdUrYsMEbLz5i-gzGzoHsz',// your appId
      "appKey": 'tCw25P6ucwIsd3Jrd0GwvUSv', // your appKey
    },
    // 密钥
    // keyPage: {
    //   keys: ['960819'],
    //   color: '#42b983', // 登录页动画球的颜色
    //   lineColor: '#42b983' // 登录页动画线的颜色
    // },
    absoluteSecrecy: true,
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时光鸡",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": '嘀嘀',
        "icon": "reco-message",
        "items": [
          // {
          //   "text": "NPM",
          //   "link": "https://www.npmjs.com/~reco_luan",
          //   "icon": "reco-npm"
          // },
          {
            "text": "爱你",
            "link": "http://www.ilovezsn.com/love.html",
            "icon": "reco-coding"
          },
          // {
          //   "text": "GitHub",
          //   "link": "https://github.com/rookieHcy",
          //   "icon": "reco-github"
          // },
          // {
          //   "text": "简书",
          //   "link": "https://www.jianshu.com/u/cd674a19515e",
          //   "icon": "reco-jianshu"
          // },
          // {
          //   "text": "CSDN",
          //   "link": "https://blog.csdn.net/recoluan",
          //   "icon": "reco-csdn"
          // },
          // {
          //   "text": "博客圆",
          //   "link": "https://www.cnblogs.com/luanhewei/",
          //   "icon": "reco-bokeyuan"
          // },
          // {
          //   "text": "WeChat",
          //   "link": "https://mp.weixin.qq.com/s/mXFqeUTegdvPliXknAAG_A",
          //   "icon": "reco-wechat"
          // }
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "侯春宇",
    "authorAvatar": "/avatar.png",
    //备案
    "record": "京ICP备19005019号-1",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": true
  },
  plugins: [
    [
      "ribbon",
      {
        size: 90,     // width of the ribbon, default: 90
        opacity: 0.8, // opacity of the ribbon, default: 0.3
        zIndex: -1    // z-index property of the background, default: -1
      },
    ],
    ['go-top'],
    [
      "cursor-effects",
      {
        shape: ['star'],  // shape of the particle, default: 'star'
      }
    ],
    [
      "dynamic-title",
      {
        showIcon: "/favicon.ico",
        showText: "(/≧▽≦/)咦！又好了！",
        hideIcon: "/failure.ico",
        hideText: "(●—●)喔哟，崩溃啦！",
        recoverTime: 2000
      }
    ],
    // 禁用无用插件
    ["@vuepress-reco/back-to-top", false],
    // ["@vuepress-reco/extract-code", false],
  ]
}
