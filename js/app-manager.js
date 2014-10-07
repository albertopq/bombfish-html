var AppManager = {
  MANIFEST_PATH: window.location.href + 'manifest.webapp',
  installable: false,
  alreadyInstalled: false,
  confirmView: null,
  cancelButton: null,
  confirmButton: null,
  init: function am_init() {
    var self = this;
    this.confirmView = document.querySelector('[data-type="confirm"]');
    var buttons = this.confirmView.getElementsByTagName('button');
    this.cancelButton = buttons[0];
    this.confirmButton = buttons[1];

    this.cancelButton.addEventListener('click', function onCancel(event) {
      utils.hide(self.confirmView);
      event.preventDefault();
      return false;
    });
    this.confirmButton.addEventListener('click', function onConfirm(event) {
      self.install();
      event.preventDefault();
      return false;
    });

    if (navigator.mozApps) {
      this.installable = true;
      var request = navigator.mozApps.getSelf();
      var self = this;
      request.onsuccess = function onGetApp() {
        if(this.result) {
          self.alreadyInstalled = true;
        } else {
          utils.show(self.confirmView);
        }
      }
    }
  },

  install: function am_install() {
    utils.hide(this.confirmView);
    if (this.alreadyInstalled)
      return false;
    request = navigator.mozApps.install(this.MANIFEST_PATH);
    var self = this;
    request.onsuccess = function onInstall() {
      self.alreadyInstalled = true;
    };
    request.onerror = function onError() {
      console.error('Install failed: ' + this.error.name);
    };
  }
};

window.addEventListener('DOMContentLoaded', function onLoaded() {
  window.removeEventListener('DOMContentLoaded', onLoaded);
  AppManager.init();
})
