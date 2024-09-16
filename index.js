/*
    Mi szükséges ahhoz, hogy tudjunk CSS-et használni és ehhez készíteni kell egy assets mappát!!! 
    Abban csináltunk egy CSS fájlt. 

    Ezt a CSS-t akarjuk majd megadni .ejs fájloknak pl. most a home.ejs-nek 
    -> 
    <head>
    <link rel="stylesheet" href="../assets/style.css"; 
    </head>

    <h1>This is the home page!</h1>
    <h2> ><%= title %></h2>

    Megadhatjuk ilyen formában, hogy csinálunk az ejs egy head-et, ahova a link-vel megadjuk az adott css-t az adott elérési útvonalon!!!
    
    De nagyon fontos, hogy míg a views-nak nem kell, hogy express.static(), mert az dinamikus fájlok vannak ott eltárolva 
    de viszont itt kell, mert a css az statikus fájl
    -> 
*/
app.use(express.static("assets"));

//további dolgok amik kellenek 
import express from "express";
const app = express();

app.set("view engine", "ejs");

//ha a form-val akarunk majd dolgozni
app.use(express.urlencoded({extended: true}));

/*
    És ha be van írva ez, akkor elérhetővé válnak az összes css fájl, ami abban a mappában van, amit beírtunk!!! 

    De ez így nem a legjobb megoldás, mert lehet hogy több css mappát akarunk majd hozzáadni meg egyébb állományokat 
    tehát, hogy beírjuk minden ejs-be így head tag-be ez müködik de nem a legjobb megoldás

    Csináltunk az assets-ban még két külön mappát, az egyik a styles (amikeben lesznek a css faájlok) a másik pedig egy js mappa 
    És akkor ehhez a home.ejs-ben nem csak egy css fájl tudunk linkelni hanem egy js fájlt is
    ->
    <head>
    <link rel="stylesheet" href="../styles/style.css">
    <script src="../js/script.js" ></script>
    </head>

    <h1>This is the home page!</h1>
    <h2> ><%= title %></h2> 

    És ha a script.js kiírunk valamit a console-ra, akkor az meg fog jelenni a localhost:3000-en (home.ejs)
    script.js ezt írtuk be -> console.log("asdf");

    De ha ezt szeretnénk még bővitenni, akkor az lenne a legjobb, hogy csinálunk egy common mappát a views-ban 
    és abban lesz egy olyanunk, hogy head.ejs 
    És a head.ejs-be belerakjuk ezt, hogy 
    -> 
    <head>
    <link rel="stylesheet" href="../styles/style.css">
    <script src="../js/script.js" ></script>
    </head>

    A home.ejs-be, ahol eddig ez benne volt, hogy head meg a css, js fájl 
    Azt most be kell include-olni a head.ejs fájlból
    -> 
    <%-include("common/head.ejs")%>

    És nagyon fontos, hogyha include-elni akarunk valamit, akkor nem egy =, mint a behelyetesítésnél, hanem egy - !!!!!!! 

    És akkor ezt ugyanígy be tudjuk include-olni az összes ejs fájlunkban ami van, tehát nem csak a home.ejs, hanem products.ejs, profile.ejs 
    amik voltak a múlt órán!!!! 
    Mindenhova be kell ezt tenni legfelülre 
    -> <%-include("common/head.ejs")%>

    Csak így meg az a probléma, hogy minden fájlhoz egyesével hozzá kell adogatni!!! 
    -> 
    Erre a megoldás, hogy csinálunk egy layout-ot, ami minden egyes oldalra vonatkozik 
    És akkor abba a layout-ba töltjük be a body részbe azt, hogy form meg product

    Views-ben csinálunk egy layouts mappát, amiben csinálunk egy ilyen ejs-t, hogy public_layout.ejs

    És ez a layout majd minden egyes oldalra fog vonatkozni
    És abba a layout-ba töltenénk be a BODY részbe a ezt, hogy form, home de ezt majd az index.js-en, amikor csinálnuk egy get-es kérés, 
    hogy megjelenítsük az oldalt és ott a render-vel meghatározzuk, hogy melyik ejs-es HTML oldalt akarjuk majd betölteni, ezt is ott kell majd 
    átadni neki!!!!!! 

    És ez majd úgy fog kinézni, hogy ott lesz egy head-ünk 
    A head pedig az lesz amit megcsináltunk a common mappa head.ejs-ébe, tehát ezt kell majd oda INCLUDE-olni!!! 

    eddig ez van a layout_public.ejs-ben 
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <%-include("../common/head")%>
    </head>
    <body>
        
    </body>
    </html>

    fontos, hogy oda kell figyelni az elérési útvonalra, mert itt ki kell lépni egyet utána bemenni a common-ba és ott lesz majd a 
    head, amit ide be akarunk hívni/include-olni -> <%-include("../common/head")%>

    És ami nagyon fontos, hogy itt lesz egy body változó a body-ban!!!! 
    <head>
    <%-include("../common/head")%>
    </head>
    <body>
        <%-body%>
    </body>
    </html>

    és ebbe a body részbe fogjuk majd betölteni a form-ot, home.ejs meg amit majd akarunk 
    de csak abban az esetben, ha feltöltjük az express-ejs-layouts-ot 
    ->
    npm i express-ejs-layouts 
    és ezt majd be is kell hívni az index-js-en, hogy elérhető legyen az import-val!!! 
*/
import expressEjsLayouts from "express-ejs-layouts";

