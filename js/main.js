(function () {
  "use strict";


  Vue.component('edit-in-place', {
    template: '#edit-in-place-template',
    methods: {
      edit: function () {
        this.editing = true;
        var self = this;
        Vue.nextTick(function () {
          self.inputEl().focus();
        });
      },
      unedit: function () {
        this.inputEl().blur();
        this.editing = false;
      },
      jump: function () {
        var e = this.$event;
        e.preventDefault();
        this.unedit();
        var idx = this.jump_idx;
        if (e.shiftKey) {
          idx--;
        } else {
          idx++;
        }
        this.$dispatch('jump-cel', idx);
      },
      inputEl: function () {
        return this.$el.querySelector('input');
      },
    },
    compiled: function () {
      this.$set('editing', false);
      this.$set('type', this.type || 'text');

      var self = this;
      this.$on('edit-cel', function (idx) {
        if (self.jump_idx === idx) {
          self.edit();
        }
      });
    },
  });


  Vue.component('ryotei-table', {
    template: '#ryotei-table-template',
    methods: {
      enabled_place: function (idx) {
        return idx % 2 === 0;
      },
      enabled_route: function (idx) {
        return idx % 2 === 1;
      },
      add: function () {
        this.places.push({t: 'Place'});
        this.times.push({ t: '00:00'});
        this.times.push({ t: '00:00'});
        this.routes.push({t: 'Route'});
      },
      save: function () {
        var s = new Storage(this.index);
        s.save(this.obj);
        this.$dispatch('tab-save', this.index);
      },
      load: function () {
        var s = new Storage(this.index);
        var obj = s.load();
        this.name   = obj.name;
        this.places = obj.places;
        this.times  = obj.times;
        this.routes = obj.routes;
      },
    },
    computed: {
      table_size: function () {
        var self = this;
        return _.max([
          self.places.length * 2,
          self.routes.length * 2 + 1,
          self.times.length + 1,
        ]);
      },
      obj: function () {
        return {
          name:   this.name,
          places: this.places,
          times:  this.times,
          routes: this.routes,
        };
      },
    },
    created: function () {
      this.$set('places', []);
      this.$set('times', []);
      this.$set('routes', []);
      this.$set('name', '');
    },
    ready: function () {
      var self = this;
      this.load();

      this.$on('jump-cel', function (idx) {
        var l = self.places.length + self.times.length + self.routes.length;
        if (l === idx) {
          self.add();
        }
        Vue.nextTick(function () {
          self.$broadcast('edit-cel', idx);
        });
      });

      var f = function () {
        self.$dispatch('tab-change', self.index);
      };
      this.$watch('name',   f, true);
      this.$watch('places', f, true);
      this.$watch('times',  f, true);
      this.$watch('routes', f, true);
      console.log(this);
    },
  });

  var app = new Vue({
    el: '#vue-main',
    data: {
      current_tab: 0,
    },
    methods: {
      show_tab: function (idx) {
        this.current_tab = idx;
      },
      active_tab: function (idx) {
        return this.current_tab === idx;
      },
      tab_name: function (idx) {
        return this.tab_names[idx].name;
      },
      add: function (data) {
        var l = this.tab_names.length;
        var st = new Storage(l);
        var v = data || {
          name: 'New Ryotei',
          places: [{t: 'Place'}, {t: 'Place'}],
          times: [{t: '00:00'}, {t: '00:00'}],
          routes: [{t: 'Route'}],
        };
        st.save(v);
        this.tab_names.push({name: v.name, _uid: v._uid});
        this.current_tab = l;
      },
      del: function () {
        var idx = this.current_tab;
        this.tab_names.splice(idx, 1);
        var st = new Storage(idx);
        st.remove();
        this.current_tab = idx === 0 ? 0 : idx - 1;
      },
      fork: function () {
        var idx = this.current_tab;
        var st = new Storage(idx);
        var data = st.load();
        data.name += ' new';
        this.add(data);
      },
      exportAsJSON: function () {
        // XXX: Not beautiful
        var data = Storage.all_data();
        alert(JSON.stringify(data));
      },
      importByJSON: function () {
        // XXX: NOT Beautiful
        var json = window.prompt();
        if (!json) {return;}

        Storage.importByJSON(json);
      },
      toggle_dropdown: function () {
        if (this.dropdown_style.display === 'none') {
          this.dropdown_style.display = 'block';
        } else {
          this.dropdown_style.display = 'none';
        }
      },
    },
    created: function () {
      var self = this;
      var names = Storage.names();
      this.$set('tab_names', names);
      this.$set('dropdown_style', {display: 'none'});

      this.$on('tab-change', function (idx) {
        self.tab_changes.$set(idx, true);
      });

      this.$on('tab-save', function (idx) {
        self.tab_changes.$set(idx, false);
      });

      var tab_changes = [];
      _.times(names.length, function (idx) {
        tab_changes.push(false);
      });

      this.$set('tab_changes', tab_changes);
    },
  });

  console.log(app);

})();
