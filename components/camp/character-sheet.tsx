"use client";

import { levels } from "@/lib/game/levels";
import { useBackgroundMusic, useDebugModeSetting } from "@/lib/hooks";
import { UserButton } from "@clerk/nextjs";
import { ActivityIcon, BadgeDollarSignIcon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Switch } from "../ui/switch";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const CharacterSheet = ({ mini }: { mini?: boolean }) => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
  const [isDebugMode, setIsDebugMode] = useDebugModeSetting();
  const { push } = useRouter();

  const rank = gameState?.player?.rank || 0;

  const [backgroundAllowed, setBackgroundAllowed, _1, _2] =
    useBackgroundMusic();

  const setEnergyTo100 = async () => {
    const response = await fetch("/api/game/debug", {
      method: "POST",
      body: JSON.stringify({
        operation: "top-up-energy",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      let newGameState = await response.json();
      setGameState(newGameState);
    }
  };

  const resetCharacter = async () => {
    const response = await fetch("/api/game/debug", {
      method: "POST",
      body: JSON.stringify({
        operation: "reset",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      push("/");
    }
  };

  const getLevel = () => {
    try {
      if (rank === 1) {
        levels[0];
      }
      if (rank >= 100) {
        levels[99];
      }
      return levels[Math.ceil(rank / 4)];
    } catch (e) {
      return "Unknown";
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        {mini === true ? (
          <button className="text-left h-full">
            <div className="rounded-lg overflow-hidden h-10 w-10 md:h-18 md:w-18 border border-foregound">
              <img
                src={gameState?.profile_image_url}
                height={1024}
                width={1024}
                alt="Character"
              />
            </div>
          </button>
        ) : (
          <button className="flex gap-4 items-start text-left h-full">
            <div className="flex items-center justify-center h-full">
              <div className="rounded-lg overflow-hidden h-10 w-10 md:h-18 md:w-18 border border-foregound">
                <img
                  src={gameState?.profile_image_url}
                  height={1024}
                  width={1024}
                  alt="Character"
                />
              </div>
            </div>
            <div className="w-44 lg:w-56">
              <TypographyLarge className="text-sm md:text-lg">
                {gameState?.player?.name}
              </TypographyLarge>
              <Progress
                value={(((rank - 1) % 4) / 4) * 100}
                className="h-2 border border-foreground/20"
              />
              <TypographyMuted className="text-xs md:text-sm ">
                Rank: {getLevel()}
              </TypographyMuted>
            </div>
          </button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-4 overflow-y-auto"
      >
        <div className="flex flex-col gap-4 md:max-w-xl md:mx-auto">
          <div className="flex items-center justify-center flex-col w-full gap-2">
            <TypographyH1>{gameState?.player?.name}</TypographyH1>
            <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
              <img
                src={gameState?.profile_image_url}
                height={1024}
                width={1024}
                alt="Character"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <TypographyP className="flex items-center">
                <ActivityIcon size={20} className="mr-2 text-indigo-400" />
                {gameState?.player?.energy || 0}/
                {gameState?.player?.max_energy || 0}
              </TypographyP>
              <TypographyP className="flex !mt-0 items-center">
                <BadgeDollarSignIcon
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                {gameState?.player?.gold || 0}
              </TypographyP>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <TypographyH3>{getLevel()}</TypographyH3>
              <Progress
                value={(((rank - 1) % 4) / 4) * 100}
                className="h-2 border border-foreground/20"
              />
              <TypographyMuted className="text-xs md:text-sm ">
                {(100 - (((rank - 1) % 4) / 4) * 100) / 25} exp until next rank
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Background</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.player?.background}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Description</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.player?.description}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Motivation</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.player?.motivation}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Game Tone</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.tone}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Game Theme</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.genre}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Stats</TypographyH3>
              <ul className="flex flex-col gap-2 list-disc pl-6">
                <li>
                  <TypographyMuted>
                    {gameState?.current_quest
                      ? gameState?.quests?.length - 1
                      : gameState?.quests?.length}{" "}
                    quests completed
                  </TypographyMuted>
                </li>
                <li>
                  <TypographyMuted>
                    {gameState?.player?.inventory?.length} items found
                  </TypographyMuted>
                </li>
              </ul>
            </div>
            <div>
              <TypographyH3>Audio</TypographyH3>
              <TypographyMuted>Play Background Music</TypographyMuted>
              <Switch
                checked={backgroundAllowed === true}
                onCheckedChange={setBackgroundAllowed as any}
              />
            </div>
            <div>
              <TypographyH3>Account</TypographyH3>
              <TypographyMuted>Show Debug Information</TypographyMuted>
              <Switch
                checked={isDebugMode === true}
                onCheckedChange={setIsDebugMode as any}
              />
              <div className="flex gap-4 flex-wrap my-4">
                <Button
                  onClick={(e) => {
                    setEnergyTo100();
                  }}
                >
                  Set Energy to 100
                </Button>

                <Button
                  onClick={(e) => {
                    resetCharacter();
                  }}
                >
                  Reset Character
                </Button>
              </div>

              <div className="mt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
          <div>
            <TypographyH3>Diagnostics</TypographyH3>
            <TypographyMuted>Current Quest</TypographyMuted>
            <TypographyMuted>
              {gameState?.current_quest || "None"}
            </TypographyMuted>
            <TypographyMuted>Current NPC Conversation</TypographyMuted>
            <TypographyMuted>
              {gameState?.in_conversation_with || "None"}
            </TypographyMuted>
          </div>
          <div>
            <TypographyH3>About this game</TypographyH3>
            <TypographyMuted>
              This game was built using the{" "}
              <a href="https://www.steamship.com/" target="_blank">
                Steamship Agent SDK
              </a>
              . If there is a bug or you have a feature request, please submit
              an issue on Github. If you&apos;re a developer, feel free to fork
              the repo and create your own game!
            </TypographyMuted>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <TypographySmall>Python</TypographySmall>
                <Button asChild>
                  <a
                    href="https://github.com/steamship-packages/ai-adventure/tree/main"
                    target="_blank"
                  >
                    <StarIcon
                      className="fill-yellow-600 text-yellow-600 mr-2"
                      size={20}
                    />
                    Agent Repo
                  </a>
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <TypographySmall>Next.js</TypographySmall>
                <Button asChild>
                  <a
                    href="https://github.com/steamship-core/ai-adventure"
                    target="_blank"
                  >
                    <StarIcon
                      className="fill-yellow-600 text-yellow-600 mr-2"
                      size={20}
                    />
                    Web Repo
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
