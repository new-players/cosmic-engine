import neynarClient from "../../../../utils/neynarClient";
import { GlifHelper } from "../../../../utils/glifHelper";
import { db, write_payload } from "../../../../utils/databaseHelper";
import axios from 'axios';

const glifClient = new GlifHelper(process.env.GLIF_ENDPOINT ?? '');

export async function POST(req: Request) {
  console.log("Receiving webhook....")
  try {
    const body = await req.text();
    console.log(body);
    const hookData = JSON.parse(body);

    // to detect whether the request is a challenge from Slack event subscription setup
    if(typeof hookData.challenge !== 'undefined'){
        return new Response(hookData.challenge);
    }
    console.log(hookData.event.text);

    const dbreq = await write_data(hookData.event_id, hookData)
    console.log(dbreq)
    if (dbreq.status !== 200) {
      return new Response("Message already processed", { status: 403 });
    }

    if (!process.env.SIGNER_UUID) {
      throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }

    const input = String(hookData.event.text)
    // if include spark in text
    if (input.toLowerCase().includes('spark')){
      if(typeof hookData.event.files !== 'undefined'){
        // const initReply = await sendMessage({'text': 'Now sparking your image, please wait… ⏳'})
        // console.log(`Init replied to slack: ${initReply}`)
 
        const imagePublicUrl = await getPublicImageUrl(
          hookData.event.files[0].permalink_public,
          hookData.event.files[0].name
        );
        console.log("public URL for image is: " + imagePublicUrl);
        
        const outputUrl = await glifClient.sendGlifRequest(
          "",
          {
            "prompt": hookData.event.text,
            "image-input": imagePublicUrl
          },
          'SPARK',
        );
        console.log("PROMPT FINISHED: " + outputUrl);

        const payload = {
          'text': `Here's your sparked image ⚡⚡⚡\n${outputUrl}`
        }
        const result = await sendMessage(payload)
        console.log('finished sparking and sending to slack '+result)
        return new Response(`Finished sparking with url ${outputUrl}`);
      }
      else {
        const initReply = await sendMessage({'text': 'You ask me to Spark, but you do not upload an image. 🤔'})
        console.log(`Init replied to slack: ${initReply}`)
        return new Response('Replied to chat');
      }
    }
    else {
      const outputText = await glifClient.sendGlifRequest(
        hookData.event.text,
        "",
        'LLM',
      );

      // const outputText = "bypass glif"
      console.log("PROMPT FINISHED: " + outputText);

      const payload = {
        'text': outputText
      }
      const result = await sendMessage(payload)

      return new Response(`Finished answering to chat with response: ${outputText}. With response: ${result}`);
    }
  } catch (e: any) {
    console.log(e.message, { status: 500 })
    return new Response(e.message, { status: 500 });
  }
}

async function sendMessage(body: Record<string, any>): Promise<string> {
  try {
    const url = 'https://hooks.slack.com/services/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';
    const apiResponse = await axios({
      url,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json'
      },
      data: JSON.stringify(
        body,
      ),
    });

    console.log(`sending message to slack: ${apiResponse}`)
    return apiResponse?.data?.output;
  } catch (error) {
    throw new Error('Error request failed: ' + error);
  }
}

async function getPublicImageUrl(permalink_public: string, filename: string) {
  // example: https://slack-files.com/T07H1UQPA6N-F07KZHY1B8V-295a69ebfd
  // become: https://files.slack.com/files-pri/T07H1UQPA6N-F07KZHY1B8V/unnamed.png?pub_secret=295a69ebfd
  try {
    const data = permalink_public.split('https://slack-files.com/').pop();
    const splitted = data?.split('-')
    console.log(data)
    if(splitted != undefined){
      const publicUrl = `https://files.slack.com/files-pri/${splitted[0]}-${splitted[1]}/${filename}?pub_secret=${splitted[2]}`
      return publicUrl
    }
    return ""
  } catch (error) {
    throw new Error('Error request failed: ' + error);
  }
}

export async function GET() {
  console.log("get received")
  return new Response("nice one", {status: 200})
}

async function write_data(hash: string, payload: string){
  const query = `
    INSERT INTO webhook_payload(hash, payload)
    VALUES(?, ?)
  `;
  const values = [hash, payload];
  let status, respBody;
  await write_payload(query, values)
    .then(() => {
      status = 200;
      respBody = { message: "Successfully created data" };
    })
    .catch((err) => {
      status = 400;
      respBody = err;
    });
    return Response.json(respBody, {
      status,
    });
}
