const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("Missing DATABASE_URL");
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Fetch all applicants, ordered by their ID
    const applications = await sql`
      SELECT id, role, name_en, class_grade, section 
      FROM applications 
      ORDER BY id ASC
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applications),
    };

  } catch (error) {
    console.error("Database fetch error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch applicants." }),
    };
  }
};