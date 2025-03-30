/**
 * @name FakeMute&Deafen
 * @version 1
 * @description Allows you to fake mute and deafen yourself, shows for others. This has been found by many others but I've decided to add some features to beautify it.
 * @author Shifts
 * @source https://github.com/ignshifts
 */

export default class FakeMuteDeafen {
    constructor() {
        this.text = new TextDecoder("utf-8");
        this.originalSend = globalThis.WebSocket.prototype.send;
        this.enabled = false; // Track the plugin's enabled state
    }

    start() {
        try {
            // Set up key event listener for F11
            this.setupF11Listener();
        } catch (error) {
            console.error("Error while starting FakeMuteDeafen plugin:", error);
        }
    }

    stop() {
        try {
            // Restore the original WebSocket send method and clean up
            globalThis.WebSocket.prototype.send = this.originalSend;
            this.cleanupF11Listener();
        } catch (error) {
            console.error("Error while stopping FakeMuteDeafen plugin:", error);
        }
    }

    // Set up event listener for the F11 key
    setupF11Listener() {
        this.handleKeyPress = (event) => {
            if (event.key === "F11") {
                this.togglePlugin();
            }
        };

        // Listen for F11 key press
        window.addEventListener('keydown', this.handleKeyPress);
    }

    // Clean up the event listener when the plugin is stopped
    cleanupF11Listener() {
        window.removeEventListener('keydown', this.handleKeyPress);
    }

    // Toggle the plugin's functionality
    togglePlugin() {
        if (this.enabled) {
            this.disablePlugin();
        } else {
            this.enablePlugin();
        }
    }

    // Enable the plugin (fake mute and deafen)
    enablePlugin() {
        try {
            // Overriding WebSocket's send function to simulate mute and deafen
            globalThis.WebSocket.prototype.send = (data) => {
                if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
                    if (this.text.decode(data).includes("self_deaf")) {
                        data = data.replace('"self_mute":false', '"self_mute":true');
                    }
                }
                this.originalSend.apply(this, [data]);
            };

            // Show success message
            const Toasts = BdApi.findModuleByProps("Toasts");
            if (Toasts) {
                Toasts.show({
                    message: "FakeMute & Deafen enabled!",
                    id: Toasts.genId(),
                    type: Toasts.Type.SUCCESS,
                });
            }

            this.enabled = true; // Update the state to reflect that the plugin is enabled
        } catch (error) {
            console.error("Error while enabling FakeMuteDeafen plugin:", error);
        }
    }

    // Disable the plugin (restore normal mute and deafen)
    disablePlugin() {
        try {
            // Restore the original WebSocket send method when the plugin stops
            globalThis.WebSocket.prototype.send = this.originalSend;

            // Show success message
            const Toasts = BdApi.findModuleByProps("Toasts");
            if (Toasts) {
                Toasts.show({
                    message: "FakeMute & Deafen disabled!",
                    id: Toasts.genId(),
                    type: Toasts.Type.SUCCESS,
                });
            }

            this.enabled = false; // Update the state to reflect that the plugin is disabled
        } catch (error) {
            console.error("Error while disabling FakeMuteDeafen plugin:", error);
        }
    }
}
