# ProjectIA_N8N

Repository in cui vengono salvati tutti i file necessari per il back-end e il front-end del sito web. 
Il sito viene utilizzato per eseguire in background una pipeline automatica di N8N hostata in locale.

L'applicazione genera dei riassunti attraverso un AI Agent, seguendo un modello JSON, usando come fonte un folder su Google Drive contenente delle trascrizioni di meeting verosimili.

Componenti del progetto:
- Folder condivisa su Google Drive;
- OpenRouter Chat Model (AI Agent);
- Parser JSON strutturato per l'output;
- Un Google Sheet per lo storico delle esecuzioni;
- Notifica di creazione o aggiornamento di un'issue con Gmail.

