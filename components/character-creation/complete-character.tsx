import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { CreationActions, CreationContent } from "./shared/components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { CharacterConfig } from ".";
import { useTypeWriter } from "./hooks/use-typewriter";
import { useRouter } from "next/navigation";

const allValuesAreSet = (config: CharacterConfig) => {
  return Object.values(config).every((value) => value.length > 1);
};

const TEXT = `Creating an image of your character...`;

const CharacterCreationComplete = ({
  config,
  isCurrent,
  onFocus,
}: {
  config: {
    name: string;
    theme: string;
    background: string;
    appearance: string;
  };
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText, isFinished } = useTypeWriter({
    text: TEXT,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const onComplete = async () => {
    await fetch("/api/agent", { method: "POST", body: JSON.stringify(config) });
    router.push("/play/camp");
  };

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <div>
        <TypographyP>{currentText}</TypographyP>
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
          {imageLoaded ? (
            <Image
              src={"/orc.png"}
              height={1024}
              width={1024}
              alt="Character"
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <TypographyMuted className="text-muted-foreground">
            Name:
          </TypographyMuted>
          <TypographyLarge>{config.name}</TypographyLarge>
        </div>
        <div>
          <TypographyMuted>Theme:</TypographyMuted>
          <TypographyLarge>{config.theme}</TypographyLarge>
        </div>
        <div>
          <TypographyMuted>Background:</TypographyMuted>
          <TypographyLarge>{config.background}</TypographyLarge>
        </div>
        <div>
          <TypographyMuted>Appearance:</TypographyMuted>
          <TypographyLarge>{config.appearance}</TypographyLarge>
        </div>
      </div>

      <CreationActions isFinished={true}>
        <Button
          disabled={!allValuesAreSet(config)}
          className="w-full"
          onClick={onComplete}
        >
          Create Character
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationComplete;