/**
 * @name FakeMute&Deafen
 * @version 1
 * @description Allows you to fake mute and deafen yourself, shows for others. This has been found by many others but I've decided to add some features to beautify it.
 * @author Shifts
 * @source https://github.com/ignshifts
 */

import { findByPropsLazy, findStoreLazy, useState } from "@webpack";

export default class FakeMuteDeafen {
    constructor() {
        this.text = new TextDecoder("utf-8");
    }

    start() {
        // Overriding WebSocket's send function
        const originalSend = globalThis.WebSocket.prototype.send;
        globalThis.WebSocket.prototype.send = (data) => {
            if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
                // Check if it contains the self_deaf key and replace the mute state
                if (this.text.decode(data).includes("self_deaf")) {
                    data = data.replace('"self_mute":false', '"self_mute":true');
                }
            }
            originalSend.apply(this, [data]);
        };

        // Show alert or notification to the user
        const Toasts = findByPropsLazy("Toasts");
        Toasts.show({
            message: "FakeMute & Deafen has been enabled!",
            id: Toasts.genId(),
            type: Toasts.Type.SUCCESS,
        });

        // Optional: Automatically disable the plugin after it’s loaded (if desired)
        this.disablePlugin();
    }

    stop() {
        // Revert any changes made during start
        const originalSend = globalThis.WebSocket.prototype.send;
        globalThis.WebSocket.prototype.send = originalSend; // Restore the original WebSocket send method
    }

    disablePlugin() {
        // Disable this plugin automatically after use
        const PluginActions = findStoreLazy("PluginActions");
        if (PluginActions) {
            PluginActions.disablePluginByName("FakeMute&Deafen");
        }
    }
}
