const chatHistory = [];

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    // Clear query textbox
    document.getElementById("user-input").value = "";

    // Append user message to chat history
    chatHistory.push({ role: "user", content: userInput });

    // Update chat history display
    updateChatHistory();

    // Show progress bar
    showProgressBar();

    // Make API call to the backend

    // fetch("http://localhost:5000/gpt-request", {
    fetch("http://127.0.0.1:8080/gpt-request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        // Process and append GPT-3 response to chat history
        const assistantMessage = { role: "assistant", content: data.output };
        chatHistory.push(assistantMessage);

        // Update chat history display
        updateChatHistory();

        // Hide progress bar
        hideProgressBar();
    })
    .catch(error => {
        console.error("Error:", error);
        hideProgressBar();
        // Display an error message to the user in the chat history
        chatHistory.push({ role: "assistant", content: "Sorry, something went wrong. Please try again later." });
        updateChatHistory();
    });
}

function updateChatHistory() {
    const chatHistoryElement = document.getElementById("chat-history");

    // Clear the chat history display
    chatHistoryElement.innerHTML = "";

    // Append messages to the chat history display
    chatHistory.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${message.role}`;
        messageElement.textContent = message.content;

        // Apply different styles for user and assistant messages
        if (message.role === 'user') {
            messageElement.classList.add('user-message');
        } else if (message.role === 'assistant') {
            messageElement.classList.add('assistant-message');
        }

        chatHistoryElement.appendChild(messageElement);
    });
}

function showProgressBar() {
    document.getElementById("progress-bar").style.display = "block";
    const progressBarInner = document.getElementById("progress-bar-inner");
    progressBarInner.style.width = "0%";
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += 1;
            progressBarInner.style.width = `${width}%`;
        }
    }, 50);
}

function hideProgressBar() {
    document.getElementById("progress-bar").style.display = "none";
}
