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

export const getProduct = async (req: any, res: Response) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
