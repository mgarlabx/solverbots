// Get all icon names from Icons object
const iconNames = Object.keys(Icons).filter(key => key !== 'get');

// Render icons
function renderIcons() {
    const iconGrid = document.getElementById('iconGrid');
    
    iconNames.forEach(iconName => {
        const iconCard = document.createElement('div');
        iconCard.className = 'icon-card';
        
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'icon-wrapper';
        iconWrapper.innerHTML = Icons[iconName];
        
        const iconNameEl = document.createElement('div');
        iconNameEl.className = 'icon-name';
        iconNameEl.textContent = iconName;
        
        iconCard.appendChild(iconWrapper);
        iconCard.appendChild(iconNameEl);
        
        // Add click event to download
        iconCard.addEventListener('click', () => downloadIcon(iconName));
        
        iconGrid.appendChild(iconCard);
    });
}

// Download icon as PNG
function downloadIcon(iconName) {
    const svgContent = Icons[iconName];
    
    // Create a temporary container to render SVG
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = svgContent;
    document.body.appendChild(tempDiv);
    
    const svgElement = tempDiv.querySelector('svg');
    
    // Set default size if not specified
    const size = 512;
    if (!svgElement.getAttribute('width')) svgElement.setAttribute('width', size);
    if (!svgElement.getAttribute('height')) svgElement.setAttribute('height', size);
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        
        canvas.toBlob(function(blob) {
            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `${iconName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(pngUrl);
            URL.revokeObjectURL(url);
            document.body.removeChild(tempDiv);
        }, 'image/png');
    };
    
    img.onerror = function() {
        console.error('Erro ao carregar imagem');
        document.body.removeChild(tempDiv);
    };
    
    img.src = url;
}

// Initialize
renderIcons();
