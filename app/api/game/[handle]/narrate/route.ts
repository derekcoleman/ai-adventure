import { getAgent } from "@/lib/agent/agent.server";
import { narrate } from "@/lib/game/narrate.server";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { block_id } = await request.json();

  try {
    const resp = await narrate(agent!.agentUrl, block_id);
    return NextResponse.json(resp);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: `Unable to get narration: ${e}` },
      { status: 404 }
    );
  }
}
