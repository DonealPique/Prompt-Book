document.addEventListener('DOMContentLoaded', () => {
    const promptTitleElement = document.getElementById('prompt-title');
    const promptContentElement = document.getElementById('prompt-content');
    const promptListElement = document.getElementById('prompt-list');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const addPromptButton = document.getElementById('add-prompt');
    const deletePromptButton = document.getElementById('delete-prompt');
    const editPromptButton = document.getElementById('edit-prompt');

    const API_BASE_URL = 'http://localhost:8000';

    const fetchPrompts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/composite_prompts`);
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
            promptItem.className = 'bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600';
            promptItem.textContent = prompt.title;
            promptItem.addEventListener('click', () => loadPrompt(prompt.id));
            promptListElement.appendChild(promptItem);
        });
    };

    const loadPrompt = async (promptId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/composite_prompts/${promptId}/expanded`);
            if (!response.ok) throw new Error('Failed to fetch prompt details');
            const prompt = await response.json();
            promptTitleElement.innerHTML = `<h1 class="text-xl font-bold">${prompt.title}</h1>`;
            promptContentElement.innerHTML = prompt.fragments.map(fragment => `<p>${fragment.promptFragment.content}</p>`).join('');
        } catch (error) {
            console.error('Error loading prompt:', error);
        }
    };

    const sendMessage = () => {
        const message = userInput.value.trim();
        if (message) {
            window.open(`https://chat.openai.com/?q=${encodeURIComponent(message)}`, '_blank');
            userInput.value = '';
        }
    };

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    addPromptButton.addEventListener('click', () => {
        alert('Add Prompt functionality to be implemented.');
    });
    deletePromptButton.addEventListener('click', () => {
        alert('Delete Prompt functionality to be implemented.');
    });
    editPromptButton.addEventListener('click', () => {
        alert('Edit Prompt functionality to be implemented.');
    });
    
    fetchPrompts();
});
