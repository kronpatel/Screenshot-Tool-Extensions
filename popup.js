document.getElementById('screenshotButton').addEventListener('click', () => {
    const format = document.getElementById('imageFormat').value;
    const includeTimestamp = document.getElementById('includeTimestamp').checked;

    chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
        if (chrome.runtime.lastError) {
            document.getElementById('statusMessage').textContent = 'Error taking screenshot: ' + chrome.runtime.lastError.message;
            return;
        }

        // Convert the image dataUrl to the selected format if needed
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = dataUrl;

        img.onload = () => {
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Add timestamp if checked
            if (includeTimestamp) {
                ctx.font = '20px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText(new Date().toLocaleString(), 10, img.height - 10);
            }

            // Create an anchor element to download the image in the selected format
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/' + format);
            link.download = 'screenshot.' + format; // Use the selected format
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.getElementById('statusMessage').textContent = 'Screenshot taken!';
        };
    });
});
