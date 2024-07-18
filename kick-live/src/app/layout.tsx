'use client'
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/app/contexts/themeContext";
import useMediaQuery from '@mui/material/useMediaQuery';

import Header from "./components/header";
import { Box } from "@mui/material";


const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

// export const metadata: Metadata = {
//   title: "KickLive",
//   description: "Live Football Scores and Updates",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <html lang="en">
      <body className={poppins.className} style={{margin: 0}}>
        <ThemeProvider>
          <Header />
          <Box sx={{
            height: 'auto',
            bgcolor: 'background.default',
            color: 'text.primary',
            paddingLeft: isMobile ? '5%' : '10%',
            paddingRight: isMobile ? '5%' : '10%',
          }}>
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
