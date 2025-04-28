import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AudioCall = () => {
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const localAudioTrackRef = useRef(null);
  const clientRef = useRef(null);

  const appId = '740baf604340463486afea8a267cc8e8'; // Replace with your Agora App ID
  const channel = 'audio-channel'; // Replace with your desired channel name
  const token = null; // Replace with your token if needed

  const handleJoinCall = async () => {
    if (joined) {
      console.log('Already joined the call.');
      return;
    }

    try {
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });

      clientRef.current.on('user-published', handleUserPublished);
      clientRef.current.on('user-left', handleUserLeft);
      clientRef.current.on('network-quality', handleNetworkQuality);

      await clientRef.current.join(appId, channel, token, null);

      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localAudioTrack;

      await clientRef.current.publish([localAudioTrack]);

      setJoined(true);
      setCallStartTime(new Date());
    } catch (error) {
      console.error('Error joining the channel:', error);
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    if (mediaType === 'audio') {
      await clientRef.current.subscribe(user, 'audio');
      user.audioTrack.play();

      setRemoteUsers((prevUsers) => {
        const exists = prevUsers.some((u) => u.uid === user.uid);
        return exists ? prevUsers : [...prevUsers, user];
      });
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  };

  const handleNetworkQuality = (stats) => {
    console.log('Network Quality:', stats);
  };

  const handleMuteUnmute = async () => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        await localAudioTrackRef.current.setEnabled(true); // Unmute
      } else {
        await localAudioTrackRef.current.setEnabled(false); // Mute
      }
      setIsMuted(!isMuted);
    }
  };

  const handleLeaveCall = async () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
    }

    if (clientRef.current) {
      await clientRef.current.leave();
    }

    setRemoteUsers([]);
    setJoined(false);
    setCallDuration(0);
    setCallStartTime(null);
    setIsMuted(false);
  };

  useEffect(() => {
    let timer;
    if (callStartTime) {
      timer = setInterval(() => {
        setCallDuration(Math.floor((new Date() - callStartTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [callStartTime]);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.off('user-published', handleUserPublished);
        clientRef.current.off('user-left', handleUserLeft);
        clientRef.current.off('network-quality', handleNetworkQuality);
      }
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      console.log('Microphone access granted.', stream);
      // Do something with the stream
    })
    .catch((error) => {
      console.error('Microphone access denied:', error);
    });

  return (
    <div className='bg-gray-100 p-4 rounded-lg shadow-lg w-[500px] mx-auto mt-10'>
      <h1>Agora Audio Call</h1>

      <div>
        {joined ? (
          <p>You're in the call!</p>
        ) : (
          <button onClick={handleJoinCall}>Join Call</button>
        )}
      </div>

      <div>
        <h3>Remote Users</h3>
        {remoteUsers.length > 0 ? (
          remoteUsers.map((user) => (
            <div key={user.uid}>
              <p>Remote user {user.uid}</p>
            </div>
          ))
        ) : (
          <p>No remote users yet.</p>
        )}
      </div>

      {joined && (
        <div>
          <p>Call Duration: {formatDuration(callDuration)}</p>
          <button onClick={handleMuteUnmute}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={handleLeaveCall}>End Call</button>
        </div>
      )}
    </div>
  );
};

export default AudioCall;
