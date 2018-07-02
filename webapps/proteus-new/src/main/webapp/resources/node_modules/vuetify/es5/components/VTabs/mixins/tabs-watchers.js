'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Tabs watchers
 *
 * @mixin
 */
exports.default = {
  watch: {
    activeTab: function activeTab(tab, prev) {
      !prev && tab && this.updateTabs();

      setTimeout(this.callSlider, 0);

      if (!tab) return;

      var action = tab.action;
      this.tabItems && this.tabItems(action === tab ? this.tabs.indexOf(tab).toString() : action);
    },

    alignWithTitle: 'callSlider',
    centered: 'callSlider',
    fixedTabs: 'callSlider',
    hasArrows: function hasArrows(val) {
      if (!val) this.scrollOffset = 0;
    },

    isBooted: 'findActiveLink',
    lazyValue: 'updateTabs',
    right: 'callSlider',
    value: function value(val) {
      this.lazyValue = val;
    },

    '$vuetify.application.left': 'onResize',
    '$vuetify.application.right': 'onResize',
    scrollOffset: function scrollOffset(val) {
      this.$refs.container.style.transform = 'translateX(' + -val + 'px)';
      if (this.hasArrows) {
        this.prevIconVisible = this.checkPrevIcon();
        this.nextIconVisible = this.checkNextIcon();
      }
    }
  }
};