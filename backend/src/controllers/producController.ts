import { Request, Response } from "express";
import { Product } from "../models/Product";

export const createProduct = async (req: any, res: Response) => {
    try {
        const { name, content, brand, price, model, packageSize } = req.body;

        const image = req.file ? "/uploads/" + req.file.filename : null;
        
        if (!name || !content || !price) {
            return res.status(400).json({
                message: 'نام، توضیحات و قیمت محصول اجباری هستند'
            });
        }

        const product = await Product.create({
            name,
            content,
            image,
            brand,
            price,
            model,
            packageSize
        });

        res.status(201).json({
            message: "محصول با موفقیت ایجاد شد",
            product
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "پست مورد نظر پیدا نشد" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "پست مورد نظر پیدا نشد" });
    }

    res.status(200).json({ 
      message: "پست با موفقیت حذف شد",
      post: deletedProduct 
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const productId = req.params.id;

    const { name, content, brand, price, model, packageSize } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "محصول مورد نظر پیدا نشد" });
    }

    // اگر عکس جدید آپلود شد
    const image = req.file ? "/uploads/" + req.file.filename : product.image;

    // آپدیت محصول
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        content,
        brand,
        price,
        model,
        packageSize,
        image
      },
      { new: true } // محصول آپدیت‌شده برگردد
    );

    res.status(200).json({
      message: "محصول با موفقیت بروزرسانی شد",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "پست یافت نشد" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
