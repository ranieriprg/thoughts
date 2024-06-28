const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

//models
const Toughts = require("./models/Toughts");
const User = require("./models/User");

//routes
const toughtRoute = require("./routes/toughtRoute");
const authRoutes = require("./routes/authRoutes");

//controlers
const ToughtController = require("./controllers/ToughtController");

app.set("view engine", "handlebars");
app.use(express.static("public"));

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
  })
);

//receber a resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//session midleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "session"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

//flash messages
app.use(flash());

//salvar a sessão
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }

  next();
});
//routes
app.use("/toughts", toughtRoute);
app.use("/", authRoutes);

app.use("/", ToughtController.showToughts);

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((erro) => {
    console.log(`erro ao conectar ${erro}`);
  });
