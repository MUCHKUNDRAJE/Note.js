import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname: string = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL: string | undefined = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST: string = path.join(process.env.APP_ROOT!, 'dist-electron')
export const RENDERER_DIST: string = path.join(process.env.APP_ROOT!, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT!, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

// ✅ Updated createWindow
function createWindow(): void {
  win = new BrowserWindow({
    show: false, // keep hidden until ready
    icon: path.join(RENDERER_DIST, 'Note.js.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Show only when ready
  win.once("ready-to-show", () => {
    win?.show();
  });
}

// ✅ Run app
app.whenReady().then(() => {
app.setAppUserModelId("Note.js");
  createWindow();

  ipcMain.on('show-notification', (_, { title, body }: { title: string; body: string; icon?: string }) => {
    new Notification({ title, body, icon: path.join(RENDERER_DIST, 'Note.js.png') }).show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
