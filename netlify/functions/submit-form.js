const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const data = JSON.parse(event.body);

    // Insert into Neon Database
    // We map 'class' (reserved word) to 'class_grade'
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
      body: JSON.stringify({ message: "Success" }),
    };

  } catch (error) {
    console.error("Database Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};