/* eslint-disable no-unused-vars */

const { ErrorHelper } = require('../../vs-core-firebase');

const { Types } = require('../../vs-core');

const { Collections } = require('../../types/collectionsTypes');

const { DialogFlow } = require('../../vs-core-firebase');

const {
  fetchSingleItem,

  fetchItems,
  createFirestoreDocument,
} = require('../../vs-core-firebase/helpers/firestoreHelper');

// eslint-disable-next-line camelcase
const {
  invokePostWhatsApp,

  invokeDownloadFile,
  invokePostWhatsAppMedia,
} = require('../../helpers/httpInvoker');

const { Configuration, OpenAIApi } = require('openai');

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION;
const OPENAI_APIKEY = process.env.OPENAI_APIKEY;

exports.validateSubscription = async function (req, res) {
  try {
    console.log(
      'Received !',
      JSON.stringify(req.body),
      JSON.stringify(req.params),
      JSON.stringify(req.query)
    );

    /**
     * UPDATE YOUR VERIFY TOKEN
     *This will be the Verify Token value when you set up webhook
     **/
    // const verifyToken = process.env.VERIFY_TOKEN;

    const verifyToken = 'MICHE_TOKEN';

    // Parse params from the webhook verification request
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === verifyToken) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
      return;
    }

    // Responds with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.receiveMessage2 = async function (req, res) {
  try {
    console.log(
      'Received !',
      JSON.stringify(req.body),
      JSON.stringify(req.params),
      JSON.stringify(req.query)
    );

    // Parse the request body from the POST

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumberId = req.body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        const msgBody = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

        const dialogFlow = new DialogFlow();
        const response = await dialogFlow.detectIntentText(msgBody);

        const messageResponse = response.length ? response[0] : response;
        await invokePostWhatsApp({
          phoneNumberId,
          token: WHATSAPP_TOKEN,
          payload: {
            messaging_product: 'whatsapp',
            to: from.replace('549', '54'), // TODO MICHEL - lo hago para que los test phone numbers funcionen
            text: { body: messageResponse },
          },
        });
      }

      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

const MESSAGE_SENDER_TYPE_AI = 'AI';
const MESSAGE_SENDER_TYPE_HUMAN = 'HUMAN';

const getOpenAITextResponse = async ({ previousChatMessages, prompt, context }) => {
  const openAIChatConfig = await fetchSingleItem({
    collectionName: Collections.CHAT_CONFIG,
    id: 'openai-esp',
  });
  // const AI_ENTITY_ROL = 'AI SEXOLOGO'; // AI assistant
  // const AI_ENTITY_ROL = 'AI GINECOLOGA';

  // const INSTRUCTION = `The following is a conversation with an ${AI_ENTITY_ROL}. The ${AI_ENTITY_ROL} is helpful, creative, clever, and very friendly.\n\n`;
  // const INSTRUCTION = `La siguiente es una conversación con un ${AI_ENTITY_ROL}. El ${AI_ENTITY_ROL} es creativo inteligente y útil. Siempre busca dar consejos que ayuden a la persona a estar mejor consigo misma. Habla de forma divertida y tiene un acento latino\n\n`;
  // const INSTRUCTION = `La siguiente es una conversación entre dos amigos. Actuar como un CONSEJERO creativo e inteligente. Intentar dar consejos que ayuden a estar mejor consigo misma. Hablar de forma divertida\n\n`;
  // const INSTRUCTION = `La siguiente es una conversación con un ${AI_ENTITY_ROL}. Actuar como un ${AI_ENTITY_ROL} creativo e inteligente. Hablar de forma divertida\n\n`;
  const aiEntityRol = openAIChatConfig.aiEntityRol;
  // const aiName = openAIChatConfig.aiName;
  const instruction =
    openAIChatConfig.instruction.replaceAll('AI_ENTITY_ROL', aiEntityRol) + '\n\n';

  let promtString = `${instruction} \n\n`;

  if (context) {
    const CONTEXT_INSTRUCTION = 'Based on this context:';

    promtString = `${CONTEXT_INSTRUCTION} \n\n Context: "${context}" \n\n ${promtString}`;
  }

  let messagesString = '';
  previousChatMessages.forEach((item) => {
    messagesString += `${item.senderType}: ${item.prompt} \n`;
  });
  // Human: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?

  promtString += `${messagesString}${MESSAGE_SENDER_TYPE_HUMAN}: ${prompt}\n`;

  console.log('Request to AI (promtString):', promtString);
  // res.status(200).send(promtString);
  // if (1 === 1) return;

  const configuration = new Configuration({
    organization: OPENAI_ORGANIZATION,
    apiKey: OPENAI_APIKEY,
  });

  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: promtString,

    temperature: 0.9,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [` ${MESSAGE_SENDER_TYPE_HUMAN}:`, ` ${MESSAGE_SENDER_TYPE_AI}:`],
  });

  // const completion = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   prompt,

  //   max_tokens: 250,
  //   temperature: 0.2,
  // });

  const result = completion?.data.choices?.[0]?.text;
  if (result) {
    return {
      result: result
        .replace('\n' + aiEntityRol + ': ', '')
        .replace('AI: ', '')
        .replace('\nAI: ', ''),
      completion: completion?.data,
    };
  }

  return {
    result: null
      .replace('\n' + aiEntityRol + ': ', '')
      .replace('AI: ', '')
      .replace('\nAI: ', ''),
    completion: completion?.data,
  };
};

