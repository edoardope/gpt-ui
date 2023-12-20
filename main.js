const API_BASE_URL = 'https://api.openai.com/v1';
let API_KEY = ''
const GPT_MODEL = 'gpt-3.5-turbo';
const screen = document.getElementById('response')
const completeChat = [];

var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var resultElement = document.getElementById('result');
var stopSpeakingButton = document.getElementById('stopSpeaking');

var recognition = new webkitSpeechRecognition();

recognition.lang = window.navigator.language;
recognition.interimResults = true;
let speach = ""

startButton.addEventListener('click', () => { recognition.start(); });
stopSpeakingButton.addEventListener('click', () => { stopSpeaking(); });
stopButton.addEventListener('click', async () => { 
    
    recognition.stop(); 
    speach = resultElement.textContent;  
    console.log(speach);

    userText = document.getElementById("user-text").value;

        completeChat.push({
            role: 'user',
            content: speach
        });

        const gptResponse = await makeRequest('/chat/completions', {
            temperature: 0.2,
            model: GPT_MODEL,
            messages: completeChat
        });

        console.log(gptResponse);

        const messageContent = gptResponse.choices[0].message.content;
        console.log(messageContent); // Verifica il contenuto del messaggio nella console

        var utterance = new SpeechSynthesisUtterance(messageContent);

        // Impostazione della voce (opzionale, selezionare una voce disponibile)
        var voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(voice => voice.name === 'it-IT-Wavenet-B');
        
        // Modifica delle caratteristiche della voce
        utterance.rate = 1; // Velocità di lettura (1 è il valore predefinito, valori più bassi rallentano, valori più alti accelerano)
        utterance.pitch = 1; // Altezza della voce (1 è il valore predefinito, valori più bassi rendono la voce più grave, valori più alti la rendono più acuta)
        
        speechSynthesis.speak(utterance);

        // Verifica che "screen" sia selezionato correttamente
        console.log(screen);

        // Assegna il contenuto del messaggio al paragrafo "screen"
        screen.textContent = messageContent;


});

function stopSpeaking() {
    speechSynthesis.cancel();
}


recognition.addEventListener('result', (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    resultElement.textContent = result;
});

const setPromptButton = document.getElementById("set-prompt-button");
setPromptButton.addEventListener("click", function () {
    const gptPromptInput = document.getElementById("gpt-prompt-input");
    selectedPrompt = gptPromptInput.value;
    const api = document.getElementById('api')
    API_KEY = api.value;
    console.log("Prompt selezionato:", selectedPrompt);
    start()
});

async function start() {
    debugger;
    completeChat.push({
        role: 'system', //come si deve comportare gpt 
        content: selectedPrompt
    });

    const inzialization = await makeRequest('/chat/completions', {
        temperature: 0.2, // grado di imprevedibilità
        model: GPT_MODEL,
        messages: completeChat
    });

    console.log(inzialization)
}

document.getElementById("user-text").addEventListener("keydown", async function (event) {
    if (event.keyCode === 13) {

        userText = document.getElementById("user-text").value;
        console.log(userText);

        completeChat.push({
            role: 'user',
            content: userText
        });

        const gptResponse = await makeRequest('/chat/completions', {
            temperature: 0.2,
            model: GPT_MODEL,
            messages: completeChat
        });

        console.log(gptResponse);

        const messageContent = gptResponse.choices[0].message.content;
        console.log(messageContent); // Verifica il contenuto del messaggio nella console

        // Verifica che "screen" sia selezionato correttamente
        console.log(screen);

        // Assegna il contenuto del messaggio al paragrafo "screen"
        screen.textContent = messageContent;
    }
});

async function makeRequest(endpoint, payload) {
    const url = API_BASE_URL + endpoint;

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        }
    })

    const jsonResponse = await response.json();
    return jsonResponse;
}