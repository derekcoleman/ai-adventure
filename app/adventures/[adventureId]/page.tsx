import AdventureEditInvitationSection from "@/components/adventures/adventure-edit-invitation-section";
import CharacterTemplatesSection from "@/components/adventures/character-templates-section";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();
  if (!userId) throw new Error("no user");

  const adventure = await getAdventure(params.adventureId);
  if (!adventure) {
    redirect(`/adventures`);
  }
  return (
    <div>
      <div className="relative h-96 w-full">
        <Image
          src={"/adventurer.png"}
          fill
          alt="Adventurer"
          className="object-cover"
        />
        <div className="flex justify-between flex-col p-4 gap-2 md:p-6 absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background">
          <div>
            <Button variant="outline" asChild>
              <Link href={`/adventures`}>
                <ArrowLeftIcon size={16} className="mr-2" /> Back
              </Link>
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="bg-indigo-600 rounded-full text-sm px-2">
              Open-ended
            </div>
            <div className="bg-blue-600 rounded-full text-sm px-2">
              Pixel-Art
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 flex gap-6 flex-col">
        <div>
          <TypographyH1>{adventure.name}</TypographyH1>
          <TypographyLarge className="mt-2 text-2xl">
            {adventure.shortDescription}
          </TypographyLarge>
          <TypographyMuted className="mt-2 text-2xl">
            {adventure.description}
          </TypographyMuted>
        </div>

        <div className="mt-6">
          <TypographyH2 className="border-none">
            Create a character
          </TypographyH2>
          <TypographyMuted className="text-lg">
            Create a custom character to go on this adventure. You&apos;ll be
            able to set your own name, appearance, and description.
          </TypographyMuted>
          <div className="mt-2">
            <Button asChild className="text-xl py-6 px-6 mt-2">
              <Link href={`/adventures/${params.adventureId}/create-instance`}>
                Create a character
              </Link>
            </Button>
          </div>
        </div>
        <CharacterTemplatesSection adventureId={params.adventureId} />
        <AdventureEditInvitationSection
          adventureId={params.adventureId}
          userId={userId}
        />
      </div>
    </div>
  );
}
