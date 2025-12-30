(function () {
  'use strict';

  var manifest = {
    //id: 'com.example.myplugin',
    version: '0.0.1',
    author: '@xyz',
    name: 'xyz name',
    description: 'xyz description',
    //url: 'https://example.com/plugin.js',
    //icon: 'https://example.com/icon.png',
  };

  // 1. Init plugin
  // function startPlugin() {
  //   console.log(manifest.name + ' успешно запущен');

  //   Lampa.Component.add('my_plugin_component', {
  //     // логика компонента
  //   });
  // }

  // // Ожидание готовности Lampa перед запуском
  // if (window.appready) startPlugin();
  // else {
  //   Lampa.Listener.follow('app', function (e) {
  //     if (e.type == 'ready') startPlugin();
  //   });
  // }

  function pluginXYZ() {
    var EXPIRE_PREMIUM = 1000 * 60 * 60 * 24 * 10;

    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      if (this._url && this._url.includes('/users/')) {
        this.addEventListener('readystatechange', function () {
          // readyState 4 — запрос завершен
          if (this.readyState === 4) {
            try {
              //console.log(`[!!!!! XHR Response] От ${this._url}:`, this.responseText);
              //console.log(`[!!!!! XHR Response] От ${this._url}:`, this);

              var originalData = JSON.parse(this.responseText);
              //console.log(`[!!!!! XHR Response] originalData:`, originalData);

              if (originalData && originalData.user) {
                originalData.user.premium = Date.now() + EXPIRE_PREMIUM;
              }
              var modifiedJSON = JSON.stringify(originalData);

              Object.defineProperty(this, 'responseText', {
                get: () => modifiedJSON,
                configurable: true,
              });

              Object.defineProperty(this, 'response', {
                get: () => modifiedJSON,
                configurable: true,
              });
            } catch (e) {
              console.error('[lampa-premium] Error:', e);
            }
          }
        });
      }

      return originalSend.apply(this, arguments);
    };
  }

  function startPlugin() {
    //console.log('RAd: startPlugin(): 1');
    window.plugin_____remove_ad = true;

    //Lampa.Manifest.plugins = manifest;
    var updateplugins = false;
    var plugins = Lampa.Storage.get('plugins', '[]');
    plugins.forEach(function (plug) {
      if (plug.url.indexOf('artsmv1.github.io') >= 0) {
        updateplugins = true;
        plug.author = manifest.author;
        plug.name = manifest.name;
        plug.version = manifest.version;
      }
    });
    if (updateplugins) {
      Lampa.Storage.set('plugins', plugins);
    }

    pluginXYZ();
  } /* startPlugin() */

  if (!window.plugin_____remove_ad) startPlugin();
})();
