import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'./',plugins:[react()],server:{port:5173}});
// Assets relativos funcionam no domínio do GitHub Pages e no desenvolvimento local.
