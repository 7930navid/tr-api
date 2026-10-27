const express = require('express');
const cors = require('cors');
const { translate } = require('google-translate-api-x');

const app = express();

app.use(cors());
// Middleware
app.use(express.json());

// ১. Detect Language to Specific Language Route
// রিকোয়েস্ট বডি: { "text": "Hello world", "to": "bn" }
app.post('/api/translate/auto', async (req, res) => {
    try {
        const { text, to } = req.body;

        if (!text || !to) {
            return res.status(400).json({
                success: false,
                error: 'Text and target language (to) are required.'
            });
        }

        // অনুবাদ এবং ভাষা ডিটেক্ট করা
        const result = await translate(text, { to });

        res.status(200).json({
            success: true,
            originalText: text,
            detectedLanguage: result.from.language.iso,
            targetLanguage: to,
            translatedText: result.text
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ২. Specific Language to Specific Language Route
// রিকোয়েস্ট বডি: { "text": "Hola mundo", "from": "es", "to": "en" }
app.post('/api/translate/custom', async (req, res) => {
    try {
        const { text, from, to } = req.body;

        if (!text || !from || !to) {
            return res.status(400).json({
                success: false,
                error: 'Text, source language (from), and target language (to) are required.'
            });
        }

        // নির্দিষ্ট সোর্স থেকে নির্দিষ্ট টার্গেটে অনুবাদ
        const result = await translate(text, { from, to });

        res.status(200).json({
            success: true,
            originalText: text,
            sourceLanguage: from,
            targetLanguage: to,
            translatedText: result.text
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// সার্ভার স্টার্ট
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Translation server is running on port ${PORT}`);
});