import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { wedding } from './data/wedding';
import { useGuestName } from './hooks/useGuestName';
import BottomNav from './components/BottomNav';
import Closing from './components/Closing';
import Countdown from './components/Countdown';
import Couple from './components/Couple';
import Cover from './components/Cover';
import DesktopPanel from './components/DesktopPanel';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Gift from './components/Gift';
import Hero from './components/Hero';
import LoveStory from './components/LoveStory';
import MusicButton from './components/MusicButton';
import Quote from './components/Quote';
import Rsvp from './components/Rsvp';

export default function App() {
  const guest = useGuestName();
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Kunci scroll selama cover masih tampil
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
  }, [opened]);

  const playMusic = () =>
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));

  const handleOpen = () => {
    window.scrollTo(0, 0);
    setOpened(true);
    playMusic();
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playMusic();
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      {wedding.music && <audio ref={audioRef} src={wedding.music} loop preload="none" />}

      <AnimatePresence>{!opened && <Cover key="cover" guest={guest} onOpen={handleOpen} />}</AnimatePresence>

      <DesktopPanel />

      <main className="relative overflow-x-hidden bg-cream lg:ml-auto lg:w-[480px] lg:shadow-2xl">
        <Hero />
        <Quote />
        <Couple />
        <Countdown />
        <Events />
        <LoveStory />
        <Gallery />
        <Rsvp guest={guest} />
        <Gift />
        <Closing />
      </main>

      {opened && (
        <>
          {wedding.music && <MusicButton playing={playing} onToggle={toggleMusic} />}
          <BottomNav />
        </>
      )}
    </>
  );
}
