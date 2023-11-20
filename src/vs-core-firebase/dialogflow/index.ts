// Imports the Google Cloud Some API library
import { SessionsClient } from '@google-cloud/dialogflow-cx';

import { v4 as uuidv4 } from 'uuid';

const projectId = 'ecommitment-prod';
const location = 'us-central1';
const agentId = 'bc5a2a45-06e8-44e9-ba59-ced22a885d35';

const languageCode = 'es';

/**
 * Example for regional endpoint:
 *   const location = 'us-central1'
 *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
 */
const client = new SessionsClient({ apiEndpoint: 'us-central1-dialogflow.googleapis.com' });

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */

export class DialogFlow {
  // bq: bigquery.BigQuery;
  // _initialized: boolean = false;
  // constructor(public config: FirestoreBigQueryEventHistoryTrackerConfig) {
  //   this.bq = new bigquery.BigQuery();
  //   this.bq.projectId = config.bqProjectId || process.env.PROJECT_ID;
  //   if (!this.config.datasetLocation) {
  //     this.config.datasetLocation = "us";
  //   }
  // }
  async detectIntentText(text: string) {
    // A unique identifier for the given session
    const sessionId = uuidv4();

    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
        },
        languageCode,
      },
    };
    const [response] = await client.detectIntent(request);

    console.log('🚀 ~ DialogFlow ~ detectIntentText ~ response', JSON.stringify(response));

    if (response.queryResult.match.intent) {
      console.log(`Matched Intent: ${response.queryResult.match.intent.displayName}`);
    }
    console.log(`Current Page: ${response.queryResult.currentPage.displayName}`);

    for (const message of response.queryResult.responseMessages) {
      if (message.text) {
        console.log(`Agent Response: ${message.text.text}`);
        return message.text.text;
      }
    }

    return 'Please repeat your question';

    // // Create a new session
    // const sessionClient = new dialogflow.SessionsClient();
    // const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // // The text query request.
    // const request = {
    //   session: sessionPath,
    //   queryInput: {
    //     text: {
    //       // The query to send to the dialogflow agent
    //       text: 'hola',
    //       // The language used by the client (en-US)
    //       languageCode: 'en-US',
    //     },
    //   },
    // };

    // // Send request and log result
    // const responses = await sessionClient.detectIntent(request);
    // console.log('Detected intent', JSON.stringify(responses));
    // const result = responses[0].queryResult;
    // console.log(`  Query: ${result.queryText}`);
    // console.log(`  Response: ${result.fulfillmentText}`);
    // if (result.intent) {
    //   console.log(`  Intent: ${result.intent.displayName}`);

    //   return result.fulfillmentText;
    // }

    // console.log('  No intent matched.');
    // return 'No intent matched';
  }
}
