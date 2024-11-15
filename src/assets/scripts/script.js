document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL_PROMPTS = 'http://localhost:8001/prompt_fragments';
    const API_BASE_URL_TAGS = 'http://localhost:8001/tags';

    const promptListElement = document.getElementById('prompt-list');
    const tagFilter = document.getElementById('tag-filter');
    const userInput = document.getElementById('user-input');
    const addPromptButton = document.getElementById('add-prompt');
    const deletePromptButton = document.getElementById('delete-prompt');
    const editPromptButton = document.getElementById('edit-prompt');
    const sendButton = document.getElementById('send-button');
    const clearFilterButton = document.getElementById('clear-filter');

    let selectedPrompt = null;

    const fetchPrompts = async (tag = '') => {
        try {
            const response = await fetch(`${API_BASE_URL_PROMPTS}${tag ? `?tag=${tag}` : ''}`);
            if (!response.ok) throw new Error('Failed to fetch prompts');
            const prompts = await response.json();
            displayPrompts(prompts);
        } catch (error) {
            console.error('Error fetching prompts:', error);
            promptListElement.innerHTML = '<p class="text-red-500">Error fetching prompts. Please try again later.</p>';
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch(API_BASE_URL_TAGS);
            if (!response.ok) throw new Error('Failed to fetch tags');
            const tags = await response.json();
            populateTagFilter(tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const populateTagFilter = (tags) => {
        tagFilter.innerHTML = '<option value="">Filter by Tag</option>';
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.name;
            option.textContent = tag.name;
            tagFilter.appendChild(option);
        });
    };

    const displayPrompts = (prompts) => {
        promptListElement.innerHTML = '';
        if (prompts.length === 0) {
            promptListElement.innerHTML = '<p class="text-gray-400">No prompts available.</p>';
            return;
        }
        prompts.forEach(prompt => {
            const promptItem = document.createElement('div');
            promptItem.className = 'bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600 mb-2';
            promptItem.innerHTML = `
                <strong>ID:</strong> ${prompt.id} <br>
                <strong>Content:</strong> ${prompt.content} <br>
                <strong>Description:</strong> ${prompt.description} <br>
                <strong>Tags:</strong> ${prompt.tags ? prompt.tags.join(', ') : 'None'}`;
            promptItem.addEventListener('click', () => selectPrompt(prompt));
            promptListElement.appendChild(promptItem);
        });
    };

    const selectPrompt = (prompt) => {
        selectedPrompt = prompt;
        userInput.value = `${prompt.content}\n\n${prompt.description}\n\nTags: ${prompt.tags ? prompt.tags.join(', ') : ''}`;
    };

    const addPrompt = async () => {
        const [content, description, tagsLine] = userInput.value.split('\n\n');
        const tags = tagsLine ? tagsLine.replace('Tags: ', '').split(',').map(tag => tag.trim()) : [];
        if (content && description) {
            try {
                const response = await fetch(API_BASE_URL_PROMPTS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, description, tags, author_id: 1 })
                });
                if (!response.ok) throw new Error('Failed to add prompt');
                userInput.value = '';
                fetchPrompts();
            } catch (error) {
                console.error('Error adding prompt:', error);
            }
        } else {
            alert('Please provide both content and description.');
        }
    };

    const deletePrompt = async () => {
        if (!selectedPrompt) {
            alert('Please select a prompt to delete');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL_PROMPTS}/${selectedPrompt.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete prompt');
            userInput.value = '';
            selectedPrompt = null;
            fetchPrompts();
        } catch (error) {
            console.error('Error deleting prompt:', error);
        }
    };

    const editPrompt = async () => {
        if (!selectedPrompt) {
            alert('Please select a prompt to edit');
            return;
        }

        const [content, description, tagsLine] = userInput.value.split('\n\n');
        const tags = tagsLine ? tagsLine.replace('Tags: ', '').split(',').map(tag => tag.trim()) : [];

        if (!content || !description) {
            alert('Content and description are required for editing.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL_PROMPTS}/${selectedPrompt.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author_id: selectedPrompt.author_id || 1,
                    content: content.trim(),
                    description: description.trim(),
                    tags: tags
                })
            });

            if (!response.ok) {
                console.error('Failed to edit prompt:', await response.text());
                throw new Error('Failed to edit prompt');
            }

            userInput.value = '';
            selectedPrompt = null;
            fetchPrompts();
        } catch (error) {
            console.error('Error editing prompt:', error);
            alert('Failed to edit prompt. Please check console for details.');
        }
    };

    const sendToChatGPT = (message) => {
        const url = `https://chat.openai.com/?q=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleSend = () => {
        const message = userInput.value.trim();
        if (message) {
            sendToChatGPT(message);
        }
    };

    addPromptButton.addEventListener('click', addPrompt);
    deletePromptButton.addEventListener('click', deletePrompt);
    editPromptButton.addEventListener('click', editPrompt);
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    });
    tagFilter.addEventListener('change', () => fetchPrompts(tagFilter.value));
    clearFilterButton.addEventListener('click', () => {
        tagFilter.value = '';
        fetchPrompts();
    });

    fetchPrompts();
    fetchTags();
});
