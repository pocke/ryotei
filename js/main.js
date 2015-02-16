(function () {
  "use strict";

  var Strage = function (name) {
  };

  Vue.component('editable-td', {
    template: '#editable-td-template',
    methods: {
      toggle_edit: function () {
        this.editing = !this.editing;
      },
    },
    compiled: function () {
      this.$set('editing', false);

    },
  });


  var app = new Vue({
    el: '#vue-main',
    data: {
      places: ['高尾', '松本', '長野', '直江津', '富山', '高岡', '氷見', '高岡', '城端', '高岡', '金沢'],
      times: ['0614', '0934', '0937', '1109', '1124', '1258', '1312', '1510', '1524', '1548', '1613', '1641', '1648', '1717', '1728', '1818', '1833', '1921', '1924', '2002'],
      routes: ['中央本線(松本行)', '篠ノ井線(長野行)', '信越本線(直江津行)', '北陸本線(富山行)', '北陸本線(金沢行)', '氷見線(氷見行)', '氷見線(高岡行)', '城端線(城端行)', '城端線(高岡行)', '北陸本線(金沢行)'],
      name: '北陸旅行1日目',
    },
    methods: {
      enabled_place: function (idx) {
        return idx % 2 === 0;
      },
      enabled_route: function (idx) {
        return idx % 2 === 1;
      },
      add: function () {
        this.places.push('');
        this.times.push('');
        this.times.push('');
        this.routes.push('');
      },
      save: function () {
      },
      load: function () {
      },
    },
    computed: {
      table: function () {
        var res = [];
        var self = this;

        var n = _.max([
          self.places.length * 2,
          self.routes.length * 2 + 1,
          self.times.length + 1,
        ]);
        _.times(n, function (idx) {
          var obj = {};

          if (self.enabled_place(idx)) {
            obj.place = self.places[idx/2];
          }

          if (idx!==0) {
            obj.time = self.times[idx-1];
          }

          if (self.enabled_route(idx)) {
            obj.route = self.routes[(idx-1)/2];
          }
          res.push(obj);
        });

        return res;
      },
      json: function () {
        return JSON.stringify({
          places: this.places,
          times:  this.times,
          routes: this.routes,
        });
      },
    }
  });
  console.log(app);

})();