/*
    És ezt majd használni is kell a use-val!! 
    Ezek ilyen middleware-ek, beérkezik egy kérés utána lefutnak a middleware-ek és utána válaszol a szerver 
    Mert a middleware-eknek pont az a lényege, hogy valamilyen formában megmásíthatják a választ 
    Pl. olyan formában, hogy itt a render-t hívjuk meg 
    -> 
    app.get("/", (req, res)=> {
        res.render('home', {title: "Home Page!"});
    })
*/
app.use(expressEjsLayouts);
/*
    És úgy tudjuk megmondani, hogy milyen layout-hoz tartozik az adott PAGE
    hogy megadjuk, hogy mi a layout-ja -> layout: "layout/layout/public";
    ami nagyon fontos itt, hogy a render-nél meghatározzuk egyszer, hogy melyik ejs fájlt akarjuk majd renderelni 
    és utána pedig át tudjuk adni a dolgokat egy kapcsos zárójelben {}
        1. title -> hogy mi legyen a title-ja az oldalnak, amit majd kiír, ha meglátogatjuk a böngészőben 
        2. layout -> hogy melyik layout-ot fogjuk majd használni, ahol be van hívva már a CSS, amit megcsináltunk a head.ejs-ben 
        ->
*/
app.get("/", (req, res)=> {
    res.render('home', {title: "Home Page", layout:"./layout/layout_public"});
});

/*
    Ez azért jó nekünk, mert egyetlen egyszer kell majd behívni a head-et 
    <head>
    <%-include("../common/head")%>
    </head>

    és nem úgy, hogy mindenegyik ejs (home, profile, products stb.) fájlhoz külön külön 
    Meg az összes állományt, amire hivatkozunk azt egyetlen egyszer kell majd behívnunk és csak azt kell meghatározni, hogy melyik 
    layout tölti be az adott page-t 
    Tehát magát a layout-ot tölti be!!! 

    És ezt a layout-ot az összesnek be ejs-nek, amit csináltunk be tudjuk állítani, nem csak a home-nak 
*/
app.get("/profile", (req, res)=> {
    res.render('profile', {
        user: 
        {
            userName: "Olivér", 
            email: "kovacs.oliver1989@gmail.com",
            idAdmin: false
        },
        layout: "./layout/layout_admin.ejs" //!!!!!!!!!!!!!!!!!!!!!!
    })
});

/*
    De ha van layout_public, akkor csinálnuk egy layout_admin.ejs-t, ami arra a felületre van ami már nem publikus felület 
    mondjuk egy admin-nak
    ->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <%-include("../common/head")%>
    </head>

    <body>
        <h2>Admin felület</h2>
        <%-body%>
    </body>
    </html>

    Ami nagyon hasonlóan néz ki, mint a public 
    1. be kell hívni include-val a head-et, amiben belinkeltük a CSS-t, de itt tudnánk script-elni egy js-t is 
    2. body-ban átadjuk majd a body-t 
    és még itt kiírtuk egy h2-ben, hogy admin felület

    És ha beírjuk, hogy localhost:3000/profile
    akkor kiírja, hogy Admin felület, amit beírtunk egy h2-es be a layout_admin.ejs-be 
    és alatta meg fog jelenni, ami van a profile.ejs-be, mert oda van betöltve a body!!!! 
*/
app.get("/products", (req, res)=> {
    res.render("products", {
        products: [
            {
                productID: 1,
                productName: "porzsák nélküli kávéföző",
                price: "megfizethetetlen"
            },
            {
                productID: 2,
                productName: "Fém faház",
                price: 65000
            }
        ],
        layout: "./layout/layout_public" //!!!! 
    })
});

