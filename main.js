const API_BASE_URL = 'https://api.openai.com/v1';
let API_KEY = ''
const GPT_MODEL = 'gpt-3.5-turbo';
const screen = document.getElementById('response')
const completeChat = []

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