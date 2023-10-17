import { CampMembers } from "@/camp-members";
import { BackgroundAudio } from "@/components/audio-provider";
import { ActionBar } from "@/components/camp/action-bar";
import { CampImage } from "@/components/camp/camp-image";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { QuestProgress } from "@/components/camp/quest-progress";
import { SummaryStats } from "@/components/camp/summary-stats";
import { WelcomeModal } from "@/components/camp/welcome-modal";
import RecoilProvider from "@/components/recoil-provider";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { generateQuestArc } from "@/lib/game/quest.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function CampPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId);

  if (!agent) {
    redirect("/play/character-creation");
  }

  let gameState = await getGameState(agent?.agentUrl);

  if (gameState.active_mode == "onboarding") {
    redirect("/play/character-creation");
  }

  if (!gameState.quest_arc) {
    await generateQuestArc(agent?.agentUrl);
    gameState = await getGameState(agent?.agentUrl);
  }

  return (
    <RecoilProvider
      gameState={gameState}
      backgroundAudioState={false}
      backgroundAudioUrlState={"/music.wav"}
    >
      <WelcomeModal />

      <main className="h-[100dvh] min-h-[600px] w-full">
        <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
          <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <CharacterSheet />
              </div>
              <SummaryStats />
            </div>
            <div>
              <TypographyLarge className="">Quest Progress</TypographyLarge>
              <TypographyMuted>{gameState.player.motivation}</TypographyMuted>
              <QuestProgress />
            </div>
            <div id="camp">
              <TypographyLarge className="mt-0">Camp</TypographyLarge>
              <CampImage />
              <div className="flex flex-grow flex-col overflow-auto">
                <CampMembers />
              </div>
            </div>
          </div>
          <div id="actions">
            <ActionBar />
          </div>
        </div>
      </main>
      <BackgroundAudio />
    </RecoilProvider>
  );
}
