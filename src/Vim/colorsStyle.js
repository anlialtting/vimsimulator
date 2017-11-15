export default`div.webvim.cli{
    --color3i:yellow;
    --color4:blue;
    --color4i:dodgerblue;
    --background-color:black;
    --foreground-color:lightgray;
    --middle-color:gray;
    --cursor-bg:var(--foreground-color);
    --cursor-fg:var(--background-color);
}
div.webvim.cli .color4i{
    color:var(--color4i);
    --cursor-bg:var(--color4i);
    --cursor-fg:var(--background-color);
}
div.webvim.cli .cursor{
    background-color:var(--cursor-bg);
    color:var(--cursor-fg);
}
`
