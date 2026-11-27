const assetModel = require("../models/assetModel");

const VALID_ASSET_TYPES = [
  "Desktop",
  "Laptop",
  "Printer",
  "Monitor",
  "Switch",
  "Router",
  "UPS",
  "Other",
];

const VALID_ASSET_STATUSES = ["Active", "Under Repair", "Retired"];

const validateAsset = (data) => {
  const { branch_id, asset_name, asset_type = "Other", status = "Active" } = data;

  if (!branch_id || !asset_name?.trim()) {
    return "Branch and asset name are required";
  }

  if (!VALID_ASSET_TYPES.includes(asset_type)) {
    return `Asset type must be one of: ${VALID_ASSET_TYPES.join(", ")}`;
  }

  if (!VALID_ASSET_STATUSES.includes(status)) {
    return `Asset status must be one of: ${VALID_ASSET_STATUSES.join(", ")}`;
  }

  return null;
};

const getAssets = async (req, res) => {
  try {
    const filters = {
      branch_id:
        req.user.role === "Branch User" ? req.user.branch_id : req.query.branch_id,
      asset_type: req.query.asset_type,
      status: req.query.status,
      search: req.query.search,
    };

    const assets = await assetModel.getAllAssets(filters);
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve assets" });
  }
};

const getAsset = async (req, res) => {
  try {
    const asset = await assetModel.getAssetById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (req.user.role === "Branch User" && asset.branch_id !== req.user.branch_id) {
      return res.status(403).json({
        message: "Forbidden: You can only view assets assigned to your branch",
      });
    }

    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve asset" });
  }
};

const addAsset = async (req, res) => {
  try {
    const validationError = validateAsset(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const asset = await assetModel.createAsset({
      ...req.body,
      asset_name: req.body.asset_name.trim(),
      serial_number: req.body.serial_number?.trim(),
      brand: req.body.brand?.trim(),
      model: req.body.model?.trim(),
      asset_type: req.body.asset_type || "Other",
      status: req.body.status || "Active",
    });

    res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Serial number already exists" });
    }
    if (error.code === "23503") {
      return res.status(400).json({ message: "Selected branch does not exist" });
    }

    res.status(500).json({ message: "Failed to create asset" });
  }
};

const editAsset = async (req, res) => {
  try {
    const validationError = validateAsset(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const asset = await assetModel.updateAsset(req.params.id, {
      ...req.body,
      asset_name: req.body.asset_name.trim(),
      serial_number: req.body.serial_number?.trim(),
      brand: req.body.brand?.trim(),
      model: req.body.model?.trim(),
      asset_type: req.body.asset_type || "Other",
      status: req.body.status || "Active",
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({
      message: "Asset updated successfully",
      asset,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Serial number already exists" });
    }
    if (error.code === "23503") {
      return res.status(400).json({ message: "Selected branch does not exist" });
    }

    res.status(500).json({ message: "Failed to update asset" });
  }
};

const removeAsset = async (req, res) => {
  try {
    const asset = await assetModel.deleteAsset(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(409).json({
        message: "Cannot delete this asset because it has related records",
      });
    }

    res.status(500).json({ message: "Failed to delete asset" });
  }
};

module.exports = {
  getAssets,
  getAsset,
  addAsset,
  editAsset,
  removeAsset,
};

