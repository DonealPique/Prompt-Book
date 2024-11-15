	document.addEventListener('DOMContentLoaded', () => {
    const promptListElement = document.getElementById('prompt-list');
    const userInput = document.getElementById('user-input');
    const addPromptButton = document.getElementById('add-prompt');
    const deletePromptButton = document.getElementById('delete-prompt');
    const editPromptButton = document.getElementById('edit-prompt');

const API_BASE_URL = 'http://localhost:8001/prompt_fragments';
let selectedPromptId = null;

const fetchPrompts = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch prompts');
        const prompts = await response.json();
        displayPrompts(prompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
    }
};

const displayPrompts = (prompts) => {
    promptListElement.innerHTML = '';
    prompts.forEach(prompt => {
        const promptItem = document.createElement('div');
        promptItem.className = 'bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600 mb-2';
        promptItem.innerHTML = `<strong>ID:</strong> ${prompt.id} - <strong>Content:</strong> ${prompt.content}`;
        promptItem.addEventListener('click', () => selectPrompt(prompt));
        promptListElement.appendChild(promptItem);
    });
};

const selectPrompt = (prompt) => {
    selectedPromptId = prompt.id;
    userInput.value = prompt.content;
};

const addPrompt = async () => {
    const content = userInput.value.trim();
    if (content) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author_id: 1,
                    content: content,
                    description: 'User-added prompt',
                })
            });
            if (!response.ok) throw new Error('Failed to add prompt');
            userInput.value = '';
            fetchPrompts();
            alert('Prompt added successfully!');
        } catch (error) {
            console.error('Error adding prompt:', error);
        }
    }
};

const deletePrompt = async () => {
    if (!selectedPromptId) {
        alert('Please select a prompt to delete');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${selectedPromptId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete prompt');
        userInput.value = '';
        selectedPromptId = null;
        fetchPrompts();
        alert('Prompt deleted successfully!');
    } catch (error) {
        console.error('Error deleting prompt:', error);
    }
};

const editPrompt = async () => {
    const content = userInput.value.trim();
    if (!selectedPromptId || !content) {
        alert('Please select a prompt and enter new content to edit');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${selectedPromptId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                author_id: 1,
                content: content,
                description: 'User-updated prompt'
            })
        });
        if (!response.ok) throw new Error('Failed to edit prompt');
        userInput.value = '';
        selectedPromptId = null;
        fetchPrompts();
        alert('Prompt updated successfully!');
    } catch (error) {
        console.error('Error editing prompt:', error);
    }
};

const getChatGPTResponse = async () => {
    const message = userInput.value.trim();
    if (message) {
        try {
            const response = await fetch(`https://chat.openai.com/?q=${encodeURIComponent(message)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            if (!response.ok) throw new Error('Failed to get response from ChatGPT');
            const data = await response.json();
            displayChatGPTResponse(data.response);
        } catch (error) {
            console.error('Error fetching ChatGPT response:', error);
        }
    }
};

const displayChatGPTResponse = (response) => {
    const chatResponseElement = document.createElement('div');
    chatResponseElement.className = 'bg-blue-600 p-2 rounded text-white mt-2';
    chatResponseElement.innerText = `ChatGPT: ${response}`;
    promptListElement.appendChild(chatResponseElement);
};

addPromptButton.addEventListener('click', addPrompt);
deletePromptButton.addEventListener('click', deletePrompt);
editPromptButton.addEventListener('click', editPrompt);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getChatGPTResponse();
    }
});

fetchPrompts();
});

