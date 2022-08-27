//model
photo = {
  publicId: { type: String },
  url: { type: String },
};

//cloudinary configuration
cloudinary.config({
  cloud_name: config.get("cloudinary.cloudName"),
  api_key: config.get("cloudinary.apiKey"),
  api_secret: config.get("cloudinary.apiSecret"),
});

//cloudinary storage instantiated
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "BOOK_TREKKER/PRODUCTS",
  },
});

//multer file filter (only images are allowed)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new AppError("Only .png, .jpg and .jpeg format allowed!", 400));
  }
};

//file size limit to 1MB
const maxSize = 1 * 1024 * 1024;
const limits = { fileSize: maxSize };

//multer option objects
exports.multerOptions = {
  storage: storage,
  fileFilter,
  limits,
};

//create

exports.createProduct = catchAsync(async (req, res) => {
  const product = new Product(req.productData);

  await product.save();

  const newProduct = await Product.findById(product._id).populate(
    "category",
    "name _id"
  );

  res.send(newProduct);
});

// const path = require("path");

// exports.createProduct = catchAsync(async (req, res, next) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) return res.status(400).send("Image is not uploaded..");
//     const { name, description, price, category, quantity } = fields;
//     if (!name || !description || !price || !category || !quantity)
//       return res.status(400).send("All fields are required..");
//     let product = new Product(fields);
//     if (files.photo) {
//       // console.log(files.photo);
//       if (files.photo.size > 1000000) {
//         return res.status(400).send("Image should be less than 1mb");
//       }

//       product.photo.data = fs.readFileSync(files.photo.path);
//       product.photo.contentType = files.photo.type;
//     }
//     product.save();
//     res.send(product);
//     next();
//   });
// });
