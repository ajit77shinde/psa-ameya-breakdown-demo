import { useEffect, useRef, useState } from 'react';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function VoiceNote({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <div className="voice-note">
      <strong>Voice recording</strong>
      <audio controls src={src} />
    </div>
  );
}

export function VoiceRecorder({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    setRecording(false);
    stopTimer();
  };

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      stopTracks();
      stopTimer();
    };
  }, []);

  const startRecording = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Voice recording is not available in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        stopTracks();
        const blob = new Blob(chunks, {
          type: recorder.mimeType || 'audio/webm',
        });
        if (blob.size === 0) return;
        void blobToDataUrl(blob).then(onChange);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      let elapsed = 0;
      timerRef.current = window.setInterval(() => {
        elapsed += 1;
        setSeconds(elapsed);
        if (elapsed < 60) return;
        if (recorder.state !== 'inactive') recorder.stop();
        setRecording(false);
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }, 1000);
    } catch {
      stopTracks();
      setError('Allow the microphone to record this breakdown.');
    }
  };

  return (
    <div className="voice-recorder">
      {recording ? (
        <button
          type="button"
          className="btn btn-danger btn-block"
          onClick={stopRecording}
        >
          ⏹ Stop recording · {formatTime(seconds)}
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            onChange(null);
            void startRecording();
          }}
        >
          {value ? '🎤 Record again' : '🎤 Record voice note'}
        </button>
      )}
      {value && !recording && <VoiceNote src={value} />}
      {error && (
        <p className="muted" style={{ margin: '8px 0 0', color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
