const { connectToDatabase } = require("./utils/db");

async function getCredential(leaf) {
  const db = await connectToDatabase();
  const user = await db.collection("identities").findOne({ "registryMetadata.merkleLeaf": leaf });
  return user;
}

module.exports = { getCredential };
