import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getGameState } from "@/lib/game/game-state.server";
import { getAgent } from "@/lib/agent/agent.server";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    const gameState = await getGameState(agent!.agentUrl);
    return NextResponse.json({ gameState }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
