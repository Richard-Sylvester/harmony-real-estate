const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

router.get('/', async (req, res) => {
    try {
        // 1. Fetch all properties from MongoDB. 
        // We only need the _id and updatedAt fields to keep the query super fast.
        const properties = await Property.find({}, '_id updatedAt');

        // 2. Start building the XML string
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // 3. Add your main Homepage manually
        xml += '  <url>\n';
        xml += '    <loc>https://www.harmonyestates.in/</loc>\n';
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';

        // 4. Loop through every property in your database
        properties.forEach((property) => {
            // Format the date to YYYY-MM-DD (Google's preferred format)
            const date = property.updatedAt 
                ? property.updatedAt.toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0];

            xml += '  <url>\n';
            xml += `    <loc>https://www.harmonyestates.in/property/${property._id}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        // 5. Send the response as an official XML file
        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);

    } catch (error) {
        console.error("Sitemap generation failed:", error);
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;