({
    longText:'a'.repeat(16384),
    longTextMultiline:('a'.repeat(60)+'\n').repeat(400),
    fullScreen:('a'.repeat(80)+'\n').repeat(23),
    htmlDoc:`<!doctype html>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <!-- this is a comment -->
        <p>
            存在先於本質
    </body>
</html>
`,
})
