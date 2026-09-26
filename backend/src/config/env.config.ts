export const AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://rec_user:rec_password@localhost:5432/rec',
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/translation',
  defaultLanguage: 'fa',
  supportedLanguages: ['fa', 'ru', 'en'],
};
