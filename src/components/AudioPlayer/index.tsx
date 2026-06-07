import React, {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface Props {
  src: string;
  transcript?: string;
  title?: string;
}

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;
type Speed = (typeof SPEEDS)[number];

function fmt(t: number): string {
  if (!isFinite(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({src, transcript, title}: Props): ReactNode {
  const audioSrc = useBaseUrl(src);
  const transcriptBase = useBaseUrl(transcript ?? '');
  const transcriptHref = transcript ? transcriptBase : null;
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [audioMissing, setAudioMissing] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onDur = () => setDur(a.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = (e: Event) => {
      // Audio file missing or unsupported — swallow the runtime error
      // and fall back to "audio not ready, read the transcript" mode.
      e.stopPropagation();
      setAudioMissing(true);
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onDur);
    a.addEventListener('durationchange', onDur);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError, true);
    // Error may have already fired before this effect attached the listener.
    if (a.error) setAudioMissing(true);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onDur);
      a.removeEventListener('durationchange', onDur);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError, true);
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
  };

  const skip = (delta: number) => {
    const a = ref.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + delta));
  };

  const cycleSpeed = () => {
    const a = ref.current;
    if (!a) return;
    const i = SPEEDS.indexOf(speed);
    const next = SPEEDS[(i + 1) % SPEEDS.length];
    a.playbackRate = next;
    setSpeed(next);
  };

  return (
    <div className={styles.player}>
      <audio ref={ref} src={audioSrc} preload="metadata" />
      <div className={styles.header}>
        <span className={styles.label} aria-hidden>🎧</span>
        <div className={styles.titleWrap}>
          <div className={styles.title}>{title ?? 'Listen to this chapter'}</div>
          <div className={styles.sub}>
            {audioMissing
              ? 'Audio not generated yet — transcript below.'
              : 'AI-narrated lecture · expands on the written page'}
          </div>
        </div>
      </div>
      {!audioMissing && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.skip}
            onClick={() => skip(-15)}
            aria-label="Back 15 seconds"
            title="Back 15s"
          >
            ⏪ 15
          </button>
          <button
            type="button"
            className={styles.play}
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button
            type="button"
            className={styles.skip}
            onClick={() => skip(15)}
            aria-label="Forward 15 seconds"
            title="Forward 15s"
          >
            15 ⏩
          </button>
          <input
            type="range"
            className={styles.scrub}
            min={0}
            max={dur || 0}
            step={0.1}
            value={cur}
            onChange={seek}
            aria-label="Seek"
          />
          <span className={styles.time}>
            {fmt(cur)} / {fmt(dur)}
          </span>
          <button
            type="button"
            className={styles.speed}
            onClick={cycleSpeed}
            aria-label={`Playback speed ${speed}x`}
            title="Cycle playback speed"
          >
            {speed}×
          </button>
        </div>
      )}
      {transcriptHref && (
        <div className={styles.transcript}>
          <a href={transcriptHref} target="_blank" rel="noreferrer">
            Read the lecture transcript →
          </a>
        </div>
      )}
    </div>
  );
}
