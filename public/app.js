// Raincloud Frontend JavaScript

// Board configuration
const boardMembers = [
    { role: 'Chairman', name: 'The Chairman', icon: '👔', specialty: 'Final decisions' },
    { role: 'CEO', name: 'Chief Executive', icon: '🎯', specialty: 'Strategy' },
    { role: 'CFO', name: 'Chief Financial', icon: '💰', specialty: 'Finance' },
    { role: 'CTO', name: 'Chief Technology', icon: '💻', specialty: 'Technology' },
    { role: 'CPO', name: 'Chief Product', icon: '📱', specialty: 'Product' },
    { role: 'CMO', name: 'Chief Marketing', icon: '📢', specialty: 'Marketing' }
];

let sessionCost = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBoardMembers();
    loadProviderStatus();
    setupEventListeners();
});

// Load board members into UI
function loadBoardMembers() {
    const grid = document.getElementById('boardGrid');
    grid.innerHTML = boardMembers.map(member => `
        <div class="board-member" data-role="${member.role}">
            <div class="member-role">${member.icon} ${member.role}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-specialty">${member.specialty}</div>
            <div class="member-model" id="model-${member.role}">Loading...</div>
            <div class="member-cost" id="cost-${member.role}"></div>
        </div>
    `).join('');
}

// Load provider status from backend
async function loadProviderStatus() {
    try {
        const response = await fetch('/.netlify/functions/get-board-config');
        const config = await response.json();
        
        document.getElementById('providerStatus').textContent = 
            `Active: ${config.activeProviders.join(', ')}`;
        
        // Update board members with provider info
        config.members.forEach(member => {
            const modelEl = document.getElementById(`model-${member.role}`);
            const costEl = document.getElementById(`cost-${member.role}`);
            
            if (modelEl) {
                modelEl.textContent = `${member.provider}/${member.model}`;
                modelEl.className = `member-model status-badge ${member.costTier}`;
            }
            
            if (costEl) {
                costEl.textContent = member.cost;
            }
        });
        
        // Update provider info panel
        displayProviderInfo(config);
        
    } catch (error) {
        console.error('Error loading provider status:', error);
        document.getElementById('providerStatus').textContent = 
            'Error loading providers';
    }
}

// Display provider information
function displayProviderInfo(config) {
    const infoDiv = document.getElementById('providerInfo');
    infoDiv.innerHTML = `
        <div class="provider-card">
            <strong>Total Providers</strong>
            <span>${config.activeProviders.length}</span>
        </div>
        <div class="provider-card">
            <strong>Free Providers</strong>
            <span>${config.freeProviders || 0}</span>
        </div>
        <div class="provider-card">
            <strong>Estimated Cost/10K tokens</strong>
            <span>${config.estimatedCost || '$0.00'}</span>
        </div>
        <div class="provider-card">
            <strong>Configuration</strong>
            <span>${config.configType || 'Hybrid'}</span>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    const submitBtn = document.getElementById('submitBtn');
    const proposalText = document.getElementById('proposalText');
    
    submitBtn.addEventListener('click', submitProposal);
    
    // Allow Ctrl+Enter to submit
    proposalText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            submitProposal();
        }
    });
}

// Submit proposal to board
async function submitProposal() {
    const proposalText = document.getElementById('proposalText').value.trim();
    const includeChairman = document.getElementById('includeChairman').checked;
    const streamResponses = document.getElementById('streamResponses').checked;
    const submitBtn = document.getElementById('submitBtn');
    
    if (!proposalText) {
        alert('Please enter a proposal');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'inline';
    
    // Show discussion section
    const discussionSection = document.getElementById('discussionSection');
    discussionSection.style.display = 'block';
    
    // Clear previous discussion
    const discussionContainer = document.getElementById('discussionContainer');
    discussionContainer.innerHTML = '<div class="response-loading">Consulting the board...</div>';
    
    try {
        const response = await fetch('/.netlify/functions/submit-proposal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                proposal: proposalText,
                includeChairman: includeChairman,
                stream: streamResponses
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit proposal');
        }
        
        const result = await response.json();
        
        // Display responses
        displayResponses(result.responses, result.estimatedCost);
        
        // Update session cost
        updateSessionCost(result.estimatedCost);
        
    } catch (error) {
        console.error('Error:', error);
        discussionContainer.innerHTML = `
            <div class="response-card" style="border-left-color: var(--error-color);">
                <div class="response-content">
                    ❌ Error: ${error.message}<br>
                    Please check your API keys are configured correctly in Netlify environment variables.
                </div>
            </div>
        `;
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
    }
}

// Display board responses
function displayResponses(responses, cost) {
    const container = document.getElementById('discussionContainer');
    container.innerHTML = '';
    
    responses.forEach((response, index) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.className = `response-card ${response.role === 'Chairman' ? 'chairman' : ''}`;
            
            const icon = boardMembers.find(m => m.role === response.role)?.icon || '👤';
            
            card.innerHTML = `
                <div class="response-header">
                    <div class="response-role">${icon} ${response.role}</div>
                    <div class="response-meta">
                        <span>${response.provider}</span>
                        <span>${response.tokens || 0} tokens</span>
                        <span>${response.cost || '$0.00'}</span>
                    </div>
                </div>
                <div class="response-content">${formatResponse(response.response)}</div>
            `;
            
            container.appendChild(card);
            
            // Scroll to new card
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        }, index * 300); // Stagger the display
    });
}

// Format response text
function formatResponse(text) {
    // Basic markdown-like formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Update session cost
function updateSessionCost(additionalCost) {
    const costStr = additionalCost.replace('$', '');
    sessionCost += parseFloat(costStr) || 0;
    document.getElementById('sessionCost').textContent = 
        `$${sessionCost.toFixed(4)}`;
}

// Test API connection
async function testConnection() {
    const originalText = event.target.textContent;
    event.target.textContent = 'Testing...';
    event.target.disabled = true;
    
    try {
        const response = await fetch('/.netlify/functions/test-connection');
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ Connection successful!\n\nWorking providers: ${result.workingProviders.join(', ')}\nTotal providers: ${result.totalProviders}`);
        } else {
            alert(`⚠️ Some providers failed\n\n${result.message}`);
        }
    } catch (error) {
        alert(`❌ Connection test failed\n\n${error.message}`);
    } finally {
        event.target.textContent = originalText;
        event.target.disabled = false;
    }
}

// Clear discussion history
function clearHistory() {
    if (confirm('Clear all discussions?')) {
        document.getElementById('discussionContainer').innerHTML = '';
        document.getElementById('discussionSection').style.display = 'none';
        sessionCost = 0;
        document.getElementById('sessionCost').textContent = '$0.00';
    }
}

// Add some example proposals
const exampleProposals = [
    "Should we expand into the European market? We have $500K budget and 6 months timeline.",
    "We received a $2M acquisition offer. Should we accept or continue growing independently?",
    "Our competitor just launched a similar product. How should we respond?",
    "Should we pivot from B2C to B2B? Our current MRR is $50K with 1000 users.",
    "We need to cut costs by 30%. What areas should we focus on?"
];

// Optional: Add example button
window.addEventListener('load', function() {
    const textarea = document.getElementById('proposalText');
    const randomBtn = document.createElement('button');
    randomBtn.className = 'secondary-btn';
    randomBtn.textContent = '🎲 Try Example Proposal';
    randomBtn.style.marginTop = '10px';
    randomBtn.onclick = function() {
        const example = exampleProposals[Math.floor(Math.random() * exampleProposals.length)];
        textarea.value = example;
        textarea.focus();
    };
    document.querySelector('.proposal-form').appendChild(randomBtn);
});
