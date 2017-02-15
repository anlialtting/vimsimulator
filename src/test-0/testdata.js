({
    longText:'a'.repeat(16384),
    longTextMultiline:('a'.repeat(64)+'\n').repeat(1024),
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
