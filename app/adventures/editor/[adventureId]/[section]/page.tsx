import Editor from "@/components/editor/editor";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { getSchema } from "@/lib/agent/agent.server";
import prisma from "@/lib/db";
import {
  DEPRECATEDSettingGroups,
  Setting,
  SettingGroup,
} from "@/lib/editor/DEPRECATED-editor-options";
import { objectEquals } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

export default async function EditorPage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventure = await getAdventure(params.adventureId, true);
  if (!adventure) {
    log.error("No adventure");
    throw new Error("no adventure");
  }
  if (adventure.creatorId != userId) {
    log.error(
      `User ${userId} does not have permission to edit ${adventure.id}`
    );
    redirect("/adventures");
  }

  if (!adventure) {
    redirect("/adventures");
  }

  const agentVersionParts = adventure.agentVersion.split("@");
  const agentVersion = agentVersionParts.length > 1 ? agentVersionParts[1] : "";

  let settingGroups: SettingGroup[] = [];
  if (agentVersion?.startsWith("1.")) {
    settingGroups = DEPRECATEDSettingGroups;
  } else {
    const responseJson = await getSchema(adventure.devAgent?.agentUrl!);
    settingGroups = responseJson.settingGroups;
  }

  let requiredSettings: Setting[] = [];
  for (let settingGroup of settingGroups) {
    const requiredSettingsInGroup = settingGroup.settings?.filter(
      (setting) => setting.required
    );
    requiredSettings = [
      ...requiredSettings,
      ...(requiredSettingsInGroup || []),
    ];
  }

  const allSettingsFilled =
    adventure.agentConfig &&
    requiredSettings.every((setting) => {
      // @ts-ignore
      return adventure.agentConfig?.[setting.name];
    });
  console.log(adventure.agentConfig);
  console.log(requiredSettings);
  console.log(allSettingsFilled);

  if (!allSettingsFilled) {
    redirect(`/adventures/editor/${adventure.id}/initialize`);
  }

  const userApproval = await prisma.userApprovals.findFirst({
    where: {
      userId: userId,
    },
  });

  let innerConfig = (adventure.agentDevConfig as any) || {};

  let devConfig = {
    ...((adventure.agentDevConfig as any) || {}),
    adventure_name: adventure.name, // Backwards compatible
    name: adventure.name,
    adventure_description: adventure.description, // Backwards compatible
    description: adventure.description,
    adventure_short_description: adventure.shortDescription, // Backwards compatible
    short_description: adventure.shortDescription,
    adventure_image: adventure.image, // Backwards compatible
    image: adventure.image,
    tags: adventure.tags,
    adventure_public: adventure.public,
    adventure_public_requested: adventure.publicRequested,
    game_engine_version: adventure.agentVersion,
    gameEngineVersionAvailable: process.env.STEAMSHIP_AGENT_VERSION,
  };

  let unpublishedChanges = !objectEquals(
    adventure.agentDevConfig || {},
    adventure.agentConfig || {}
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <TypographyH1>Adventure Editor</TypographyH1>
          <TypographyMuted className="text-lg">
            Create a custom adventure to share with your friends.
          </TypographyMuted>
        </div>
      </div>
      <Editor
        adventureId={adventure.id}
        devConfig={devConfig}
        hasUnpublishedChanges={unpublishedChanges}
        isUserApproved={userApproval?.isApproved || false}
        isGenerating={adventure?.state == "generating"}
        isGeneratingTaskId={adventure?.stateTaskId}
        stateUpdatedAt={adventure?.stateUpdatedAt}
        settingGroups={settingGroups}
      />
    </>
  );
}