/*
    következő lecke, hogyan kapcsoljuk össze az adatbázist a EJS-es dologgal

    Amit itt csináltunk lépésről lépésre 
    1. fel kell telepíteni az npm i ejs és az npm i express-ejs-layouts-ot, npm i init npm i express 
    2. van egy js fájlunk ahol létrehozzuk majd a dolgokat 
        itt be kell majd importálni az express-et, az ejs-t és az express-ejs-layouts-ot 
        express -> import express from "express";
        megcsináljuk a connection-ot, amit majd listen-elünk egy port-on 
        const app = express();
        app.listen(3000, "The server is listening on port 3000");

        be kell majd use-olni meg set-elni bizonyos beállításokat, middleware-eket 
        app.set("view engine", "ejs");
        app.use(urlencoded({extended: true}));
        app.use(express.static("assets")); -> ahol vannak a statikus fájlok pl. CSS
        app.use(expressEjsLayouts);

    3. Tegyük fel, hogy van egy assets mappánk és abban létre van hozva mondjuk egy styles.css meg egy views mappa, ahol vannak az ejs fájljaink
    Létrehozunk egy common mappát a views-ban, ahol csinálunk egy head.ejs-t 
    <head>
    <link rel="stylesheet" href="../styles/style.css">
    <script src="../js/script.js" ></script>
    </head>
    ez csak arra szolgál, hogy van egy head és ide be van linkelve a css, amit majd használunk az ejs-ekre, hogy home, profile stb.

    4. Ha meg van a views-ben a common mappa, amiben van egy head.ejs
    Akkor létrehozunk ugyanide a views-ba egy olyat, hogy layout_public meg egy olyat, hogy layout_admin 
    <head>
    <%-include("../common/head")%>
    </head>

    <body>
        <h2>Admin felület</h2>
        <%-body%>
    </body>
    </html>
    Itt két fontos dolog történik 
    - be lesz hívva az include-val a head.ejs, fontos az elérési útvonal -> <%-include("../common/head")%>
    - a body-ban be lesz hívva a body <%-body%>
        ami majd a home vagy products vagy akármelyiknek lesz a body-ja 
        mert azokban csak ilyenek vannak, hogy h1, h2... meg div és nem egy teljes HTML szerkezet, csak a body 

    5. Ha meg van minden, akkor visszamegyünk a fő js-re általában index.js a neve 
    itt megcsináljuk egy get-es kéréssel az oldalt egy bizonyos url-en, amit majd a get-es kérés első paraméterében meghatározunk 
    app.get("/") vagy app.get("/profile")
    utána fontos, hogy van egy req meg egy res és itt majd res lesz mert meg szeretnénk valamit jeleníteni az oldalon és nem várunk 
    semmit a req-ben, mint pl. egy post-nál a body-t, mert itt nincs is body a get-esnél 
    app.get("/", (req, res)=> {
        res.render()    
    })
    És itt a render-ben, elöször meg kell adni, hogy melyik ejs-t akarjuk render-elni 
    pl. home-ot, ami jelenleg csak így néz ki 
    <h1>This is the home page!</h1>
    <h2> ><%= title %></h2>
    itt meg kell nézni, hogy vár-e valamit -> igen egy title-t amit majd meg kell adni egy {}-ben, ez lesz a második paraméter 
    {title: "Hello Dalma"};
    és mivel van layout-unk hiszen majd az adja a CSS-t, mert az be van linkelve a head.ejs-be, ami meg meg van hívva a layout_admin.ejs-ben 
    head.ejs
    <head>
    <link rel="stylesheet" href="../styles/style.css">
    <script src="../js/script.js" ></script>
    </head>

    layout_public.ejs

    <head>
    <%-include("../common/head")%>
    </head>
    <body>
        <%-body%>
    </body>
    </html>
    tehát ilyen esetben biztos, hogy meg kell adni egy layout-ot arra a layout-ra, amit akarunk 
    -> 
    app.get("/", (req, res)=> {
        res.render("home", {title: "Hello Dalma", layout: layout/layout_public}) -> itt is fontos az elérési útvonal!!!  
    });

    de nem csak annyit várhat, hogy title, hanem pl. a products-nál ott csinálunk egy tömböt, objektumokkal abban adatokkal, amit vár 
    a products.ejs és ott meg végigmegyünk rajta egy forEach-vel és az lesz majd megjelenítve!!!!!! 

    Tehát ez lesz majd megjelenítve a body-ban, mert azt írtuk, hogy a products.ejs jelenítse meg ha /products az URL 
    <% products.forEach((p)=> { %>
    <div>
        <h3><%=p.productName%></h3>
        <h5><%=p.price%> Ft.%></h5>
    </div>
    <% }) %>

    és majd ezekből az adatokból, amit itt megadtunk, hogy products: ... 
    de ezek az adatok majd jöhetnek egy adatbázisból is!!! 

    app.get("/products", (req, res)=> {
    res.render("products", {
        products: [
            {
                productID: 1,
                productName: "porzsák nélküli kávéföző",
                price: "megfizethetetlen"
            },
            {
                productID: 2,
                productName: "Fém faház",
                price: 65000
            }
        ],
        layout: "./layout/layout_public" //!!!! 
    })
});
*/