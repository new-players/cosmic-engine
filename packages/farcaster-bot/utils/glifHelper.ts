import axios from 'axios';

export type OutputType = 'WOJAK' | 'IKEA';

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
    prompText: string,
    outputType: OutputType = 'WOJAK',
  ): Promise<string> {
    let result: string | null;

    if (outputType === 'WOJAK') {
      const payload = {
        "id": "clxtc53mi0000ghv10g6irjqj",
        "inputs": [
          prompText
        ]
      }
      result = await this.sendGlifAPiRequest(payload);
    } else {
      const payload = {
        "id": "clv6udtg90001shfnzinpnpp9",
        "inputs": [
          prompText
        ]
      }
      result = await this.sendGlifAPiRequest(payload);
    }

    return result;
  }

}