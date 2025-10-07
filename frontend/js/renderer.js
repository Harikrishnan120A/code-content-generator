// Renderer - Handles output rendering

/**
 * Render the complete explanation output
 */
function renderOutput(data) {
    const outputContainer = document.getElementById('output');
    outputContainer.innerHTML = '';
    
    // Overview Section
    renderOverview(data.overview, outputContainer);
    
    // Concepts Section
    renderConcepts(data.concepts, outputContainer);
    
    // Naive Approach Section
    renderApproach(data.naive_approach, 'Naive Approach', '🐌', outputContainer);
    
    // Optimal Approach Section
    renderApproach(data.optimal_approach, 'Optimal Approach', '🚀', outputContainer);
    
    // Worked Example Section
    renderWorkedExample(data.worked_example, outputContainer);
    
    // Pitfalls Section
    renderPitfalls(data.pitfalls, outputContainer);
    
    // Edge Cases Section
    renderEdgeCases(data.edge_cases, outputContainer);
    
    // Related Problems Section
    renderRelatedProblems(data.related_problems, outputContainer);
}

/**
 * Render overview section
 */
function renderOverview(overview, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader('Problem Overview', '📋');
    const content = document.createElement('div');
    content.className = 'section-content';
    
    content.appendChild(createContentBlock('Description', overview));
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}

/**
 * Render concepts section
 */
function renderConcepts(concepts, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader('Key Concepts', '🧠');
    const content = document.createElement('div');
    content.className = 'section-content';
    
    // Concepts list
    content.appendChild(createContentBlock('Core Concepts', ''));
    content.appendChild(createList(concepts.concepts));
    
    // Prerequisites
    content.appendChild(createContentBlock('Prerequisites', ''));
    content.appendChild(createList(concepts.prerequisites));
    
    // Difficulty
    const difficultyHtml = `
        ${getDifficultyBadge(concepts.difficulty)}
        <p style="margin-top: 8px;">${concepts.difficulty_reason}</p>
    `;
    content.appendChild(createContentBlock('Difficulty', difficultyHtml));
    
    // Analogy
    content.appendChild(createContentBlock('Analogy', `💡 ${concepts.analogy}`));
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}

/**
 * Render approach section (naive or optimal)
 */
function renderApproach(approach, title, icon, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader(title, icon);
    const content = document.createElement('div');
    content.className = 'section-content';
    
    // Approach name
    content.appendChild(createContentBlock('Approach', `<strong>${approach.name}</strong>`));
    
    // Intuition or Key Insight
    if (approach.intuition) {
        content.appendChild(createContentBlock('Intuition', approach.intuition));
    }
    if (approach.key_insight) {
        content.appendChild(createContentBlock('Key Insight', approach.key_insight));
    }
    
    // Pseudocode
    content.appendChild(createContentBlock('Pseudocode', approach.pseudocode, true));
    
    // Complexity
    const complexityHtml = formatComplexity(approach.time_complexity, approach.space_complexity);
    content.appendChild(createContentBlock('Complexity', complexityHtml));
    
    // Limitation or Why Optimal
    if (approach.limitation) {
        content.appendChild(createContentBlock('Limitation', `⚠️ ${approach.limitation}`));
    }
    if (approach.why_optimal) {
        content.appendChild(createContentBlock('Why Optimal', `✅ ${approach.why_optimal}`));
    }
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}

/**
 * Render worked example section
 */
function renderWorkedExample(example, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader('Worked Example', '📝');
    const content = document.createElement('div');
    content.className = 'section-content';
    
    // Input
    content.appendChild(createContentBlock('Input', `<code>${escapeHtml(example.input)}</code>`));
    
    // Steps
    content.appendChild(createContentBlock('Step-by-Step Execution', ''));
    const stepsList = document.createElement('ol');
    stepsList.className = 'list';
    example.steps.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<code>${escapeHtml(step)}</code>`;
        stepsList.appendChild(li);
    });
    content.appendChild(stepsList);
    
    // Output
    content.appendChild(createContentBlock('Output', `<code>${escapeHtml(example.output)}</code>`));
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}

/**
 * Render pitfalls section
 */
function renderPitfalls(pitfalls, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader('Common Pitfalls', '⚠️');
    const content = document.createElement('div');
    content.className = 'section-content';
    
    pitfalls.forEach((pitfall, index) => {
        const pitfallBlock = document.createElement('div');
        pitfallBlock.className = 'content-block';
        pitfallBlock.innerHTML = `
            <div style="padding: 16px; background: rgba(255, 0, 51, 0.1); border-left: 4px solid var(--accent-red); border-radius: 8px; margin-bottom: 16px;">
                <h4 style="color: var(--accent-red); margin-bottom: 8px;">Pitfall ${index + 1}: ${escapeHtml(pitfall.mistake)}</h4>
                <p style="margin-bottom: 8px;"><strong>Why It Fails:</strong> ${escapeHtml(pitfall.why_fails)}</p>
                <p><strong>Fix:</strong> ${escapeHtml(pitfall.fix)}</p>
            </div>
        `;
        content.appendChild(pitfallBlock);
    });
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}

/**
 * Render edge cases section
 */
function renderEdgeCases(edgeCases, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader('Edge Cases to Consider', '🔍');
    const content = document.createElement('div');
    content.className = 'section-content';
    
    content.appendChild(createContentBlock('Test These Scenarios', ''));
    content.appendChild(createList(edgeCases));
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}

/**
 * Create a content block
 */
function createContentBlock(label, value, isCode = false) {
    const block = document.createElement('div');
    block.className = 'content-block';
    
    if (isCode) {
        const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
        block.innerHTML = `
            <div style="position: relative;">
                <span class="content-label">${label}</span>
                <button class="copy-btn" onclick="copyCodeBlock('${codeId}')" title="Copy code">
                    📋 Copy
                </button>
                <pre id="${codeId}"><code>${escapeHtml(formatCode(value))}</code></pre>
            </div>
        `;
    } else {
        block.innerHTML = `
            <span class="content-label">${label}</span>
            <div class="content-value">${value}</div>
        `;
    }
    
    return block;
}

/**
 * Copy code block to clipboard
 */
function copyCodeBlock(codeId) {
    const codeElement = document.getElementById(codeId);
    if (codeElement) {
        const text = codeElement.textContent;
        copyToClipboard(text);
    }
}

/**
 * Render related problems section
 */
function renderRelatedProblems(problems, container) {
    const section = document.createElement('div');
    section.className = 'output-section';
    
    const header = createCollapsibleHeader('Related Problems', '🔗');
    const content = document.createElement('div');
    content.className = 'section-content';
    
    problems.forEach(problem => {
        const problemBlock = document.createElement('div');
        problemBlock.className = 'content-block';
        problemBlock.innerHTML = `
            <div style="padding: 16px; background: rgba(0, 0, 0, 0.4); border-radius: 8px; margin-bottom: 16px;">
                <h4 style="color: var(--accent-bright-red); margin-bottom: 8px;">
                    ${escapeHtml(problem.name)} 
                    ${getDifficultyBadge(problem.difficulty)}
                </h4>
                <p style="margin-bottom: 4px;"><strong>Platform:</strong> ${escapeHtml(problem.platform)}</p>
                <p style="margin-bottom: 4px;"><strong>Similarity:</strong> ${escapeHtml(problem.similarity)}</p>
                <p><strong>Key Difference:</strong> ${escapeHtml(problem.difference)}</p>
            </div>
        `;
        content.appendChild(problemBlock);
    });
    
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
    
    header.addEventListener('click', () => toggleSection(header));
}
