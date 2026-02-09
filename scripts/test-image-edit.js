
const http = require('http');

// A red 1x1 pixel PNG
const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function testImageEdit() {
    const payload = JSON.stringify({
        prompt: 'make this image blue',
        image: base64Image,
        mimeType: 'image/png'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/tools/image',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    console.log(`Testing image editing at http://${options.hostname}:${options.port}${options.path}...`);

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (res.statusCode === 200) {
                    console.log('SUCCESS: Image edited successfully!');
                    if (data.image) {
                        console.log('Modified image data received (Base64 string of length ' + data.image.length + ')');
                    } else {
                        console.error('ERROR: No image data in response');
                    }
                } else {
                    console.error(`FAILED (${res.statusCode}):`, data.error || body);
                }
            } catch (e) {
                console.error('ERROR parsing response:', e.message);
                console.log('Raw response:', body);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`ERROR: ${e.message}. (Is the dev server running?)`);
    });

    req.write(payload);
    req.end();
}

testImageEdit();
