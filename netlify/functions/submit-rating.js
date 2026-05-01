const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // Setup CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // Ensure this is a POST request
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    if (!process.env.DATABASE_URL) {
      console.error("Missing DATABASE_URL");
      throw new Error("Server Configuration Error");
    }

    const sql = neon(process.env.DATABASE_URL);
    const data = JSON.parse(event.body);

    // Basic Validation
    if (!data.applicant_id || !data.interviewer_role || data.score === undefined) {
        return { 
            statusCode: 400, 
            headers, 
            body: JSON.stringify({ error: "Missing required fields (applicant_id, interviewer_role, score)" }) 
        };
    }

    // Insert the rating, or update it if this interviewer already rated this applicant
    await sql`
      INSERT INTO ratings (applicant_id, interviewer_role, score, notes)
      VALUES (
        ${data.applicant_id}, 
        ${data.interviewer_role}, 
        ${data.score}, 
        ${data.notes || ''}
      )
      ON CONFLICT (applicant_id, interviewer_role) 
      DO UPDATE SET 
        score = EXCLUDED.score, 
        notes = EXCLUDED.notes
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Rating saved successfully" }),
    };

  } catch (error) {
    // Log the full error securely to the Netlify Console
    console.error("Detailed Rating Submission Error:", error);

    // Send a safe, generic error to the frontend
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error. Please contact support." }),
    };
  }
};