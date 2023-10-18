import { ReactNode } from "react";

export const QuestContainer = ({ children }: { children: ReactNode }) => (
  <main className="h-[100dvh] max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4">
    {children}
  </main>
);

export const QuestNarrativeContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <main
    id="narrative-container"
    className="flex flex-col-reverse overflow-auto gap-8 pt-8 pb-0 h-full w-full"
  >
    {children}
  </main>
);

export const QuestContentContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <main className="max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4">
    {children}
  </main>
);
