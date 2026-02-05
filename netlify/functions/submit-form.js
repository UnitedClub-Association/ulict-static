const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // 1. CORS Headers - Allow requests from your website
  const headers = {
    'Access-Control-Allow-Origin': '*', // Change '*' to your specific domain in production for better security
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 2. Handle Preflight OPTIONS request (Browser checks permissions first)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK"
    };
  }

  // 3. Only allow POST requests for data submission
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    // 4. Check for Database Connection String
    if (!process.env.DATABASE_URL) {
      throw new Error("Missing DATABASE_URL environment variable");
    }

    const sql = neon(process.env.DATABASE_URL);
    const data = JSON.parse(event.body);

    // 5. Insert into Neon Database
    // Note: We expect the frontend to send data with these exact key names (snake_case)
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
      body: JSON.stringify({ message: "Application submitted successfully" }),
    };

  } catch (error) {
    console.error("Submission Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};