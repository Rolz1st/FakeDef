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
    const voiceState = VoiceStateStore.getVoiceStatesForChannel(currentUserId);
    if (!voiceState) return;

    const userVoiceState = voiceState[currentUserId];
    if (userVoiceState) {
      // Toggle mute and deaf
      const newMuteState = !userVoiceState.selfMute;
      const newDeafState = !userVoiceState.selfDeaf;

      setIsMuted(newMuteState);
      setIsDeafened(newDeafState);

      // Simulate muting and deafening the user
      VoiceStateStore.updateVoiceState({
        ...userVoiceState,
        selfMute: newMuteState,
        selfDeaf: newDeafState,
      });

      Toasts.show({
        message: `User ${newMuteState ? 'muted' : 'unmuted'} and ${newDeafState ? 'deafened' : 'undeafened'}`,
        id: Toasts.genId(),
        type: Toasts.Type.SUCCESS,
      });
    }
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
