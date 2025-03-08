import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "../config/dotenv.config";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request, Response, NextFunction } from "express";
import { CloudFlareS3 } from "../config/cloudflare.config";


const uploadConfig = (foldername: string) =>
  multer({
    storage: multerS3({
      s3: CloudFlareS3,
      bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
      metadata: (req: Request, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req: Request, file, cb) => {
        cb(null, `${foldername}/${Date.now()}-${file.originalname}`);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB límite
    fileFilter: (req: Request, file, cb) => {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "application/pdf",
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten: ${allowedMimeTypes.join(", ")}`));
      }
    },
  });


const upload = (foldername: string) => {
  const uploader = uploadConfig(foldername);
  
  return {
    single: (fieldname: string) => (req: Request, res: Response, next: NextFunction) => {
      uploader.single(fieldname)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              error: true, 
              message: 'El archivo excede el límite de tamaño permitido (50MB)' 
            });
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
              error: true, 
              message: `Solo se permite subir un archivo en el campo (${fieldname}). Intenta subir los archivos de uno en uno.` 
            });
          } else {
            return res.status(400).json({ 
              error: true, 
              message: `Error en la carga del archivo: ${err.message}` 
            });
          }
        } else if (err) {
          return res.status(400).json({ 
            error: true, 
            message: err.message 
          });
        }
        
        next();
      });
    },
    
    array: (fieldname: string, maxCount?: number) => (req: Request, res: Response, next: NextFunction) => {
      uploader.array(fieldname, maxCount)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              error: true, 
              message: 'Uno o más archivos exceden el límite de tamaño permitido (50MB)' 
            });
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
              error: true, 
              message: `Se ha excedido el número máximo de archivos permitidos (${maxCount || 'sin límite definido'})` 
            });
          } else if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
              error: true, 
              message: `Se ha excedido el número máximo de archivos permitidos (${maxCount || 'sin límite definido'})` 
            });
          } else {
            return res.status(400).json({ 
              error: true, 
              message: `Error en la carga de los archivos: ${err.message}` 
            });
          }
        } else if (err) {
          return res.status(400).json({ 
            error: true, 
            message: err.message 
          });
        }
        next();
      });
    },
    
    fields: (fields: { name: string, maxCount?: number }[]) => (req: Request, res: Response, next: NextFunction) => {
      uploader.fields(fields)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              error: true, 
              message: 'Uno o más archivos exceden el límite de tamaño permitido (50MB)' 
            });
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
              error: true, 
              message: 'Se ha enviado un archivo en un campo no esperado' 
            });
          } else if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
              error: true, 
              message: 'Se ha excedido el número máximo de archivos permitidos para uno de los campos' 
            });
          } else {
            return res.status(400).json({ 
              error: true, 
              message: `Error en la carga de los archivos: ${err.message}` 
            });
          }
        } else if (err) {
          return res.status(400).json({ 
            error: true, 
            message: err.message 
          });
        }
        next();
      });
    }
  };
};

const deleteFileR2 = async (fileUrl: string): Promise<boolean> => {
  try {
    const fileName = fileUrl.split(`${R2.CLOUDFLARE_R2_PUBLIC_URL}/`)[1];
    
    if (!fileName) {
      console.error("URL del archivo inválida");
      return false;
    }
    
    const params = {
      Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: fileName,
    };
    
    const response = await CloudFlareS3.send(new DeleteObjectCommand(params));
    
    if (!response || response.$metadata.httpStatusCode !== 204) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteFileR2.", error);
    return false;
  }
};

export { upload, deleteFileR2 };