let currentUser = null;
let currentProject = null;
let generatedImages = [];

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}

function openCreateModal() {
    openModal('createModal');
}

function createNewApp(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const appData = {
        name: formData.get('appName'),
        type: formData.get('appType'),
        framework: formData.get('framework'),
        aiProvider: formData.get('aiProvider'),
        createdAt: new Date().toISOString()
    };
    
    showLoading('Creating your React AI app...');
    
    setTimeout(() => {
        hideLoading();
        closeModal('createModal');
        
        createProjectStructure(appData);
        
        showNotification(`Successfully created "${appData.name}"!`, 'success');
        
        event.target.reset();
    }, 2000);
}

function createProjectStructure(appData) {
    const projectStructure = {
        name: appData.name,
        framework: appData.framework,
        files: generateProjectFiles(appData),
        dependencies: getDependencies(appData),
        scripts: getScripts(appData)
    };
    
    currentProject = projectStructure;
    
    console.log('Project created:', projectStructure);
    
    downloadProjectFiles(projectStructure);
}

function generateProjectFiles(appData) {
    const files = {
        'package.json': generatePackageJson(appData),
        'README.md': generateReadme(appData),
        'src/App.js': generateAppJs(appData),
        'src/index.js': generateIndexJs(appData),
        'public/index.html': generateIndexHtml(appData)
    };
    
    if (appData.framework === 'nextjs') {
        files['pages/index.js'] = generateNextJsPage(appData);
        files['next.config.js'] = generateNextConfig();
    }
    
    if (appData.aiProvider) {
        files['src/services/ai.js'] = generateAIService(appData.aiProvider);
    }
    
    return files;
}

function openTemplateModal() {
    openModal('templateModal');
}

function useTemplate(templateId) {
    showLoading('Setting up template...');
    
    const templates = {
        'chat-template': {
            name: 'AI Chat Interface',
            framework: 'react',
            aiProvider: 'openai',
            features: ['Real-time chat', 'Message history', 'AI responses']
        },
        'image-template': {
            name: 'Image Generator',
            framework: 'nextjs',
            aiProvider: 'replicate',
            features: ['Image generation', 'Gallery view', 'Download options']
        },
        'dashboard-template': {
            name: 'Data Dashboard',
            framework: 'react',
            aiProvider: 'custom',
            features: ['Charts', 'Analytics', 'Real-time data']
        }
    };
    
    const template = templates[templateId];
    
    setTimeout(() => {
        hideLoading();
        closeModal('templateModal');
        
        const appData = {
            name: template.name,
            type: 'custom',
            framework: template.framework,
            aiProvider: template.aiProvider,
            template: templateId,
            features: template.features
        };
        
        createProjectStructure(appData);
        showNotification(`Template "${template.name}" applied successfully!`, 'success');
    }, 1500);
}

function openImageGenerator() {
    openModal('imageGeneratorModal');
}

function generateImage() {
    const prompt = document.getElementById('imagePrompt').value;
    const style = document.getElementById('imageStyle').value;
    const size = document.getElementById('imageSize').value;
    
    if (!prompt.trim()) {
        showNotification('Please enter a description for the image', 'error');
        return;
    }
    
    showLoading('Generating your image with AI...');
    
    setTimeout(() => {
        hideLoading();
        
        const imageUrl = `https://via.placeholder.com/${size.replace('x', 'x')}/61dafb/ffffff?text=${encodeURIComponent(prompt)}`;
        
        displayGeneratedImage(imageUrl, prompt);
        showNotification('Image generated successfully!', 'success');
    }, 3000);
}

function displayGeneratedImage(imageUrl, prompt) {
    const preview = document.getElementById('imagePreview');
    const actions = document.getElementById('imageActions');
    
    preview.innerHTML = `
        <img src="${imageUrl}" alt="${prompt}" style="max-width: 100%; height: auto; border-radius: 8px;">
        <p style="margin-top: 10px; font-size: 14px; color: #666;">${prompt}</p>
    `;
    
    actions.style.display = 'flex';
    
    generatedImages.push({
        url: imageUrl,
        prompt: prompt,
        timestamp: new Date().toISOString()
    });
}

function downloadImage() {
    const preview = document.getElementById('imagePreview');
    const img = preview.querySelector('img');
    
    if (img) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `react-hub-generated-${Date.now()}.png`;
        link.click();
        showNotification('Image downloaded successfully!', 'success');
    }
}

function useInProject() {
    if (currentProject) {
        const preview = document.getElementById('imagePreview');
        const img = preview.querySelector('img');
        
        if (img) {
            showNotification('Image added to your project!', 'success');
            closeModal('imageGeneratorModal');
        }
    } else {
        showNotification('Please create a project first', 'error');
    }
}

function openImportModal() {
    openModal('importModal');
}

