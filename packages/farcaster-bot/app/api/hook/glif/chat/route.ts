import { NeynarFrameCreationRequest } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import neynarClient from "../../../../../utils/neynarClient";
import { GlifHelper } from "../../../../../utils/glifHelper";

const glifClient = new GlifHelper(process.env.GLIF_ENDPOINT ?? '');

export async function POST(req: Request) {
  console.log("Receiving webhook....")
  try {
    const body = await req.text();
    console.log(body);
    const hookData = JSON.parse(body);
    console.log(hookData.data.text);

    if (!process.env.SIGNER_UUID) {
      throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }

    const outputText = await glifClient.sendGlifRequest(
      hookData.data.text.replace("cosmobot", ""),
      "",
      'LLM',
    );

    console.log("PROMPT FINISHED: " + outputText);

    const reply = await neynarClient.publishCast(
      process.env.SIGNER_UUID ?? '',
      outputText,
      {
        replyTo: hookData.data.hash,
        embeds: []
      }
    );
    console.log(`Replied to the cast with hash: ${reply.hash}`)

    return new Response(`Finished answering to chat with response: ${outputText}`);
  } catch (e: any) {
    console.log(e.message, { status: 500 })
    return new Response(e.message, { status: 500 });
  }
}

export async function GET() {
  console.log("get received")
  return new Response("nice one", {status: 200})
}