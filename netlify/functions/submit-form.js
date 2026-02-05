const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

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

    await sql`
      INSERT INTO applications (
        role, name_en, name_bn, father_en, father_bn, 
        mother_en, mother_bn, address, email, mobile, 
        class_grade, section, version, manifesto
      )
      VALUES (
        ${data.role}, ${data.name_en}, ${data.name_bn}, 
        ${data.father_en}, ${data.father_bn}, ${data.mother_en}, 
        ${data.mother_bn}, ${data.address}, ${data.email}, 
        ${data.mobile}, ${data.class}, ${data.section}, 
        ${data.version}, ${data.manifesto}
      )
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Success" }),
    };

  } catch (error) {
    // SECURITY: Log the full error to Netlify Console (Private)
    console.error("Detailed Submission Error:", error);

    // SECURITY: Send a generic error to the User (Public)
    // This prevents leaking passwords if the DB connection fails
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error. Please contact support." }),
    };
  }
};