function importFromGitHub() {
    const url = document.getElementById('githubUrl').value;
    
    if (!url.trim()) {
        showNotification('Please enter a GitHub repository URL', 'error');
        return;
    }
    
    showLoading('Importing from GitHub...');
    
    setTimeout(() => {
        hideLoading();
        closeModal('importModal');
        
        const projectName = url.split('/').pop();
        showNotification(`Successfully imported "${projectName}" from GitHub!`, 'success');
        
        document.getElementById('githubUrl').value = '';
    }, 2000);
}

function importFromZip() {
    const fileInput = document.getElementById('zipFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a ZIP file', 'error');
        return;
    }
    
    showLoading('Processing ZIP file...');
    
    setTimeout(() => {
        hideLoading();
        closeModal('importModal');
        
        showNotification(`Successfully imported "${file.name}"!`, 'success');
        
        fileInput.value = '';
    }, 2000);
}

function importFromUrl() {
    const url = document.getElementById('projectUrl').value;
    
    if (!url.trim()) {
        showNotification('Please enter a project URL', 'error');
        return;
    }
    
    showLoading('Importing from URL...');
    
    setTimeout(() => {
        hideLoading();
        closeModal('importModal');
        
        showNotification(`Successfully imported project from URL!`, 'success');
        
        document.getElementById('projectUrl').value = '';
    }, 2000);
}

function deployToVercel() {
    if (!currentProject) {
        showNotification('Please create a project first', 'error');
        return;
    }
    
    showLoading('Deploying to Vercel...');
    
    setTimeout(() => {
        hideLoading();
        
        const deployUrl = `https://${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.vercel.app`;
        showNotification(`Deployed successfully! Visit: ${deployUrl}`, 'success');
        
        window.open(deployUrl, '_blank');
    }, 3000);
}

function deployToNetlify() {
    if (!currentProject) {
        showNotification('Please create a project first', 'error');
        return;
    }
    
    showLoading('Deploying to Netlify...');
    
    setTimeout(() => {
        hideLoading();
        
        const deployUrl = `https://${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.netlify.app`;
        showNotification(`Deployed successfully! Visit: ${deployUrl}`, 'success');
        
        window.open(deployUrl, '_blank');
    }, 3000);
}

function openCustomDeployModal() {
    openModal('customDeployModal');
}

function setupCustomDeployment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const deployData = {
        provider: formData.get('cloudProvider'),
        type: formData.get('deploymentType'),
        domain: formData.get('domain')
    };
    
    showLoading(`Setting up ${deployData.provider} deployment...`);
    
    setTimeout(() => {
        hideLoading();
        closeModal('customDeployModal');
        
        showNotification(`Custom deployment setup complete for ${deployData.provider}!`, 'success');
        
        event.target.reset();
    }, 2500);
}

function filterApps() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const categoryFilter = document.querySelectorAll('.filter-select')[0].value;
    const frameworkFilter = document.querySelectorAll('.filter-select')[1].value;
    
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const category = card.dataset.category;
        const framework = card.dataset.framework;
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = categoryFilter === 'All Categories' || category === categoryFilter;
        const matchesFramework = frameworkFilter === 'All Frameworks' || framework === frameworkFilter;
        
        if (matchesSearch && matchesCategory && matchesFramework) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function previewApp(appId) {
    const appUrls = {
        'ai-chat-interface': 'https://ai-chat-demo.vercel.app',
        'ai-image-generator': 'https://image-gen-demo.vercel.app',
        'ai-data-dashboard': 'https://dashboard-demo.vercel.app',
        'voice-ai-assistant': 'https://voice-assistant-demo.vercel.app'
    };
    
    const url = appUrls[appId];
    if (url) {
        window.open(url, '_blank');
        showNotification('Opening app preview...', 'info');
    }
}

function deployApp(appId) {
    showLoading('Deploying app...');
    
    setTimeout(() => {
        hideLoading();
        
        const deployUrl = `https://${appId}.vercel.app`;
        showNotification(`App deployed successfully! Visit: ${deployUrl}`, 'success');
        
        window.open(deployUrl, '_blank');
    }, 2000);
}

function loadMoreApps() {
    showLoading('Loading more apps...');
    
    setTimeout(() => {
        hideLoading();
        
        const appsGrid = document.getElementById('appsGrid');
        const newAppCard = document.createElement('div');
        newAppCard.className = 'app-card';
        newAppCard.innerHTML = `
            <div class="app-image">
                <img src="https://via.placeholder.com/300x200/6366f1/ffffff?text=New+App" alt="New App">
                <div class="app-overlay">
                    <button class="preview-btn"><i class="fas fa-eye"></i> Preview</button>
                    <button class="deploy-btn"><i class="fas fa-rocket"></i> Deploy</button>
                </div>
            </div>
            <div class="app-info">
                <div class="app-header">
                    <h3>New AI App</h3>
                    <div class="app-rating">
                        <i class="fas fa-star"></i>
                        <span>4.5</span>
                    </div>
                </div>
                <p>Latest addition to our React AI library</p>
                <div class="app-meta">
                    <span class="framework-badge react">React</span>
                    <span class="category-badge">AI Integration</span>
                </div>
                <div class="app-stats">
                    <span><i class="fas fa-download"></i> 500</span>
                    <span><i class="fas fa-star"></i> 4.5</span>
                    <span><i class="fas fa-code-branch"></i> 45</span>
                </div>
            </div>
        `;
        
        appsGrid.appendChild(newAppCard);
        showNotification('More apps loaded!', 'success');
    }, 1500);
}

