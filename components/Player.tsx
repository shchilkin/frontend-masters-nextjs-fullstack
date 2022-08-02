import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from "@chakra-ui/react";
import ReactHowler from "react-howler";
import { useState, useEffect, useRef } from "react";
import {
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
} from "react-icons/md";
import { useStoreActions } from "easy-peasy";
import { formatTime } from "../lib/formatters";

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(
    songs.findIndex((song) => song.id === activeSong.id)
  );
  const [seek, setSeek] = useState(0.0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const soundRef = useRef(null);
  const repeatRef = useRef(repeat);
  const changeActiveSong = useStoreActions(
    (state: any) => state.changeActiveSong
  );

  useEffect(() => {
    let timerId;

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek());
        timerId = requestAnimationFrame(f);
      };

      timerId = requestAnimationFrame(f);
      return () => cancelAnimationFrame(timerId);
    }
    cancelAnimationFrame(timerId);
  }, [playing, isSeeking]);

  useEffect(() => {
    changeActiveSong(songs[index]);
  }, [index, changeActiveSong, songs]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  const setPlayState = (value: boolean) => {
    setPlaying(value);
  };
  const onShuffle = () => {
    setShuffle((state) => !state);
  };
  const onRepeat = () => {
    setRepeat((state) => !state);
  };

  const prevSong = () => {
    setIndex((state) => {
      return state ? state - 1 : songs.length - 1;
    });
  };

  const nextSong = () => {
    // @ts-ignore
    setIndex((state) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length);
        if (next === state) {
          return nextSong();
        }
        return next;
      }
      return state === songs.length - 1 ? 0 : state + 1;
    });
  };

  const onEnd = () => {
    if (repeatRef.current) {
      soundRef.current.seek(0);
    } else {
      nextSong();
    }
  };

  const onLoad = () => {
    const songDuration = soundRef.current.duration();
    setDuration(songDuration);
  };

  const onSeek = (event) => {
    setSeek(parseFloat(event[0]));
    soundRef.current.seek(event[0]);
  };

  return (
    <Box>
      <ReactHowler
        playing={playing}
        src={activeSong?.url}
        ref={soundRef}
        onLoad={onLoad}
        onEnd={onEnd}
      />
      <Center>
        <ButtonGroup>
          <IconButton
            outline="none"
            variant="link"
            color={shuffle ? "white" : "gray.600"}
            aria-label="shuffle"
            fontSize="24px"
            icon={<MdShuffle />}
            onClick={onShuffle}
          />
          <IconButton
            outline="none"
            variant="link"
            color="gray.600"
            aria-label="skip to previous"
            fontSize="24px"
            onClick={prevSong}
            icon={<MdSkipPrevious />}
          />
          {playing ? (
            <IconButton
              outline="none"
              variant="link"
              color="white"
              aria-label="play"
              fontSize="40px"
              icon={<MdOutlinePauseCircleFilled />}
              onClick={() => setPlayState(false)}
            />
          ) : (
            <IconButton
              outline="none"
              variant="link"
              color="white"
              aria-label="play"
              fontSize="40px"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlayState(true)}
            />
          )}

          <IconButton
            outline="none"
            variant="link"
            color="gray.600"
            aria-label="skip to next"
            fontSize="24px"
            onClick={nextSong}
            icon={<MdSkipNext />}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="skip to next"
            fontSize="24px"
            color={repeat ? "white" : "gray.600"}
            onClick={onRepeat}
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>
      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">{formatTime(seek)}</Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              /* eslint-disable-next-line jsx-a11y/aria-proptypes */
              aria-label={["min", "max"]}
              step={0.1}
              min={0}
              max={duration ? duration.toFixed(2) : 0}
              onChange={onSeek}
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%">
            <Text fontSize="xs" textAlign="right">
              {formatTime(duration)}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
