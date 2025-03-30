/*
 * Fake Deafen and Mute plugin for Vencord
 * Copyright (c) 2025 <RoLz>
 * License: GPL-3.0-or-later
 */

import { ZLibrary } from "@modules";
import { Toasts } from "@webpack/common";
import { UserStore, VoiceStateStore, ChannelStore } from "@webpack/common";
import { definePlugin } from "@utils/types";
import { findStoreLazy } from "@webpack";

class FakeDeafenMutePlugin {

    constructor() {
        this.isDeafened = false;
        this.isMuted = false;
        this.isPluginActive = false; // Track whether plugin is active
    }

    getName() {
        return "Fake Deafen & Mute";
    }

    getDescription() {
        return "Simulate deafen and mute states without actually changing your real audio status.";
    }

    getVersion() {
        return "1.0.0";
    }

    getAuthor() {
        return "<RoLz>";
    }

    start() {
        if (!global.ZeresPluginLibrary) {
            return window.BdApi.alert(
                "Library Missing",
                `The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`
            );
        }

        // Add event listener for F11 key
        this.addF11Listener();

        window.BdApi.alert("Fake Deafen & Mute", "The plugin is now active. Press F11 to toggle fake deafen and mute.");
    }

    stop() {
        // Remove event listener for F11 key when the plugin is stopped
        this.removeF11Listener();

        window.BdApi.alert("Fake Deafen & Mute", "The plugin has been stopped.");
    }

    addF11Listener() {
        document.addEventListener("keydown", this.handleF11KeyPress.bind(this));
    }

    removeF11Listener() {
        document.removeEventListener("keydown", this.handleF11KeyPress.bind(this));
    }

    handleF11KeyPress(event) {
        // Check if F11 key is pressed
        if (event.key === "F11") {
            this.toggleFakeDeafenMute();
        }
    }

    toggleFakeDeafenMute() {
        if (this.isPluginActive) {
            // Toggle Deafen and Mute only when plugin is active
            this.isDeafened = !this.isDeafened;
            this.isMuted = !this.isMuted;
            this.updateState();
        }
    }

    updateState() {
        // Display a Toast when toggling the state
        if (this.isDeafened && this.isMuted) {
            Toasts.show({
                message: "You are now Fake Deafened and Muted",
                type: Toasts.Type.SUCCESS
            });
        } else if (this.isDeafened) {
            Toasts.show({
                message: "You are now Fake Deafened",
                type: Toasts.Type.SUCCESS
            });
        } else if (this.isMuted) {
            Toasts.show({
                message: "You are now Fake Muted",
                type: Toasts.Type.SUCCESS
            });
        } else {
            Toasts.show({
                message: "Fake Deafen and Mute are turned off",
                type: Toasts.Type.SUCCESS
            });
        }

        // You can add custom UI changes here if needed to visually reflect the fake mute/deafen.
    }
}

// Export the plugin as Vencord plugin
export default definePlugin({
    name: "Fake Deafen & Mute",
    description: "Simulate deafen and mute states without actually changing your real audio status.",
    authors: ["<RoLz>"],

    start() {
        const plugin = new FakeDeafenMutePlugin();
        plugin.start();
    },

    stop() {
        const plugin = new FakeDeafenMutePlugin();
        plugin.stop();
    }
});
