import enigma from 'enigma.js';
import schema from 'enigma.js/schemas/12.170.2.json';

async function getEnigmaAppAuth(auth, appId) {
  const url = await auth.generateWebsocketUrl(appId);
  const enigmaGlobal = await enigma
    .create({
      schema,
      url: url,
    })
    .open();

  return enigmaGlobal.openDoc(appId);
}

async function connectAuth(auth, appId) {
  app = await getEnigmaAppAuth(auth, appId);
  return app;
}

export {connect, connectAuth};
