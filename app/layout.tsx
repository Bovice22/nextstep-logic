
import './globals.css';
import ChatWidget from '../components/ChatWidget';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'NextStep Logic - AI Automation That Helps Your Business Run Better',
    description: 'NextStep Logic helps small businesses automate customer communication, streamline workflows, and operate more efficiently using practical AI solutions.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
            </head>
            <body>
                {children}
                <ChatWidget />
            </body>
        </html>
    );
}
