const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const { createClientFolder, uploadFile } = require("../services/driveService");

const { appendOnboarding } = require("../services/sheetsService");

router.post("/onboarding", upload.array("files", 50), async (req, res) => {
  try {
    // CREATE CLIENT FOLDER

    const folder = await createClientFolder(
      req.body.customerName,
      req.body.token,
    );

    const uploadedFiles = [];

    // UPLOAD FILES
    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await uploadFile(
          folder.id,
          file.path,
          file.originalname,
        );

        uploadedFiles.push(uploaded);
      }
    }

    // SAVE ONBOARDING DATA TO GOOGLE SHEETS

    await appendOnboarding({
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
    });

    res.json({
      success: true,
      folderId: folder.id,
      folderName: folder.name,
      uploadedFiles,
    });
  } catch (err) {
    console.error("========== ONBOARDING ERROR ==========");
    console.error(err);
    console.error(err.response?.data);
    console.error("======================================");

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
