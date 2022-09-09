"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_loqed_api = require("loqed-api");
class Loqed extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "loqed"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    let loqedConfig;
    try {
      loqedConfig = JSON.parse(this.config.loqedConfig);
    } catch {
      this.log.error(`Could not parse LOQED config (${this.config.loqedConfig}), please ensure it is valid`);
      return;
    }
    this.subscribeStates("*");
    this.config.port = await this.getPortAsync(this.config.port);
    this.loqedClient = new import_loqed_api.LOQED({
      bridgeKey: loqedConfig.bridge_key,
      apiKey: loqedConfig.backend_key,
      ip: loqedConfig.bridge_ip,
      lockId: loqedConfig.lock_key_local_id,
      port: this.config.port
    });
    this.config.callbackUrl = `${this.config.callbackUrl}:${this.config.port}/`;
    await this.ensureWebhookRegistered();
    await this.syncStatus();
    this.loqedClient.on("STATE_CHANGED", (state) => {
      this.log.info(`State changed to ${state}`);
    });
    this.loqedClient.on("GO_TO_STATE", (state) => {
      this.log.info(`Lock tries to go to ${state}`);
    });
    this.loqedClient.on("UNKNOWN_EVENT", (data) => {
      this.log.warn(`Unknown event: ${JSON.stringify(data)}`);
    });
  }
  async syncStatus() {
    try {
      const status = await this.loqedClient.getStatus();
      await this.extendForeignObjectAsync(this.namespace, {
        type: "device",
        common: {
          name: "LOQED lock"
        },
        native: status
      });
      await this.setStateAsync("info.connection", !!status.lock_online, true);
      await this.setStateAsync("lockStatus.batteryPercentage", status.battery_percentage, true);
      await this.setStateAsync("lockMotor.goToPosition", status.bolt_state, true);
      await this.setStateAsync("lockMotor.currentPosition", status.bolt_state, true);
    } catch (e) {
      this.log.error(`Could not sync status: ${e.message}`);
    }
  }
  async ensureWebhookRegistered() {
    try {
      const webhooks = await this.loqedClient.listWebhooks();
      const webhookRegistered = webhooks.find((entry) => entry.url === this.config.callbackUrl);
      if (webhookRegistered) {
        this.log.info(`Webhook for our application already registered with id ${webhookRegistered.id}`);
      } else {
        this.log.info("No matching webhook found, registering one now");
        await this.loqedClient.registerWebhook(this.config.callbackUrl);
      }
    } catch (e) {
      this.log.error(`Could not ensure, that webhook is registered: ${e.message}`);
    }
  }
  async onUnload(callback) {
    try {
      if (this.loqedClient) {
        await this.loqedClient.stopServer();
      }
      callback();
    } catch {
      callback();
    }
  }
  onStateChange(id, state) {
    if (!state || state.ack) {
      return;
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new Loqed(options);
} else {
  (() => new Loqed())();
}
//# sourceMappingURL=main.js.map
