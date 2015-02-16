(function () {
  "use strict";


  Vue.component('menu-btn', {
    template: '#menu-btn-template',
    inherit: true,
    methods: {
      show: function (page) {
        this.$event.preventDefault();
        history.pushState(page, null, page + '.html');
        this.active = page;
      },
    }
  });


  Vue.component('link-item', {
    template: '#link-item-template',
  });



  var app = new Vue({
    el: '#vue-main',
    data: {
      active: 'about',
      works: {
        applications: [
          {
            title:  'Vim Scouter Web',
            url:    'https://github.com/pocke/vim_scouter_web',
            detail: 'Vim戦闘力をWebから計測',
          },
          {
            title:  'slコマンドが走りました',
            url:    'https://github.com/pocke/sl_tweet',
            detail: 'slコマンドが走る度にTwitterに呟く。',
          },
          {
            title:  'simple_battery',
            url:    'https://github.com/pocke/simple_battery',
            detail: 'ステータスバーにバッテリー残量を表示するだけのアプリケーション',
          },
        ],
        libraries: [
          {
            title:  'goevent',
            url:    'https://github.com/pocke/goevent',
            detail: 'Event dispatcher written by golang.',
          }
        ],
        'mikutter plugins': [
          {
            title:  'mikutter vimize',
            url:    'https://github.com/pocke/mikutter_vimize',
            detail: 'Vimライクなキーバインドを実現するmikutterプラグイン',
          },
          {
            title:  'mikutter_blocked_user_mute',
            url:    'https://github.com/pocke/mikutter_blocked_user_mute',
            detail: 'ブロックしている人をミュートするmikutterプラグイン',
          },
          {
            title:  'mikutter_delete_copy',
            url:    'https://github.com/pocke/mikutter_delete_copy',
            detail: 'つい消ししてそれをコピーするmikutterプラグイン',
          },
          {
            title:  'mikutter_ws_disable_footer',
            url:    'https://github.com/pocke/mikutter_ws_disable_footer',
            detail: 'テキストボックスの先頭が空白文字の時、footerを付与しないようにするmikutterプラグイン',
          },
          {
            title:  'mikutter_block',
            url:    'https://github.com/pocke/mikutter_block',
            detail: 'ユーザーをブロックするmikutterプラグイン',
          },
          {
            title:  'mikutter_r4s',
            url:    'https://github.com/pocke/mikutter_r4s',
            detail: 'ユーザーをスパム報告するmikutterプラグイン',
          },
          {
            title:  'mikutter_tweet_stack',
            url:    'https://github.com/pocke/mikutter_tweet_stack',
            detail: 'ツイートをスタックに退避させることが出来るmikutterプラグイン',
          },
          {
            title:  'mikutter_color_code',
            url:    'https://github.com/pocke/mikutter_color_code',
            detail: '呟かれたカラーコードをツイートの背景色に設定するmikutterプラグイン',
          },
          {
            title:  'mikutter_fav_list',
            url:    'https://github.com/pocke/mikutter_fav_list',
            detail: '面白い人リストをつくるmikutterプラグイン',
          },
          {
            title:  'mikutter_fizzbuzz',
            url:    'https://github.com/pocke/mikutter_fizzbuzz',
            detail: 'fizzubuzzするmikutterプラグイン',
          },
          {
            title:  'mikutter_mention_extract',
            url:    'https://github.com/pocke/mikutter_mention_extract',
            detail: '正規表現でメンション抽出するmikutterプラグイン',
          },
          {
            title:  'mikutter_most_dig',
            url:    'https://github.com/pocke/mikutter_most_dig',
            detail: 'favstarからmostを掘り返すmikutterプラグイン',
          },
          {
            title:  'mikutter_longtweet_KILL',
            url:    'https://github.com/pocke/mikutter_longtweet_KILL',
            detail: '大量の改行を含むツイートを短く表示するmikutterプラグイン',
          },
          {
            title:  'mikutter_sys_msg_tl',
            url:    'https://github.com/pocke/mikutter_sys_msg_tl',
            detail: 'システムメッセージを抽出したタイムラインを作るmikutterプラグイン',
          },
          {
            title:  'mikutter_search_google',
            url:    'https://github.com/pocke/mikutter_search_google',
            detail: 'Googleで検索するmikutterプラグイン',
          },
          {
            title:  'mikutter_optional_API',
            url:    'https://github.com/pocke/mikutter_optional_API',
            detail: '任意のAPIを叩くAPIプラグイン',
          },
        ],
      },
      links: [
        {
          title:  'GitHub: pocke',
          url:    'https://github.com/pocke',
          detail: '作ったものの殆どはここにあります。',
        },
        {
          title:  'Twitter: p_ck_',
          url:    'https://twitter.com/p_ck_',
          detail: '日々の雑多なつぶやき。にゃーんとか呟いています。',
        },
        {
          title:  'Blog: pockestrap',
          url:    'http://pocke.hatenablog.com/',
          detail: '技術系ブログ。学んだことを備忘録ついでに発信。',
        }
      ],
    },
    methods: {
      is_active: function (page) {
        return this.active == page;
      },
    },
  });



  window.addEventListener('popstate', function (e) {
    app.$data.active = e.state;
  });

  var path = location.pathname;
  var m = /^\/(\w+)\.html$/.exec(path);
  var page;
  if (m === null || m[1] === 'index') {
    page = 'about';
  } else {
    page = m[1];
  }
  history.replaceState(page, null);
  app.$data.active = page;
})();
