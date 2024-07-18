import { Box, Avatar, IconButton } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Image from "next/image";
import React, { useContext } from 'react';

import ThemeContext from "../contexts/themeContext";
import Link from "next/link";

export default function Header() {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <Box
        sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            marginBottom: '5px',
            backgroundColor: (theme === 'light') ? '#f5f5f5' : '#121212',
            boxSizing: 'border-box'
        }}>
            <Link href='/'>
                <Image src={(theme=='light') ? '/kicklive-logo-black.png' : '/kicklive-logo-white.png'} alt='Kicklive Logo' objectFit="cover" width={150} height={56}/>
            </Link>
            <IconButton color={(theme === 'light') ? 'default' : 'success'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {(theme === 'light') ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
        </Box>
    );
}