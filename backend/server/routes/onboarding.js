const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const { createClientFolder, uploadFile } = require("../services/driveService");

const { appendOnboarding } = require("../services/sheetsService");

console.log("📦 [ONBOARDING ROUTE] loaded");

router.post("/", upload.array("files", 50), async (req, res) => {
  console.log("\n\n==============================");
  console.log("🚀 [ONBOARDING ROUTE HIT]");
  console.log("📥 Incoming request received");
  console.log("==============================\n");

  console.log("📦 BODY:", req.body);
  console.log("📁 FILES COUNT:", req.files?.length || 0);

  try {
    console.log("🧠 Step 1: Creating client folder...");

    const folder = await createClientFolder(
      req.body.customerName,
      req.body.token,
    );

    console.log("📁 Folder created:", folder);

    const uploadedFiles = [];

    console.log("🧠 Step 2: Uploading files...");

    if (req.files?.length) {
      for (const file of req.files) {
        console.log("📤 Uploading file:", file.originalname);

        const uploaded = await uploadFile(
          folder.id,
          file.buffer,
          file.originalname,
        );

        console.log("✅ File uploaded:", uploaded);

        uploadedFiles.push(uploaded);
      }
    } else {
      console.log("⚠️ No files received in request");
    }

    console.log("🧠 Step 3: Saving onboarding data to sheets...");

    const sheetPayload = {
      timestamp: new Date().toISOString(),

      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,

      phone: req.body.businessPhone,

      businessName: req.body.businessName,

      goals: req.body.goal,

      currentProblems: req.body.aboutBusiness,

      additionalNotes: req.body.notes,

      product: req.body.product,

      folderId: folder.id,

      folderName: folder.name,

      folderUrl: `https://drive.google.com/drive/folders/${folder.id}`,
    };

    console.log("📊 SHEETS PAYLOAD:", sheetPayload);

    await appendOnboarding(sheetPayload);

    console.log("✅ SHEETS UPDATE COMPLETE");

    console.log("🎉 Sending response to client...");

    res.json({
      success: true,
      folderId: folder.id,
      folderName: folder.name,
      uploadedFiles,
    });

    console.log("📤 RESPONSE SENT SUCCESSFULLY");
  } catch (err) {
    console.log("\n🔥🔥🔥 ONBOARDING ROUTE ERROR 🔥🔥🔥");
    console.log("❌ Message:", err.message);
    console.log("🧨 Stack:", err.stack);
    console.log("📡 Response error:", err.response?.data);
    console.log("======================================\n");

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
