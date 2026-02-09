const http = require('http');

async function testLocalVideoGen() {
    const payload = JSON.stringify({
        prompt: 'a cat dancing in the rain'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/tools/video',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    console.log(`Testing LOCAL video generator at http://${options.hostname}:${options.port}${options.path}...`);

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`STATUS: ${res.statusCode}`);
            try {
                const data = JSON.parse(body);
                if (res.statusCode === 200) {
                    console.log('SUCCESS: Video generation complete!');
                    if (data.videoUrl && data.videoUrl.startsWith('data:video/mp4;base64,')) {
                        console.log('Video data received as base64 (verified)!');
                        console.log('Base64 Length:', data.videoUrl.length);
                    } else {
                        console.log('Data received:', data);
                    }
                } else {
                    console.error('FAILED:', data.error || body);
                }
            } catch (e) {
                console.error('Error parsing JSON:', e.message);
                console.log('Raw body snippet:', body.substring(0, 100));
            }
        });
    });

    req.on('error', e => console.error('Request Error:', e.message));
    req.write(payload);
    req.end();
}

testLocalVideoGen();
