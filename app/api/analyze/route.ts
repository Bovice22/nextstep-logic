import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 300; // 5 minute limit for deep crawling

export async function POST(req: Request) {
    const startTime = Date.now();
    let mainTitle = "";
    let finalData = "";

    // Debug info container
    let debugInfo: any = {
        logs: []
    };

    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        let targetUrl = url;
        if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
        // Only append slash if it looks like a directory (no extension)
        if (!targetUrl.endsWith('/') && !targetUrl.match(/\.[a-zA-Z0-9]{2,5}$/)) targetUrl += '/';

        const baseUrl = new URL(targetUrl);
        const domain = baseUrl.hostname.replace('www.', '');
        mainTitle = domain; // Default title

        const visited = new Set<string>();
        const scrapedPages = new Map<string, string>();

        // Queue for BFS
        const queue: string[] = [];

        // Discovery Helpers
        const discoverLinks = (sourceHtml: string, currentUrl: string) => {
            const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
            let match;
            while ((match = linkRegex.exec(sourceHtml)) !== null) {
                const href = match[2];
                try {
                    const absoluteUrl = new URL(href, currentUrl);
                    if (absoluteUrl.hostname.includes(domain) &&
                        !href.match(/\.(jpg|jpeg|png|gif|zip|css|js|mp4|mov|svg|woff2)$/i)) {
                        const cleanUrl = absoluteUrl.origin + absoluteUrl.pathname;

                        // Add to queue if not visited and not already in queue
                        if (cleanUrl !== targetUrl && !visited.has(cleanUrl)) {
                            if (!queue.includes(cleanUrl)) {
                                queue.push(cleanUrl);
                            }
                        }
                    }
                } catch (e) { }
            }
        };

        const cleanHtml = (html: string) => {
            return html
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "")
                .replace(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gmi, "")
                .replace(/<footer\b[^>]*>([\s\S]*?)<\/footer>/gmi, "")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        };

        // 1. Sitemap Scan
        const sitemapPaths = ['sitemap_index.xml', 'sitemap.xml', 'properties-sitemap.xml', 'listings-sitemap.xml'];

        await Promise.all(sitemapPaths.map(async (path) => {
            try {
                const sRes = await fetch(new URL(path, targetUrl).toString(), { signal: AbortSignal.timeout(5000) });
                if (sRes.ok) {
                    const xml = await sRes.text();
                    const locs = xml.match(/<loc>(.*?)<\/loc>/g);
                    if (locs) {
                        locs.forEach(loc => {
                            const link = loc.replace(/<\/?loc>/g, '').trim();
                            if (link.includes(domain) && !visited.has(link)) queue.push(link);
                        });
                    }
                }
            } catch (e) { }
        }));

        // 2. Initial Page Scan
        let mainContent = "";
        let isSPA = false;

        visited.add(targetUrl);
        debugInfo.targetUrl = targetUrl;

        try {
            const initialRes = await fetch(targetUrl, {
                signal: AbortSignal.timeout(15000),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            debugInfo.initialStatus = initialRes.status;
            const contentType = initialRes.headers.get('content-type') || '';
            debugInfo.initialContentType = contentType;

            if (initialRes.ok) {
                if (contentType.includes('application/pdf')) {
                    const arrayBuffer = await initialRes.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    debugInfo.pdfBufferLength = buffer.length;
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        const pdf = require('pdf-parse/lib/pdf-parse.js');
                        const data = await pdf(buffer);
                        // Store content directly
                        mainContent = `[PDF CONTENT EXTRACTED]\n${data.text.trim().substring(0, 10000)}`;
                        debugInfo.pdfParsed = true;
                        debugInfo.pdfTextLength = data.text.length;
                    } catch (e: any) {
                        debugInfo.pdfError = e.message;
                    }
                } else {
                    const html = await initialRes.text();
                    debugInfo.htmlLength = html.length;
                    discoverLinks(html, targetUrl);
                    const textContent = html.replace(/<[^>]+>/g, "").trim();

                    const isBlocked = textContent.includes("Request unsuccessful") ||
                        textContent.includes("Access Denied") ||
                        textContent.includes("Cloudflare");

                    if (!isBlocked) {
                        if (textContent.length < 500 && (html.includes('id="root"') || html.includes('id="__next"'))) {
                            isSPA = true;
                        } else {
                            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                            mainTitle = titleMatch ? titleMatch[1] : mainTitle;
                            mainContent = cleanHtml(html);
                        }
                    }
                }
            }
        } catch (e: any) {
            debugInfo.initialError = e.message;
        }

        // 3. Recursive Queue Processing (BFS)
        let currentIndex = 0;
        const processedLimit = 50;

        while (currentIndex < queue.length && scrapedPages.size < processedLimit) {
            if (Date.now() - startTime > 280000) break;

            const batchSize = 5;
            const batchToEnd = Math.min(currentIndex + batchSize, queue.length);
            const batchUrls = queue.slice(currentIndex, batchToEnd);
            currentIndex = batchToEnd;

            await Promise.all(batchUrls.map(async (link) => {
                if (visited.has(link)) return;
                visited.add(link);

                try {
                    const fetchUrl = isSPA ? `https://r.jina.ai/${link}` : link;
                    const res = await fetch(fetchUrl, {
                        signal: AbortSignal.timeout(10000),
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        }
                    });

                    if (res.ok) {
                        const contentType = res.headers.get('content-type') || '';
                        const pTag = new URL(link).pathname;

                        if (contentType.includes('application/pdf') || link.toLowerCase().endsWith('.pdf')) {
                            const arrayBuffer = await res.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
                            try {
                                // eslint-disable-next-line @typescript-eslint/no-var-requires
                                const pdf = require('pdf-parse/lib/pdf-parse.js');
                                const data = await pdf(buffer);
                                const pdfText = data.text.trim();
                                if (pdfText.length > 50) {
                                    scrapedPages.set(pTag, `[PDF CONTENT EXTRACTED FROM: ${link}]\n${pdfText.substring(0, 10000)}`);
                                }
                            } catch (pdfErr) { }
                        } else {
                            const content = await res.text();
                            if (!isSPA) discoverLinks(content, link);

                            const clean = isSPA ? content : cleanHtml(content);
                            if (clean.length > 200 && !clean.includes("Access Denied")) {
                                scrapedPages.set(pTag, clean.substring(0, 8000));
                            }
                        }
                    }
                } catch (e) { }
            }));
        }

        // 4. Aggregate 
        let aggregatedContext = `WEBSITE: ${mainTitle} (${targetUrl})\n\n`;
        aggregatedContext += `--- HOME PAGE ---\n${mainContent}\n\n`;

        scrapedPages.forEach((content, path) => {
            aggregatedContext += `--- PAGE: ${path} ---\n${content}\n\n`;
        });

        finalData = aggregatedContext.substring(0, 100000);

        // Fallback Logic
        const isThinContent = finalData.length < 2000;
        const isBlocked = finalData.includes("Request unsuccessful") ||
            finalData.includes("Access Denied") ||
            finalData.includes("Enable JavaScript") ||
            finalData.includes("Cloudflare");

        const isLowQuality = !finalData.toLowerCase().includes("services") &&
            !finalData.toLowerCase().includes("about") &&
            !finalData.toLowerCase().includes("contact");

        debugInfo.finalDataLength = finalData.length;
        debugInfo.isThin = isThinContent;
        debugInfo.isBlocked = isBlocked;
        debugInfo.isLowQuality = isLowQuality;

        if (isThinContent || isBlocked || isLowQuality) {
            debugInfo.fallbackEngaged = true;
            // Explicitly resolve the API key to ensure provider works
            const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

            if (apiKey) {
                try {
                    const google = createGoogleGenerativeAI({ apiKey: apiKey });

                    const isGym = domain.includes("fitness") || domain.includes("gym") || domain.includes("crossfit");
                    const specificInstructions = isGym
                        ? "CRITICAL: List specific gym equipment (treadmills, squat racks, free weights, hammer strength machines) found at this type of facility."
                        : "";

                    const prompt = `
                    You are a highly advanced web crawler simulator. 
                    The user is trying to scrape the website "${targetUrl}" for the company "${domain}" to build a customer service chatbot.
                    However, the site is blocking bots or is unavailable.

                    Your task is to GENERATE a realistic, detailed, and comprehensive "Simulated Website Crawl" for this company based on your public knowledge of them.
                    
                    Include:
                    1. A rich "Home Page" section with their likely value proposition and services.
                    2. A "Services/Products" section detailing what they offer (be specific for ${domain}).
                    3. A "Pricing" section (can be estimated or standard for the industry).
                    4. An "FAQ" section with 5-10 common customer questions and answers.
                    5. A "Contact" section.
                    ${specificInstructions ? `6. SPECIAL SECTION: ${specificInstructions}` : ""}

                    Format the output exactly like a scraped text export:
                    
                    WEBSITE: ${domain} (${targetUrl})

                    --- HOME PAGE ---
                    [Generated Home Content...]

                    --- PAGE: /services ---
                    [Generated Services Content...]
                    
                    ${isGym ? `
                    --- PAGE: /equipment ---
                    [Detailed list of likely equipment...]` : ""}

                    --- PAGE: /faq ---
                    [Generated FAQ Content...]
                    
                    Make it sound authentic, professional, and specific to the brand "${domain}".
                    `;

                    const { text } = await generateText({
                        model: google('gemini-flash-latest'),
                        prompt: prompt,
                    });

                    if (text && text.length > 500) {
                        finalData = text + "\n\n[NOTE: This content was AI-generated because the direct site crawl was blocked.]";
                        mainTitle = `${domain} (Simulated Demo)`;
                        debugInfo.fallbackSuccess = true;
                    }
                } catch (genError: any) {
                    debugInfo.fallbackError = genError.message;
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: finalData,
            title: mainTitle,
            pagesScraped: scrapedPages.size + (finalData.includes("Simulated") ? 0 : 1),
            debug: debugInfo
        });

    } catch (error: any) {
        console.error('Scraping error:', error);
        return NextResponse.json({ success: false, error: 'Deep crawl failed.' }, { status: 500 });
    }
}
