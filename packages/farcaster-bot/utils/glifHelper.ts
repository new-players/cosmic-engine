import axios from 'axios';

export type OutputType = 'WOJAK' | 'IKEA' | 'SPARK' | 'LLM';

export class GlifHelper {
  private glifEndpoint: string;

  constructor(
    private readonly glifApiEndpoint: string,
  ) {
    this.glifEndpoint = glifApiEndpoint;
  }

  private async sendGlifAPiRequest(prompt: Record<string, any>): Promise<string> {
    try {
      const url = `${this.glifEndpoint}`;
      const apiResponse = await axios({
        url,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json',
          Authorization: `Bearer ${ process.env.GLIF_API_KEY }`
        },
        data: JSON.stringify(
          prompt,
        ),
      });

      console.log(`request to glif api: ${apiResponse}`)
      return apiResponse?.data?.output;
    } catch (error) {
      throw new Error('Error Glif request failed: ' + error);
    }
  }

  async sendGlifRequest(
    prompText: string | null = "",
    prompObject: any | null = "",
    outputType: OutputType,
  ): Promise<string> {
    let result: string | null = '';

    if (outputType === 'WOJAK') {
      const payload = {
        "id": "clxtc53mi0000ghv10g6irjqj",
        "inputs": [
          prompText
        ]
      }
      result = await this.sendGlifAPiRequest(payload);
    } else if (outputType === 'IKEA') {
      const payload = {
        "id": "clv6udtg90001shfnzinpnpp9",
        "inputs": [
          prompText
        ]
      }
      result = await this.sendGlifAPiRequest(payload);
    } else if (outputType === 'SPARK') {
      const payload = {
        "id": "clyrcr6kb000012ntpmoa5wzb",
        "inputs": prompObject
      }
      result = await this.sendGlifAPiRequest(payload);
    } else if (outputType === 'LLM') {
      const payload = {
        "id": "clywwo5xd0000a4t3s40qwp0a",
        "inputs": [
          prompText
        ]
      }
      result = await this.sendGlifAPiRequest(payload);
    }

    return result;
  }

}
