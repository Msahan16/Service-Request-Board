import '@/styles/globals.css';

export const metadata = {
  title: 'Service Request Board',
  description: 'Find and manage home service requests easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
