import app from "./app";
import express from "express";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use("/uploads", express.static("uploads"));
