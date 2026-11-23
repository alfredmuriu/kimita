// pm2 process definition for the WhatsApp bridge on the VPS.
//   pm2 start ecosystem.config.cjs && pm2 save
//
// .cjs because package.json sets "type": "module" and pm2 loads this with require.
// cwd is pinned because index.js finds .env and auth_info relative to it: started
// from anywhere else it would come up with no session and ask for a new QR.

module.exports = {
  apps: [
    {
      name: 'agrikima-whatsapp',
      script: 'index.js',
      cwd: __dirname,
      autorestart: true,
      // Crash loops slow down instead of hammering WhatsApp with fresh logins.
      exp_backoff_restart_delay: 1000,
      max_memory_restart: '500M',
      time: true,
    },
  ],
}