const getOpenAIImageResponse = async ({ prompt }) => {
  const configuration = new Configuration({
    organization: OPENAI_ORGANIZATION,
    apiKey: OPENAI_APIKEY,
  });

  const openai = new OpenAIApi(configuration);

  const imgData = await openai.createImage({
    prompt,
    n: 1,
    size: '1024x1024',
  });

  const result = imgData.data.data[0].url;

  return result;
};

const convertImageUrlToBuffer = async ({ url }) => {
  const imgBuffer = await invokeDownloadFile({
    url,
  });

  return imgBuffer;
};

// const editImageOpenAI = async ({ originalImgStream, maskImgStream, prompt }) => {
//   const configuration = new Configuration({
//     organization: OPENAI_ORGANIZATION,
//     apiKey: OPENAI_APIKEY,
//   });

//   const openai = new OpenAIApi(configuration);

//   const response = await openai.createImageEdit(
//     originalImgStream,
//     maskImgStream,
//     prompt,
//     1,
//     '512x512'
//     // '1024x1024'
//   );

//   console.log('Img response:', response?.data);
//   const imgUrl = response.data.data[0].url;

//   return imgUrl;
// };

exports.receiveMessage = async function (req, res) {
  try {
    console.log(
      'Received !',
      JSON.stringify(req.body),
      JSON.stringify(req.params),
      JSON.stringify(req.query)
    );

    // Parse the request body from the POST
    // const body = req.body;

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (
      !req.body.object ||
      !req.body.entry ||
      !req.body.entry[0].changes ||
      !req.body.entry[0].changes[0] ||
      !req.body.entry[0].changes[0].value.messages ||
      !req.body.entry[0].changes[0].value.messages[0]
    ) {
      console.log('Se omite un mensaje que no require procesarse.');
      res.status(200).send({});
      return;
    }

    const phoneNumberId = req.body.entry[0].changes[0].value.metadata.phone_number_id;
    const from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload

    const whatsAppMessage = req.body.entry[0].changes[0].value.messages[0];

    if (whatsAppMessage.type === 'text') {
      const msgBody = whatsAppMessage.text.body; // extract the message text from the webhook payload

      // TODO MICHEL, usar DalogFlow para determinar esto
      if (msgBody.indexOf('imagen') >= 0) {
        console.log('Se esta solicitando una imagen');

        const url = await getOpenAIImageResponse({ prompt: msgBody });

        console.log('Url img generada: ' + url);

        const imgBuffer = await convertImageUrlToBuffer({ url });

        console.log('OK convirtiendo url a buffer');

        const facebookMediaResponse = await invokePostWhatsAppMedia({
          phoneNumberId,
          token: WHATSAPP_TOKEN,
          file: imgBuffer,
        });

        console.log('OK storeando img en facebook media');

        const mediaId = facebookMediaResponse.data.id;

        console.log('OK storeando img en facebook media (MEDIA ID: ' + mediaId + ')');

        await invokePostWhatsApp({
          phoneNumberId,
          token: WHATSAPP_TOKEN,
          payload: {
            messaging_product: 'whatsapp',
            to: from.replace('549', '54'), // TODO MICHEL - lo hago para que los test phone numbers funcionen
            // text: { body: aiResponse.result },

            type: 'image',
            image: {
              id: mediaId,
            },
          },
        });

        console.log('Fin OK procesamiento img');
        res.status(200).send({});

        return;
      }
      // const dialogFlow = new DialogFlow();
      // const response = await dialogFlow.detectIntentText(msgBody);

      // const messageResponse = response.length ? response[0] : response;

      const auditUid = from;
      const sessionId = from;
      const prompt = msgBody;
      const context = null;

      let chatMessages = await fetchItems({
        collectionName: Collections.CHAT_MESSAGES,
        limit: 1000, // solo 100 msjs para que no sature la cantidad de tokens // TODO quedarme con los ultimso 100 y usar un orderBy para uqe tome los ultimos
        filterState: Types.StateTypes.STATE_ACTIVE,
        filters: { sessionId: { $equal: sessionId } },
        indexedFilters: ['state', 'sessionId'],
      });

      chatMessages = chatMessages
        .sort((aa, bb) => {
          return aa.createdAt - bb.createdAt;
        })
        .slice(0, 100); // TODO MICHEL que funcione bien el order en fetchItems

      console.log('Existent chatMessages for session (' + sessionId + '): ' + chatMessages.length);

      await createFirestoreDocument({
        auditUid,
        collectionName: Collections.CHAT_MESSAGES,
        itemData: {
          state: Types.StateTypes.STATE_ACTIVE,
          senderType: MESSAGE_SENDER_TYPE_HUMAN,
          sessionId,
          prompt,
          context,
        },
      });

      const aiResponse = await getOpenAITextResponse({
        auditUid,
        previousChatMessages: chatMessages,
        prompt,
        context,
      });

      if (aiResponse.result) {
        console.log('OPENAI Response: ' + aiResponse.result);

        await invokePostWhatsApp({
          phoneNumberId,
          token: WHATSAPP_TOKEN,
          payload: {
            messaging_product: 'whatsapp',
            to: from.replace('549', '54'), // TODO MICHEL - lo hago para que los test phone numbers funcionen
            text: { body: aiResponse.result },
          },
        });

        await createFirestoreDocument({
          auditUid,
          collectionName: Collections.CHAT_MESSAGES,
          itemData: {
            state: Types.StateTypes.STATE_ACTIVE,
            senderType: MESSAGE_SENDER_TYPE_AI,
            sessionId,
            prompt: aiResponse.result,
            aiResponse: aiResponse.completion,
            context,
          },
        });
      } else {
        console.log('Sin rta de OPENAI, se usa DIALOGFLOW');

        const dialogFlow = new DialogFlow();
        const response = await dialogFlow.detectIntentText(msgBody);

        const messageResponse = response.length ? response[0] : response;

        await invokePostWhatsApp({
          phoneNumberId,
          token: WHATSAPP_TOKEN,
          payload: {
            messaging_product: 'whatsapp',
            to: from.replace('549', '54'), // TODO MICHEL - lo hago para que los test phone numbers funcionen
            text: { body: messageResponse },
          },
        });

        await createFirestoreDocument({
          auditUid,
          collectionName: Collections.CHAT_MESSAGES,
          itemData: {
            state: Types.StateTypes.STATE_ACTIVE,
            senderType: MESSAGE_SENDER_TYPE_AI,
            sessionId,
            prompt: messageResponse,
            aiResponse: 'dialogflow',
            context,
          },
        });
      }

      res.status(200).send({});

      // else if (whatsAppMessage.type === 'image') {
      //   const getImageDataResponse = await invokeGetFacebookGraph({
      //     url: '/' + whatsAppMessage.id,
      //     token: WHATSAPP_TOKEN,
      //   });

      //   const url = getImageDataResponse?.data?.url;

      //   if (!url) {
      //     throw new Error('invalid get image response');
      //   }

      //   const imgBuffer = await invokeGetFacebookGraphDownloadFile({
      //     url,
      //     token: WHATSAPP_TOKEN,
      //   });

      //   imageUploadResult = await uploadFile({
      //     destination: `images/${}/${newDocId}.${type}`,
      //     buffer: file.buffer,
      //     isPublic: true,
      //   });

      //   // editImageOpenAI({ originalImgStream, maskImgStream, prompt });

      //   getImageResponse;
    } else {
      res.status(404).send({});
    }
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.openaiText2 = async function (req, res) {
  console.log('Received !', JSON.stringify(req.body));

  const CONTEXT_INSTRUCTION = 'Based on this context:';
  const INSTRUCTION = `Answer the question below as truthfully as you can, if you don't know the answer, say you don't know in a sarcastic way otherwise, just answer.`;

  try {
    const prompt = req.body.prompt;
    const context = req.body.context;

    const configuration = new Configuration({
      organization: OPENAI_ORGANIZATION,
      apiKey: OPENAI_APIKEY,
    });

    const openai = new OpenAIApi(configuration);

    const promtString = `${CONTEXT_INSTRUCTION}\n\n\nContext: "${context}" \n\n\n${INSTRUCTION} \n\n\n ${prompt}`;
    console.log('promtString:', promtString);

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,

      max_tokens: 250,
      temperature: 0.2,
    });

    console.log('🚀 ~ file: controller.js:166 ~ result', completion?.data);

    const result = completion?.data.choices?.[0]?.text;

    res.status(200).send(result);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.openaiText = async function (req, res) {
  console.log('Received !', JSON.stringify(req.body));

  try {
    const auditUid = 'prueba-miche';
    const sessionId = req.body.sessionId;
    const prompt = req.body.prompt;
    const context = req.body.context ? req.body.context : null;

    let chatMessages = await fetchItems({
      collectionName: Collections.CHAT_MESSAGES,
      limit: 1000,
      filterState: Types.StateTypes.STATE_ACTIVE,
      filters: { sessionId: { $equal: sessionId } },
      indexedFilters: ['state', 'sessionId'],
    });

    chatMessages = chatMessages.sort((aa, bb) => {
      return aa.createdAt - bb.createdAt;
    });

    console.log('Existent chatMessages for session (' + sessionId + '): ' + chatMessages.length);

    await createFirestoreDocument({
      auditUid,
      collectionName: Collections.CHAT_MESSAGES,
      itemData: {
        state: Types.StateTypes.STATE_ACTIVE,
        senderType: MESSAGE_SENDER_TYPE_HUMAN,
        sessionId,
        prompt,
        context,
      },
    });

    const aiResponse = await getOpenAITextResponse({
      auditUid,
      previousChatMessages: chatMessages,
      prompt,
      context,
    });

    if (aiResponse.result) {
      console.log('OPENAI Response: ' + aiResponse.result);

      await createFirestoreDocument({
        auditUid,
        collectionName: Collections.CHAT_MESSAGES,
        itemData: {
          state: Types.StateTypes.STATE_ACTIVE,
          senderType: MESSAGE_SENDER_TYPE_AI,
          sessionId,
          prompt: aiResponse.result,
          aiResponse: aiResponse.completion,
          context,
        },
      });
    } else {
      console.log('Sin rta de AI');
    }

    res.status(200).send(aiResponse);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.openaiImage = async function (req, res) {
  try {
    const url =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/1200px-Google_Images_2015_logo.svg.png';

    console.log('Url img generada: ' + url);

    const imgBuffer = await convertImageUrlToBuffer({ url });

    console.log('OK convirtiendo url a buffer', imgBuffer);

    const phoneNumberId = 100260816327000; // 109477178725139; // 109982358660593
    const facebookMediaResponse = await invokePostWhatsAppMedia({
      phoneNumberId,
      token: WHATSAPP_TOKEN,
      file: imgBuffer,
    });

    console.log('OK storeando img en facebook media');

    const mediaId = facebookMediaResponse.data.id;

    console.log('OK storeando img en facebook media (MEDIA ID: ' + mediaId + ')');

    await invokePostWhatsApp({
      phoneNumberId,
      token: WHATSAPP_TOKEN,
      payload: {
        messaging_product: 'whatsapp',
        to: '5491164828027', // TODO MICHEL - lo hago para que los test phone numbers funcionen
        // text: { body: aiResponse.result },

        type: 'image',
        image: {
          id: mediaId,
        },
      },
    });

    console.log('Fin OK procesamiento img');
    res.status(200).send({});
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
  // console.log('Received !', JSON.stringify(req.body));

  // const CONTEXT_INSTRUCTION = 'Based on this context:';
  // const INSTRUCTION = `Answer the question below as truthfully as you can, if you don't know the answer, say you don't know in a sarcastic way otherwise, just answer.`;

  // try {
  //   const prompt = req.body.prompt;
  //   const context = req.body.context;

  //   const configuration = new Configuration({
  //     organization: OPENAI_ORGANIZATION,
  //     apiKey: OPENAI_APIKEY,
  //   });

  //   const openai = new OpenAIApi(configuration);

  //   const imgData = await openai.createImage({
  //     prompt: 'a dog in space',
  //     n: 1,
  //     size: '1024x1024',
  //   });

  //   const result = imgData.data.data[0].url;
  //   console.log(result);

  //   res.status(200).send(result);
  // } catch (err) {
  //   return ErrorHelper.handleError(req, res, err);
  // }
};
