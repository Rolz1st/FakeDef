import { useEffect, useState } from 'react';
import { findByPropsLazy, find, React } from '@webpack';
import { Keybinds } from '@api/Keybinds';
import { UserStore, VoiceStateStore } from '@webpack/common';
import { Toasts } from '@webpack';
import { PermissionsBits, PermissionStore } from '@webpack/common';
import { Button } from '@components/Button';

const MuteDeafPlugin = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    const handleMuteDeafToggle = () => {
        const currentUserId = UserStore.getCurrentUser().id;

        // Fetch all voice states, then find the current user's voice state
        const voiceStates = VoiceStateStore.getAllVoiceStates();
        const userVoiceState = voiceStates[currentUserId];

        if (!userVoiceState) return;

        // Toggle mute and deaf states
        const newMuteState = !userVoiceState.selfMute;
        const newDeafState = !userVoiceState.selfDeaf;

        setIsMuted(newMuteState);
        setIsDeafened(newDeafState);

        // Update the voice state
        VoiceStateStore.updateVoiceState({
            ...userVoiceState,
            selfMute: newMuteState,
            selfDeaf: newDeafState,
        });

        // Show toast message indicating the status change
        Toasts.show({
            message: `User ${newMuteState ? 'muted' : 'unmuted'} and ${newDeafState ? 'deafened' : 'undeafened'}`,
            id: Toasts.genId(),
            type: Toasts.Type.SUCCESS,
        });
    };

    useEffect(() => {
        // Register the F11 keybinding for toggling mute/deaf
        const handleF11 = (e: KeyboardEvent) => {
            if (e.key === 'F11') {
                handleMuteDeafToggle();
            }
        };

        window.addEventListener('keydown', handleF11);

        return () => {
            window.removeEventListener('keydown', handleF11);
        };
    }, []);

    return (
        <div>
            <Button onClick={handleMuteDeafToggle}>
                Toggle Mute/Deaf
            </Button>
            <div>
                {isMuted ? 'Muted' : 'Unmuted'} | {isDeafened ? 'Deafened' : 'Undeafened'}
            </div>
        </div>
    );
};

export default MuteDeafPlugin;
