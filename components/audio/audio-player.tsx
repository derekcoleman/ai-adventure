import { useEffect } from "react";
import { useAudio } from "react-use";

export default function AudioPlayer({
  active = false,
  loop = false,
  url,
}: {
  active: boolean;
  url?: string;
  loop?: boolean;
}) {
  const [audio, state, controls, ref] = useAudio({
    src: url || "",
    autoPlay: active == true,
    loop,
  });

  // useEffect(() => {
  //   if (ref && ref.current && loop) {
  //     ref.current?.setAttribute("loop", "true");
  //   }
  // }, [ref, loop]);

  useEffect(() => {
    if (active == true && url) {
      console.log("playing ", url);
      controls.play();
    } else {
      controls.pause();
    }
  }, [active, url]); // NOTE: Adding the audio dependencies here causes an infinite loop!
  return audio;
}