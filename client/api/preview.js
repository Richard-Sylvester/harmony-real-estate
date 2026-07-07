export default async function handler(req, res) {
  // 1. Vercel automatically extracts the ID from the URL (e.g., /property/123)
  const { id } = req.query;

  try {
    // 2. Fetch the property data from your live backend
    // 🚨 IMPORTANT: Replace this URL with your actual live Render API URL!
    const backendUrl = `https://harmony-real-estate.onrender.com/api/properties/${id}`;
    const propertyRes = await fetch(backendUrl);
    const property = await propertyRes.json();

    // 3. Fetch your standard, blank React index.html from your live domain
    const frontendRes = await fetch('https://harmonyestates.in');
    let htmlData = await frontendRes.text();

    // 4. Format the Data for WhatsApp
    const imageUrl = property.images && property.images.length > 0 
      ? property.images[0] 
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
    
    const priceString = `₹${property.price.toLocaleString('en-IN')}`;

    // 5. The Injection: Create the rich meta tags
    const metaTags = `
      <title>${property.title} | Harmony</title>
      <meta property="og:title" content="${property.title} - ${priceString}" />
      <meta property="og:description" content="${property.location} • ${property.category}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="https://harmonyestates.in/property/${id}" />
      <meta name="twitter:card" content="summary_large_image" />
    `;

    // 6. Inject our tags directly into the <head> of the HTML
    htmlData = htmlData.replace('<head>', `<head>\n${metaTags}`);

    // 7. Send the perfectly formed HTML to the WhatsApp Bot!
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlData);

  } catch (error) {
    console.error("Preview Generation Error:", error);
    // Failsafe: If anything breaks, just send them the normal blank React app
    res.redirect(302, '/');
  }
}