function showLoading(message = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = document.getElementById('loadingText');
    
    text.textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    showLoading('Subscribing to newsletter...');
    
    setTimeout(() => {
        hideLoading();
        showNotification('Successfully subscribed to React Hub newsletter!', 'success');
        event.target.reset();
    }, 1000);
}

function startCustomProject() {
    showLoading('Setting up development environment...');
    
    setTimeout(() => {
        hideLoading();
        
        const projectName = `react-ai-project-${Date.now()}`;
        showNotification(`Development environment ready! Project: ${projectName}`, 'success');
        
        console.log('Opening development environment for:', projectName);
    }, 2000);
}

function generatePackageJson(appData) {
    return JSON.stringify({
        name: appData.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: `AI-powered React application: ${appData.name}`,
        main: 'src/index.js',
        scripts: getScripts(appData),
        dependencies: getDependencies(appData),
        devDependencies: {
            'react-scripts': '5.0.1'
        }
    }, null, 2);
}

function getDependencies(appData) {
    const deps = {
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
    };
    
    if (appData.aiProvider === 'openai') {
        deps['openai'] = '^4.0.0';
    }
    
    if (appData.framework === 'nextjs') {
        deps['next'] = '^14.0.0';
    }
    
    return deps;
}

function getScripts(appData) {
    if (appData.framework === 'nextjs') {
        return {
            'dev': 'next dev',
            'build': 'next build',
            'start': 'next start'
        };
    }
    
    return {
        'start': 'react-scripts start',
        'build': 'react-scripts build',
        'test': 'react-scripts test',
        'eject': 'react-scripts eject'
    };
}

function generateAppJs(appData) {
    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>${appData.name}</h1>
        <p>AI-powered React application</p>
      </header>
    </div>
  );
}

export default App;`;
}

function generateIndexJs(appData) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
}

function generateIndexHtml(appData) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${appData.name}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

function generateReadme(appData) {
    return `# ${appData.name}

AI-powered React application created with React Hub.

## Features
- React ${appData.framework === 'nextjs' ? 'with Next.js' : ''}
- AI Integration: ${appData.aiProvider || 'None'}
- Modern UI with Tailwind CSS

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Deployment

This project can be deployed to Vercel, Netlify, or any other React-compatible platform.

Created with ❤️ by React Hub`;
}   

function generateNextJsPage(appData) {
    return `import React from 'react';

export default function Home() {
  return (
    <div className="container">
      <h1>${appData.name}</h1>
      <p>AI-powered Next.js application</p>
    </div>
  );
}`;
}

function generateNextConfig() {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`;
}

function generateAIService(provider) {
    const services = {
        'openai': `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const generateResponse = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};`,
        'replicate': `export const generateImage = async (prompt) => {
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': \`Token \${process.env.REACT_APP_REPLICATE_API_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
        input: { prompt: prompt }
      }),
    });
    
    const prediction = await response.json();
    return prediction;
  } catch (error) {
    console.error('Replicate API Error:', error);
    throw error;
  }
};`,
        'huggingface': `export const generateText = async (prompt) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        headers: { Authorization: \`Bearer \${process.env.REACT_APP_HUGGINGFACE_API_KEY}\` },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = await response.json();
    return result[0].generated_text;
  } catch (error) {
    console.error('HuggingFace API Error:', error);
    throw error;
  }
};`
    };
    
    return services[provider] || `// Custom AI service for ${provider}
export const customAIService = async (input) => {
  // Implement your custom AI service here
  return 'Custom AI response';
};`;
}

function downloadProjectFiles(projectStructure) {
    console.log('Project files ready for download:', projectStructure);
    
    Object.entries(projectStructure.files).forEach(([filename, content]) => {
        console.log(`\n--- ${filename} ---\n${content}`);
    });
    
    showNotification('Project files generated! Check console for details.', 'success');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('React Hub initialized successfully!');
    
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            openCreateModal();
        }
        
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
            event.preventDefault();
            openImageGenerator();
        }
        
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    setTimeout(() => {
        showNotification('Welcome to React Hub! Press Ctrl+N to create a new app.', 'info');
    }, 1000);
});
