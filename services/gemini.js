const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  let model =  genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  let currentArtist = "";
  let currentArtistName = "";
  let chatSession = null;

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  

  exports.setupNewGemini = async (artist, history) => {
    if(!artist)
        return {message: "No Artist Selected"}

    console.log("Setting up new Chat for: " + artist?.name);
    
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You will answer Questions only about \"${artist?.name}\". If the user asks unrelated questions, the AI should respond that it can only answer questions about the artist and their music.`,
    });

    currentArtist = artist.id;
    currentArtistName = artist.name

    chatSession = model.startChat({
        generationConfig,
        history: history || [],
    });
  }

  exports.isGeminiSetupCorrectly = (artistId) => {
    return chatSession && currentArtist === artistId
  }

  exports.getGeminiResponse =  async (inputMessage) => {

    if(!currentArtist)
        return {message: "No Artist Selected"}

    if(!inputMessage)
        return {message: "No Message Received"}

    if(!chatSession)
        return {message: "No Chat Available"}

    const result = await chatSession.sendMessage(inputMessage);
    return {message: result.response.text()};
  }