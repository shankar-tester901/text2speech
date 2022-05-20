module.exports = (context, basicIO) => {

  const recorder = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');



	
  // Create the auth config
  const config = {
    projectId: 'text2speech-264407',
    keyFilename: './Text2Speech-ShankarR-Zoho-f17abf145e29.json'
  };

  // Creates a client
  const client = new speech.SpeechClient(config);


  const encoding = "LINEAR16";
  const sampleRateHertz = 16000;
  const languageCode = "en-IN";

  const request = {
    "config": {
      "encoding": encoding,
      "sampleRateHertz": sampleRateHertz,
      "languageCode": languageCode,
    },
    interimResults: false, // If you want interim results, set this to true
  };



  // Create a recognize stream
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data =>
      process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : `\n\nReached transcription time limit, press Ctrl+C\n`
      )
    );

  // Start recording and send the microphone input to the Speech API.
  // Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
  recorder
    .record({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: 'rec', // Try also "arecord" or "sox"
      silence: '10.0',
    })
    .stream()
    .on('error', console.error)
    .pipe(recognizeStream);

  console.log('Listening. Say something. Press Ctrl+C to stop.');

  context.close(); //end of application
};
