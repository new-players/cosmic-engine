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

    const initReply = await neynarClient.publishCast(
      process.env.SIGNER_UUID ?? '',
      "Now sparking your image, please wait… ⏳",
      {
        replyTo: hookData.data.hash,
        embeds: []
      }
    );
    console.log(`Init replied to the cast with hash: ${initReply.hash}`)

    const outputUrl = await glifClient.sendGlifRequest(
      "",
      {
        "prompt": hookData.data.text.replace("cosmobot", ""),
        "image-input": hookData.data.embeds[0].url
      },
      'SPARK',
    );

    console.log("PROMPT FINISHED: " + outputUrl);

    const creationRequest: NeynarFrameCreationRequest = {
      name: `sparked image ${hookData.data.author.username}`,
      pages: [
        {
          image: {
            url: outputUrl,
            aspect_ratio: "1:1",
          },
          title: "Sparked Image",
          buttons: [],
          input: {
            text: {
              enabled: false,
            },
          },
          uuid: "spark",
          version: "vNext",
        },
      ],
    };
    const frame = await neynarClient.publishNeynarFrame(creationRequest);
    const reply = await neynarClient.publishCast(
      process.env.SIGNER_UUID ?? '',
      "Sparked⚡",
      {
        replyTo: hookData.data.hash,
        embeds: [
          {
            url: frame.link
          }
        ]
      }
    );
    console.log(`Replied to the cast with hash: ${reply.hash}`)

    return new Response(`Finished creating meme with url ${outputUrl}`);
  } catch (e: any) {
    console.log(e.message, { status: 500 })
    return new Response(e.message, { status: 500 });
  }
}

export async function GET() {
  console.log("get received")
  return new Response("nice one", {status: 200})
}